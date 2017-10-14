import {IFiber} from "react-fiber-export";

import nativeTypes from "../../nativeTypes/index";
import {RenderAction} from "../../nativeTypes/types/render";
import r3rContextSymbol from "../utils/r3rContextSymbol";
import fiberSymbol from "../utils/r3rFiberSymbol";

function precacheInstance(fiber: IFiber, threeElement: any) {
  threeElement[fiberSymbol] = fiber;
}

export interface IHostContext {
  triggerRender(): void;

  renderActionFound?(action: RenderAction): void;
}

export default function createInstance(type: string,
                                       props: any,
                                       rootContainerInstance: HTMLCanvasElement,
                                       hostContext: IHostContext,
                                       fiber: IFiber) {
  const descriptor = nativeTypes[type];

  if (descriptor === undefined) {
    throw new Error("cannot create this type yet: " + type);
  }

  const createdInstance = descriptor.createInstance(props, rootContainerInstance);

  if (hostContext !== null) {
    createdInstance[r3rContextSymbol] = hostContext;
  }

  precacheInstance(fiber, createdInstance);

  descriptor.applyInitialPropUpdates(createdInstance, props);

  return createdInstance;
}
