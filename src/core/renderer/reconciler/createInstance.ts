import {IFiber, ReactDebugCurrentFiber} from "react-fiber-export";

import * as PropTypes from "prop-types";
import {RenderAction} from "../../hostDescriptors/descriptors/render";
import hostDescriptors from "../../hostDescriptors/index";
import isNonProduction from "../utils/isNonProduction";
import r3rContextSymbol from "../utils/r3rContextSymbol";
import fiberSymbol from "../utils/r3rFiberSymbol";

function precacheInstance(fiber: IFiber, threeElement: any) {
  threeElement[fiberSymbol] = fiber;
}

export interface IHostContext {
  triggerRender(): void;

  renderActionFound?(action: RenderAction): void;
}

const checkPropTypes: (typeSpecs: any,
                       values: any,
                       location: string,
                       componentName: string,
                       getStack?: any) => void = (PropTypes as any).checkPropTypes;

export default function createInstance(type: string,
                                       props: any,
                                       rootContainerInstance: HTMLCanvasElement,
                                       hostContext: IHostContext,
                                       fiber: IFiber) {
  const descriptor = hostDescriptors[type];

  if (isNonProduction) {
    checkPropTypes(descriptor.propTypes,
      props,
      "prop",
      type,
      ReactDebugCurrentFiber.getCurrentFiberStackAddendum);
  }

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
