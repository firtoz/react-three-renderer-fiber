import "source-map-support/register";

import {expect} from "chai";
import MockConsole from "console-expect";
import dirtyChai = require("dirty-chai");
import r3rFiberSymbol from "../../src/core/renderer/utils/r3rFiberSymbol";
import r3rRootContainerSymbol from "../../src/core/renderer/utils/r3rRootContainerSymbol";

chai.use(dirtyChai);

export const mockConsole = new MockConsole();

export const testElements = {
  canvas: document.createElement("canvas"),
  div: document.createElement("div"),
};

document.body.appendChild(testElements.div);
document.body.appendChild(testElements.canvas);

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

  afterEach("ensure testDiv is clean", function(this: Mocha.IBeforeAndAfterContext) {
    if (this.currentTest !== undefined && this.currentTest.state !== "passed") {
      return;
    }

    const testDiv = testElements.div;

    expect((testDiv as any)._reactRootContainer === null
      || (testDiv as any)._reactRootContainer === undefined,
      "DOM Components should have been unmounted from testDiv").to.equal(true);
    expect((testDiv as any)[r3rRootContainerSymbol],
      "testDiv should not be a r3rRootContainer").to.equal(undefined);
    expect((testDiv as any)[r3rFiberSymbol],
      "testDiv should not be a r3rFiber").to.equal(undefined);
  });

  afterEach("ensure testCanvas is clean", function(this: Mocha.IBeforeAndAfterContext) {
    if (this.currentTest !== undefined && this.currentTest.state !== "passed") {
      return;
    }

    const testCanvas = testElements.canvas;

    expect((testCanvas as any)._reactRootContainer === null
      || (testCanvas as any)._reactRootContainer === undefined,
      "DOM Components should have been unmounted from testCanvas").to.equal(true);
    expect((testCanvas as any)[r3rRootContainerSymbol],
      "testCanvas should not be a r3rRootContainer").to.equal(undefined);
    expect((testCanvas as any)[r3rFiberSymbol],
      "testCanvas should not be a r3rFiber").to.equal(undefined);

    document.body.removeChild(testCanvas);

    testElements.canvas = document.createElement("canvas");
    document.body.appendChild(testElements.canvas);
  });

  require("./core");
  require("./examples");
});
