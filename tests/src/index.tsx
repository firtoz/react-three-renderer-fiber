import "source-map-support/register";

import {expect} from "chai";
import MockConsole from "console-expect";
import dirtyChai = require("dirty-chai");
import * as ReactDOM from "react-dom";
import {Object3D} from "three";
import {ReactThreeRenderer} from "../../src";
import {CustomReconcilerConfig} from "../../src/core/customRenderer/createReconciler";

chai.use(dirtyChai);

export const mockConsole = new MockConsole();

export const testContainers: {
  canvas: HTMLCanvasElement,
  div: HTMLDivElement,
  object3D: Object3D,
} = {
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

  Object.keys(testContainers)
    .forEach((keyName: "canvas" | "div" | "object3D") => {
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
          if (keyName !== "object3D") {
            try {
              ReactDOM.unmountComponentAtNode(testContainers[keyName]);
            } catch (e) {
              // ignore
            }
          }
          return;
        }

        const container = testContainers[keyName] as any;

        expect(container._reactRootContainer === null
          || container._reactRootContainer === undefined,
          "DOM Components should have been unmounted from container").to.equal(true);
        expect(container[CustomReconcilerConfig.rootContainerSymbol],
          "container should not be a r3rRootContainer").to.equal(undefined);
        expect(container[CustomReconcilerConfig.fiberSymbol],
          "testDiv should not be a r3rFiber").to.equal(undefined);
      });
    });

  require("./core");
  require("./descriptors");
  require("./examples");
  require("./extensions");

  before("place test elements", () => {
    document.body.appendChild(testContainers.div);
    document.body.appendChild(testContainers.canvas);
  });

  after("clean test elements", () => {
    document.body.removeChild(testContainers.div);
    document.body.removeChild(testContainers.canvas);
  });
});
