import {IFiber} from "react-fiber-export";
import nativeTypes from "../../nativeTypes/index";
import {default as r3rFiberSymbol} from "../utils/r3rFiberSymbol";

export default function appendChild(parentInstance: any, childInstance: any): void {
  const parentFiber = parentInstance[r3rFiberSymbol] as IFiber;

  const parentType = parentFiber.type;

  const descriptor = nativeTypes[parentType];

  if (!descriptor) {
    throw new Error("cannot append children to this type yet: " + parentType);
  }

  descriptor.appendChild(parentInstance, childInstance);
}
