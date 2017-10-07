import {IFiber} from "react-fiber-export";

import nativeTypes from "../../nativeTypes/index";
import fiberSymbol from "../utils/r3rFiberSymbol";

function precacheInstance(fiber: IFiber, threeElement: any) {
  threeElement[fiberSymbol] = fiber;
}

export default function createInstance(type: string,
                                       props: any,
                                       rootContainerInstance: HTMLCanvasElement,
                                       hostContext: any,
                                       fiber: IFiber) {
  const descriptor = nativeTypes[type];

  if (descriptor === undefined) {
    throw new Error("cannot create this type yet: " + type);
  }

  const createdInstance = descriptor.createInstance(props, rootContainerInstance);

  precacheInstance(fiber, createdInstance);

  descriptor.applyInitialPropUpdates(createdInstance, props);

  return createdInstance;
}
