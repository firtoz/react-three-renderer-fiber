import applyInitialPropUpdates from "../applyInitialPropUpdates";
import fiberSymbol from "../r3rFiberSymbol";

import nativeTypes from '../nativeTypes';

function createInstanceInternal(type: string,
                                rootContainerInstance: HTMLCanvasElement,
                                props: any) {
  const creator = nativeTypes[type];

  if (!creator) {
    throw new Error('cannot create this type yet: ' + type);
  }

  return creator.createInstance(props, rootContainerInstance);
}

function precacheInstance(fiber: ReactFiber.Fiber, threeElement: any) {
  threeElement[fiberSymbol] = fiber;
}

export default function createInstance(type: string, props: any, rootContainerInstance: HTMLCanvasElement, hostContext: any, fiber: ReactFiber.Fiber) {
  const createdInstance = createInstanceInternal(type, rootContainerInstance, props);

  precacheInstance(fiber, createdInstance);
  applyInitialPropUpdates(type, createdInstance, props);

  return createdInstance;
};
