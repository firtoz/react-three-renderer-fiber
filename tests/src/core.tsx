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
          console.log("renderer: ", !!renderer);
          webglRenderer = renderer;
        }

        ReactThreeRenderer.render(<webglRenderer ref={webglRendererRef} width={5} height={5} />, canvas, () => {
          chai.expect(webglRenderer).to.be.an.instanceOf(THREE.WebGLRenderer);
          chai.expect(webglRenderer.domElement).to.equal(canvas);

          ReactThreeRenderer.unmountComponentAtNode(canvas, () => {
            console.log("unmounted?");

            chai.expect(webglRenderer, "webglRenderer should have been null").to.be.null();

            done();
          });

          console.log("after unmount");
        });
      });

      after(() => {
        console.log("canvas!!");
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

          console.log("props: ", props, "context:", context);

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
