import "source-map-support/register";

import {expect} from "chai";
import MockConsole from "console-expect";
import dirtyChai = require("dirty-chai");
import * as ReactDOM from "react-dom";
import {Object3D} from "three";
import {ReactThreeRenderer} from "../../src";
import r3rReconcilerConfig from "../../src/core/renderer/reconciler/r3rReconcilerConfig";

chai.use(dirtyChai);

export const mockConsole = new MockConsole();

export const testContainers: { [index: string]: any } = {
  canvas: document.createElement("canvas"),
  div: document.createElement("div"),
  object3D: new Object3D(),
};

describe("React Three Renderer", () => {
  beforeEach(() => {
    mockConsole.wrapConsole();
    // mockConsole.revert();
  });

  afterEach("ensure no unwanted console messages have been logged", function(this: Mocha.IBeforeAndAfterContext) {
    if (this.currentTest !== undefined && this.currentTest.state !== "passed") {
      mockConsole.revert(true);

      return;
    }

    mockConsole.revert();
  });

  Object.keys(testContainers).forEach((keyName: string) => {
    afterEach(`ensure ${keyName} is clean`, function(this: Mocha.IBeforeAndAfterContext) {
      if (!this.currentTest) {
        console.error("no test?!", this);
      }

      if (!this.currentTest || this.currentTest.state !== "passed") {
        try {
          ReactThreeRenderer.unmountComponentAtNode(testContainers[keyName]);
        } catch (e) {
          // ignore
        }
        try {
          ReactDOM.unmountComponentAtNode(testContainers[keyName]);
        } catch (e) {
          // ignore
        }
        return;
      }

      const container = testContainers[keyName] as any;

      expect(container._reactRootContainer === null
        || container._reactRootContainer === undefined,
        "DOM Components should have been unmounted from container").to.equal(true);
      expect(container[r3rReconcilerConfig.getRootContainerSymbol()],
        "container should not be a r3rRootContainer").to.equal(undefined);
      expect(container[r3rReconcilerConfig.getFiberSymbol()],
        "testDiv should not be a r3rFiber").to.equal(undefined);
    });
  });

  require("./core");
  require("./examples");

  before("place test elements", () => {
    document.body.appendChild(testContainers.div);
    document.body.appendChild(testContainers.canvas);
  });

  after("clean test elements", () => {
    document.body.removeChild(testContainers.div);
    document.body.removeChild(testContainers.canvas);
  });
});
