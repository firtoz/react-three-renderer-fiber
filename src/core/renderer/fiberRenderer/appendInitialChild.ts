import r3rFiberSymbol from '../utils/r3rFiberSymbol';
import nativeTypes from "../../nativeTypes/index";

export default function appendInitialChildInternal(parentInstance: any, childInstance: any) {
  const parentFiber = parentInstance[r3rFiberSymbol] as ReactFiber.Fiber;

  const parentType = parentFiber.type;

  const creator = nativeTypes[parentType];

  if (!creator) {
    throw new Error('cannot create this type yet: ' + parentType);
  }

  creator.appendInitialChild(parentInstance, childInstance);
}
