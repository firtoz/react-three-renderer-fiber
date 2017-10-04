import * as React from "react";

import ReactThreeRenderer from "../../src/core/renderer/reactThreeRenderer";

import * as THREE from "three";

import dirtyChai = require("dirty-chai");
import {Object3D} from "three";

import * as PropTypes from "prop-types";
import * as ReactDOM from "react-dom";
import React3 from "../../src/app/React3";

chai.use(dirtyChai);

describe("core", () => {

  describe("ReactThreeRenderer", () => {
    describe("with a canvas", () => {
      let canvas: HTMLCanvasElement;

      before(() => {
        canvas = document.createElement("canvas");

        document.body.appendChild(canvas);
      });

      it("can render into a canvas", (done) => {
        let webglRenderer: THREE.WebGLRenderer;

        function webglRendererRef(renderer: THREE.WebGLRenderer) {
          webglRenderer = renderer;
        }

        ReactThreeRenderer.render(<webglRenderer ref={webglRendererRef} width={5} height={5} />, canvas, () => {
          chai.expect(webglRenderer).to.be.an.instanceOf(THREE.WebGLRenderer);
          chai.expect(webglRenderer.domElement).to.equal(canvas);

          ReactThreeRenderer.unmountComponentAtNode(canvas, () => {
            chai.expect(webglRenderer, "webglRenderer should have been null").to.be.null();

            done();
          });
        });
      });

      after(() => {
        document.body.removeChild(canvas);
      });
    });

    describe("generic", () => {
      it("can render into another object", (done) => {
        const parentObject = new THREE.Object3D();

        let childObject: THREE.Object3D;

        function object3DRef(renderer: THREE.Object3D) {
          childObject = renderer;
        }

        ReactThreeRenderer.render(<object3D ref={object3DRef} />, parentObject, () => {
          chai.expect(childObject).to.be.an.instanceOf(THREE.Object3D);

          chai.expect(childObject.parent).to.equal(parentObject);
          chai.expect(parentObject.children[0]).to.equal(childObject);

          ReactThreeRenderer.unmountComponentAtNode(parentObject, () => {
            chai.expect(childObject, "childObject should have been null").to.be.null();

            chai.expect(parentObject.children.length, "Child object should have been removed from the parent")
              .to.equal(0);

            done();
          });
        });
      });
    });
  });

  describe("callback order", () => {
    it("should execute callbacks in the right order", (done) => {
      const callbackOrder: string[] = [];

      class DOMCallbackTester extends React.Component<{ name: string }> {
        public componentWillMount() {
          callbackOrder.push(`will mount ${this.props.name}`);
        }

        public componentDidMount() {
          callbackOrder.push(`did mount ${this.props.name}`);
        }

        public componentWillUnmount() {
          callbackOrder.push(`will unmount ${this.props.name}`);
        }

        public render(): any {
          return this.props.children;
        }
      }

      const container = document.createElement("div");
      document.body.appendChild(container);

      let index = 0;

      ReactDOM.render(<DOMCallbackTester name={`component-${index++}`}>
        <DOMCallbackTester name={`component-${index++}`}>
          <DOMCallbackTester name={`component-${index++}`}>
            <DOMCallbackTester name={`component-${index++}`}>
              <DOMCallbackTester name={`component-${index}`}>
                <div />
              </DOMCallbackTester>
            </DOMCallbackTester>
          </DOMCallbackTester>
        </DOMCallbackTester>
      </DOMCallbackTester>, container);

      ReactDOM.unmountComponentAtNode(container);

      const domCallbackOrder = callbackOrder.concat();

      callbackOrder.splice(0);

      const obj3d = new Object3D();

      index = 0;

      ReactThreeRenderer.render(<DOMCallbackTester name={`component-${index++}`}>
        <DOMCallbackTester name={`component-${index++}`}>
          <DOMCallbackTester name={`component-${index++}`}>
            <DOMCallbackTester name={`component-${index++}`}>
              <DOMCallbackTester name={`component-${index}`}>
                <object3D />
              </DOMCallbackTester>
            </DOMCallbackTester>
          </DOMCallbackTester>
        </DOMCallbackTester>
      </DOMCallbackTester>, obj3d);

      ReactThreeRenderer.unmountComponentAtNode(obj3d);

      const r3rCallbackOrder = callbackOrder.concat();

      callbackOrder.splice(0);

      index = 0;

      ReactDOM.render(<DOMCallbackTester name={`component-${index++}`}>
        <DOMCallbackTester name={`component-${index++}`}>
          <DOMCallbackTester name={`component-${index++}`}>
            <React3>
              <DOMCallbackTester name={`component-${index++}`}>
                <DOMCallbackTester name={`component-${index}`}>
                  <webglRenderer width={5} height={5} />
                </DOMCallbackTester>
              </DOMCallbackTester>
            </React3>
          </DOMCallbackTester>
        </DOMCallbackTester>
      </DOMCallbackTester>, container);

      ReactDOM.unmountComponentAtNode(container);

      const mixedCallbackOrder = callbackOrder.concat();

      callbackOrder.splice(0);

      chai.expect(r3rCallbackOrder).to.deep.equal(domCallbackOrder);
      chai.expect(mixedCallbackOrder).to.deep.equal(domCallbackOrder);

      done();
    });
  });

  describe("context", () => {
    it("should pass context within components", (done) => {
      class ContextParent extends React.Component<{ value: string }> {
        public static childContextTypes = {
          testValue: PropTypes.string,
        };

        public getChildContext() {
          return {
            testValue: this.props.value,
          };
        }

        public render() {
          return <object3D>{
            this.props.children
          }</object3D>;
        }
      }

      interface ITestContext {
        testValue: string;
      }

      let testContext: ITestContext & {
        from: string,
      } = {
        from: "init",
        testValue: "unset",
      };

      class ContextChild extends React.Component {
        public static contextTypes = {
          testValue: PropTypes.string,
        };

        constructor(props: any, context: ITestContext) {
          super(props, context);

          testContext = Object.assign({}, context, {
            from: "constructor",
          });
        }

        public componentWillUpdate(nextProps: Readonly<any>,
                                   nextState: Readonly<any>,
                                   nextContext: ITestContext): void {
          testContext = Object.assign({}, nextContext, {
            from: "update",
          });
        }

        public render() {
          return <object3D />;
        }
      }

      class ContextPassThrough extends React.Component {
        constructor(props: any, context: ITestContext) {
          super(props, context);
        }

        public render() {
          return <object3D>{this.props.children}</object3D>;
        }
      }

      const container = new Object3D();

      ReactThreeRenderer.render(<ContextParent
        value={"first-value"}>
        <ContextChild />
      </ContextParent>, container, () => {
        chai.expect(testContext.from).to.equal("constructor");
        chai.expect(testContext.testValue).to.equal("first-value");

        ReactThreeRenderer.render(<ContextParent
          value={"second-value"}>
          <ContextChild />
        </ContextParent>, container, () => {
          chai.expect(testContext.from).to.equal("update");
          chai.expect(testContext.testValue).to.equal("second-value");

          ReactThreeRenderer.render(<ContextParent
            value={"third-value"}>
            <ContextPassThrough>
              <ContextChild />
            </ContextPassThrough>
          </ContextParent>, container, () => {
            chai.expect(testContext.from).to.equal("constructor");
            chai.expect(testContext.testValue).to.equal("third-value");

            ReactThreeRenderer.unmountComponentAtNode(container, done);
          });
        });
      });
    });

    it("should pass context through React3", (done) => {
      class ContextParentDOM extends React.Component<{ value: string }> {
        public static childContextTypes = {
          testValue: PropTypes.string,
        };

        public getChildContext() {
          return {
            testValue: this.props.value,
          };
        }

        public render() {
          return <div>{
            this.props.children
          }</div>;
        }
      }

      interface ITestContext {
        testValue: string;
      }

      let testContext: ITestContext & {
        from: string,
      } = {
        from: "init",
        testValue: "unset",
      };

      class ContextChild extends React.Component {
        public static contextTypes = {
          testValue: PropTypes.string,
        };

        constructor(props: any, context: ITestContext) {
          super(props, context);

          testContext = Object.assign({}, context, {
            from: "constructor",
          });
        }

        public componentWillUpdate(nextProps: Readonly<any>,
                                   nextState: Readonly<any>,
                                   nextContext: ITestContext): void {
          testContext = Object.assign({}, nextContext, {
            from: "update",
          });
        }

        public render() {
          return <object3D />;
        }
      }

      const container = document.createElement("div");
      document.body.appendChild(container);

      ReactDOM.render(<div>
        Test!
        <ContextParentDOM value={"first-value"}>
          <React3 contextPassThrough={ContextChild.contextTypes}>
            <webglRenderer width={55} height={55}>
              <scene>
                <ContextChild />
              </scene>
            </webglRenderer>
          </React3></ContextParentDOM></div>, container, () => {
        chai.expect(testContext.from).to.equal("constructor");
        chai.expect(testContext.testValue).to.equal("first-value");

        ReactDOM.render(<div>
          Test!
          <ContextParentDOM value={"second-value"}>
            <React3 contextPassThrough={ContextChild.contextTypes}>
              <webglRenderer width={55} height={55}>
                <scene>
                  <ContextChild />
                </scene>
              </webglRenderer>
            </React3></ContextParentDOM></div>, container, () => {
          chai.expect(testContext.from).to.equal("update");
          chai.expect(testContext.testValue).to.equal("second-value");

          ReactDOM.render(<div>
            Test!
            <ContextParentDOM value={"third-value"}>
              <React3 contextPassThrough={ContextChild.contextTypes}>
                <webglRenderer width={55} height={55}>
                  <scene>
                    <ContextChild />
                  </scene>
                </webglRenderer>
              </React3></ContextParentDOM></div>, container, () => {
            chai.expect(testContext.from).to.equal("update");
            chai.expect(testContext.testValue).to.equal("third-value");

            ReactDOM.unmountComponentAtNode(container);

            done();
          });
        });
      });
      //
      // ReactThreeRenderer.render(<ContextParent
      //   value={"first-value"}>
      //   <ContextChild />
      // </ContextParent>, container, () => {
      //   chai.expect(testContext.from).to.equal("constructor");
      //   chai.expect(testContext.testValue).to.equal("first-value");
      //
      //   ReactThreeRenderer.render(<ContextParent
      //     value={"second-value"}>
      //     <ContextChild />
      //   </ContextParent>, container, () => {
      //     chai.expect(testContext.from).to.equal("update");
      //     chai.expect(testContext.testValue).to.equal("second-value");
      //
      //     ReactThreeRenderer.render(<ContextParent
      //       value={"third-value"}>
      //       <ContextPassThrough>
      //         <ContextChild />
      //       </ContextPassThrough>
      //     </ContextParent>, container, () => {
      //       chai.expect(testContext.from).to.equal("constructor");
      //       chai.expect(testContext.testValue).to.equal("third-value");
      //
      //       done();
      //     });
      //   });
      // });
    });
  });
});
