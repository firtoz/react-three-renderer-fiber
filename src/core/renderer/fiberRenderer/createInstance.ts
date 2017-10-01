import fiberSymbol from "../utils/r3rFiberSymbol";

import {ReactFiber} from "../../dts";
import nativeTypes from "../../nativeTypes/index";

function precacheInstance(fiber: ReactFiber.IFiber, threeElement: any) {
  threeElement[fiberSymbol] = fiber;
}

export default function createInstance(type: string,
                                       props: any,
                                       rootContainerInstance: HTMLCanvasElement,
                                       hostContext: any,
                                       fiber: ReactFiber.IFiber) {
  const descriptor = nativeTypes[type];

  if (!descriptor) {
    throw new Error("cannot create this type yet: " + type);
  }

  const createdInstance = descriptor.createInstance(props, rootContainerInstance);

  precacheInstance(fiber, createdInstance);

  descriptor.applyInitialPropUpdates(createdInstance, props);

  return createdInstance;
}
