import * as React from "react";
import * as ReactDOM from "react-dom";
import {Object3D} from "three";
import React3 from "../../../src/app/React3";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";
import {testContainers} from "../index";

const testDiv = testContainers.div;

describe("callback order", () => {
  it("should execute callbacks in the right order", () => {
    const callbackOrder: string[] = [];

    class CallbackTesterComponent extends React.Component<{ name: string }> {
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

    let index = 0;

    ReactDOM.render(<CallbackTesterComponent name={`component-${index++}`}>
      <CallbackTesterComponent name={`component-${index++}`}>
        <CallbackTesterComponent name={`component-${index++}`}>
          <CallbackTesterComponent name={`component-${index++}`}>
            <CallbackTesterComponent name={`component-${index}`}>
              <div />
            </CallbackTesterComponent>
          </CallbackTesterComponent>
        </CallbackTesterComponent>
      </CallbackTesterComponent>
    </CallbackTesterComponent>, testDiv);

    ReactDOM.unmountComponentAtNode(testDiv);

    // have a baseline for expectations
    const domCallbackOrder = callbackOrder.concat();

    callbackOrder.splice(0);

    const obj3d = new Object3D();

    index = 0;

    ReactThreeRenderer.render(<CallbackTesterComponent name={`component-${index++}`}>
      <CallbackTesterComponent name={`component-${index++}`}>
        <CallbackTesterComponent name={`component-${index++}`}>
          <CallbackTesterComponent name={`component-${index++}`}>
            <CallbackTesterComponent name={`component-${index}`}>
              <object3D />
            </CallbackTesterComponent>
          </CallbackTesterComponent>
        </CallbackTesterComponent>
      </CallbackTesterComponent>
    </CallbackTesterComponent>, obj3d);

    ReactThreeRenderer.unmountComponentAtNode(obj3d);

    const r3rCallbackOrder = callbackOrder.concat();

    chai.expect(r3rCallbackOrder).to.deep.equal(domCallbackOrder);

    callbackOrder.splice(0);

    index = 0;

    ReactDOM.render(<CallbackTesterComponent name={`component-${index++}`}>
      <CallbackTesterComponent name={`component-${index++}`}>
        <CallbackTesterComponent name={`component-${index++}`}>
          <React3>
            <CallbackTesterComponent name={`component-${index++}`}>
              <CallbackTesterComponent name={`component-${index}`}>
                <webGLRenderer width={5} height={5} />
              </CallbackTesterComponent>
            </CallbackTesterComponent>
          </React3>
        </CallbackTesterComponent>
      </CallbackTesterComponent>
    </CallbackTesterComponent>, testDiv);

    ReactDOM.unmountComponentAtNode(testDiv);

    const mixedCallbackOrder = callbackOrder.concat();

    chai.expect(mixedCallbackOrder).to.deep.equal(domCallbackOrder);
  });
});
