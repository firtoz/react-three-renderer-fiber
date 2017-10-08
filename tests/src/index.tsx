import "source-map-support/register";

import dirtyChai = require("dirty-chai");

chai.use(dirtyChai);

describe("React Three Renderer", () => {
  require("./core");
  require("./examples");
});
