const rimraf = require("rimraf");
const path = require("path");
const fs = require("fs");

const libDirectory = path.resolve(__dirname + "/../lib");

if (fs.existsSync(libDirectory)) {
  rimraf(libDirectory, (error) => {
    if (error != null) {
      console.error(error);
    }
  });
}
