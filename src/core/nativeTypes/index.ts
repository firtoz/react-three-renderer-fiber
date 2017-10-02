import {INativeElement} from "../customRenderer/customRenderer";

const nativeTypes: { [key: string]: INativeElement<any, any, any, any, any, any>; } = {};

const context = require.context("./types/", true, /\.ts$/);

context
  .keys()
  .forEach((key) => {
    const name = key.match(/(\w+)\.ts$/);
    if (name) {
      nativeTypes[name[1]] = context(key).default;
    }
  });

export default nativeTypes;
