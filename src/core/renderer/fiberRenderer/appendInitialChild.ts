import {ReactFiber} from "../../dts";
import nativeTypes from "../../nativeTypes/index";
import r3rFiberSymbol from "../utils/r3rFiberSymbol";

export default function appendInitialChildInternal(parentInstance: any, childInstance: any) {
  const parentFiber = parentInstance[r3rFiberSymbol] as ReactFiber.IFiber;

  const parentType = parentFiber.type;

  const creator = nativeTypes[parentType];

  if (!creator) {
    throw new Error("cannot create this type yet: " + parentType);
  }

  creator.appendInitialChild(parentInstance, childInstance);
}
