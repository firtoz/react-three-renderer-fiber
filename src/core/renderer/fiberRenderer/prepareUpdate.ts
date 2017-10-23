import * as PropTypes from "prop-types";
import {ReactDebugCurrentFiber} from "react-fiber-export";
import hostDescriptors from "../../hostDescriptors";
import isNonProduction from "../utils/isNonProduction";

export interface IPropMap {
  [key: string]: any;
}

export type TUpdatePayload = any[];

const checkPropTypes: (typeSpecs: any,
                       values: any,
                       location: string,
                       componentName: string,
                       getStack?: any) => void = (PropTypes as any).checkPropTypes;

function diffProperties(type: string, lastProps: IPropMap, nextProps: IPropMap): TUpdatePayload | null {
  if (isNonProduction) {
    checkPropTypes(hostDescriptors[type].propTypes,
      nextProps,
      "prop",
      type,
      ReactDebugCurrentFiber.getCurrentFiberStackAddendum);
  }

  let updatePayload: TUpdatePayload | null = null;

  const lastPropsKeys = Object.keys(lastProps);

  for (const propKey of lastPropsKeys) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue;
    }

    if (updatePayload === null) {
      updatePayload = [];
    }

    // all removed props will be null
    updatePayload.push(propKey, null);
  }

  const nextPropsKeys = Object.keys(nextProps);

  const hasLastProps = (lastProps != null);

  for (const propKey of nextPropsKeys) {
    const nextProp = nextProps[propKey];
    const lastProp = hasLastProps ? lastProps[propKey] : undefined;
    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (!nextProp) && (!lastProp)) {
      continue;
    }

    if (propKey === "children") {
      if (lastProp !== nextProp && (typeof nextProp === "string" || typeof nextProp === "number")) {
        // update text

        if (updatePayload === null) {
          updatePayload = [];
        }

        updatePayload.push(propKey, "" + nextProp);
      }
    } else {
      // update value

      if (updatePayload === null) {
        updatePayload = [];
      }

      updatePayload.push(propKey, nextProp);
    }
  }

  return updatePayload;
}

export default function prepareUpdate(instance: any,
                                      type: any,
                                      oldProps: any,
                                      newProps: any,
                                      /* rootContainerInstance: any, */
                                      /* hostContext: any, */) {
  return diffProperties(
    type,
    oldProps,
    newProps,
  );
}
