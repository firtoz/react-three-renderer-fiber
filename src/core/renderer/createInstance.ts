import applyInitialPropUpdates from "../applyInitialPropUpdates";
import createInstanceInternal from "../createInstanceInternal";

import precacheInstance from "./utils/precacheInstance";

export default function createInstance(type: string, props: any, rootContainerInstance: HTMLCanvasElement, hostContext: any, fiber: ReactFiber.Fiber) {
  let createdInstance = {};

  createdInstance = createInstanceInternal(type, createdInstance, rootContainerInstance, props);

  precacheInstance(fiber, createdInstance);
  applyInitialPropUpdates(type, createdInstance, props);

  return createdInstance;
};
