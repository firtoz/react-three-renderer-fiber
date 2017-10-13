import "source-map-support/register";

import MockConsole from "console-expect";
import dirtyChai = require("dirty-chai");

chai.use(dirtyChai);

export const mockConsole = new MockConsole();

describe("React Three Renderer", () => {

  beforeEach(() => {
    mockConsole.wrapConsole();
  });

  afterEach("ensure no unwanted console messages have been logged", () => {
    mockConsole.revert();
  });

  require("./core");
  require("./examples");
});
