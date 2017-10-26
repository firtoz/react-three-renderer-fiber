import * as PropTypes from "prop-types";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Object3D} from "three";
import React3 from "../../../src/bridge/React3";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";
import {testContainers} from "../index";

const {div: testDiv} = testContainers;

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

    ReactDOM.render(<div>
      Test!
      <ContextParentDOM value={"first-value"}>
        <React3 contextPassThrough={ContextChild.contextTypes}>
          <webGLRenderer width={55} height={55}>
            <scene>
              <ContextChild />
            </scene>
          </webGLRenderer>
        </React3></ContextParentDOM></div>, testDiv, () => {
      chai.expect(testContext.from).to.equal("constructor");
      chai.expect(testContext.testValue).to.equal("first-value");

      ReactDOM.render(<span>test</span>, testDiv);

      ReactDOM.render(<div>
        Test!
        <ContextParentDOM value={"second-value"}>
          <React3 contextPassThrough={ContextChild.contextTypes}>
            <webGLRenderer width={55} height={55}>
              <scene>
                <ContextChild />
              </scene>
            </webGLRenderer>
          </React3></ContextParentDOM></div>, testDiv, () => {
        chai.expect(testContext.from).to.equal("update");
        chai.expect(testContext.testValue).to.equal("second-value");

        ReactDOM.render(<div>
          Test!
          <ContextParentDOM value={"third-value"}>
            <React3 contextPassThrough={ContextChild.contextTypes}>
              <webGLRenderer width={55} height={55}>
                <scene>
                  <ContextChild />
                </scene>
              </webGLRenderer>
            </React3></ContextParentDOM></div>, testDiv, () => {
          chai.expect(testContext.from).to.equal("update");
          chai.expect(testContext.testValue).to.equal("third-value");

          ReactDOM.unmountComponentAtNode(testDiv);

          done();
        });
      });
    });
  });
});
