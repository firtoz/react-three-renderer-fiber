import {INativeElement} from "../customRenderer/customRenderer";

const hostDescriptors: { [key: string]: INativeElement<any, any, any, any, any, any>; } = {};

declare function require(filename: string): any;

const context = (require as any).context("./descriptors/", true, /\.ts$/);

context
  .keys()
  .forEach((key: string) => {
    const name = key.match(/(\w+)\.ts$/);
    if (name !== null) {
      hostDescriptors[name[1]] = new (context(key).default)();
    }
  });

export default hostDescriptors;
