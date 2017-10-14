import * as React from "react";
import * as ReactDOM from "react-dom";
import {Object3D} from "three";
import React3 from "../../../src/app/React3";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";
import {testElements} from "../index";

const testDiv = testElements.div;

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
    </DOMCallbackTester>, testDiv);

    ReactDOM.unmountComponentAtNode(testDiv);

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
                <webGLRenderer width={5} height={5} />
              </DOMCallbackTester>
            </DOMCallbackTester>
          </React3>
        </DOMCallbackTester>
      </DOMCallbackTester>
    </DOMCallbackTester>, testDiv);

    ReactDOM.unmountComponentAtNode(testDiv);

    const mixedCallbackOrder = callbackOrder.concat();

    callbackOrder.splice(0);

    chai.expect(r3rCallbackOrder).to.deep.equal(domCallbackOrder);
    chai.expect(mixedCallbackOrder).to.deep.equal(domCallbackOrder);

    done();
  });
});
