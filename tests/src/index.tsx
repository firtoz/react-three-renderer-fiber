import "source-map-support/register";

import {expect} from "chai";
import MockConsole from "console-expect";
import dirtyChai = require("dirty-chai");
import {Object3D} from "three";
import r3rFiberSymbol from "../../src/core/renderer/utils/r3rFiberSymbol";
import r3rRootContainerSymbol from "../../src/core/renderer/utils/r3rRootContainerSymbol";

chai.use(dirtyChai);

export const mockConsole = new MockConsole();

export const testContainers = {
  canvas: document.createElement("canvas"),
  div: document.createElement("div"),
  object3D: new Object3D(),
};

document.body.appendChild(testContainers.div);
document.body.appendChild(testContainers.canvas);

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
      if (this.currentTest.state !== "passed") {
        return;
      }

      const container = (testContainers as any)[keyName] as any;

      expect(container._reactRootContainer === null
        || container._reactRootContainer === undefined,
        "DOM Components should have been unmounted from container").to.equal(true);
      expect(container[r3rRootContainerSymbol],
        "container should not be a r3rRootContainer").to.equal(undefined);
      expect(container[r3rFiberSymbol],
        "testDiv should not be a r3rFiber").to.equal(undefined);
    });
  });

  require("./core");
  require("./examples");
});
