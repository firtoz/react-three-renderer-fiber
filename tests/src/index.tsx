import "source-map-support/register";

import MockConsole from "console-expect";
import dirtyChai = require("dirty-chai");

chai.use(dirtyChai);

describe("React Three Renderer", () => {
  const mockConsole = new MockConsole();

  beforeEach(() => {
    mockConsole.wrapConsole();
  });

  afterEach("ensure no unwanted console messages have been logged", () => {
    mockConsole.revert();
  });

  require("./core");
  require("./examples");
});
