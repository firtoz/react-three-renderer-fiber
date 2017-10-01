import fiberSymbol from "../utils/r3rFiberSymbol";

import nativeTypes from '../../nativeTypes/index';

function precacheInstance(fiber: ReactFiber.Fiber, threeElement: any) {
  threeElement[fiberSymbol] = fiber;
}

export default function createInstance(type: string, props: any, rootContainerInstance: HTMLCanvasElement, hostContext: any, fiber: ReactFiber.Fiber) {
  const creator = nativeTypes[type];

  if (!creator) {
    throw new Error('cannot create this type yet: ' + type);
  }

  const createdInstance = creator.createInstance(props, rootContainerInstance);

  precacheInstance(fiber, createdInstance);

  creator.applyInitialPropUpdates(createdInstance, props);

  return createdInstance;
};
