import {INativeElement} from "../customRenderer/customRenderer";

const nativeTypes: { [key: string]: INativeElement<any, any, any, any, any, any>; } = {};

const context = (require as any).context("./descriptors/", true, /\.ts$/);

context
  .keys()
  .forEach((key: string) => {
    const name = key.match(/(\w+)\.ts$/);
    if (name !== null) {
      nativeTypes[name[1]] = context(key).default;
    }
  });

export default nativeTypes;
