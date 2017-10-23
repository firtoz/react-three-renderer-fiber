import {IFiber} from "react-fiber-export";
import {INativeElement} from "../../customRenderer/customRenderer";
import hostDescriptors from "../../hostDescriptors";
import {default as r3rFiberSymbol} from "./r3rFiberSymbol";

export default function getDescriptorForInstance(instance: any): INativeElement<any, any, any, any, any, any> {
  const type = (instance[r3rFiberSymbol] as IFiber).type;

  const descriptor = hostDescriptors[type];

  if (descriptor === undefined) {
    throw new Error(`Cannot find descriptor for type "${type}"`);
  }

  return descriptor;
}
