import {ReactDOMFrameScheduling, ReactFiberReconciler} from "react-fiber-export";

import appendChild from "./appendChild";
import appendChildToContainer from "./appendChildToContainer";
import appendInitialChild from "./appendInitialChild";
import commitMount from "./commitMount";
import commitTextUpdate from "./commitTextUpdate";
import commitUpdate from "./commitUpdate";
import createInstance from "./createInstance";
import createTextInstance from "./createTextInstance";
import finalizeInitialChildren from "./finalizeInitialChildren";
import getChildHostContext from "./getChildHostContext";
import getPublicInstance from "./getPublicInstance";
import getRootHostContext from "./getRootHostContext";
import insertBefore from "./insertBefore";
import insertInContainerBefore from "./insertInContainerBefore";
import prepareForCommit from "./prepareForCommit";
import prepareUpdate from "./prepareUpdate";
import removeChild from "./removeChild";
import removeChildFromContainer from "./removeChildFromContainer";
import resetAfterCommit from "./resetAfterCommit";
import resetTextContent from "./resetTextContent";
import shouldDeprioritizeSubtree from "./shouldDeprioritizeSubtree";
import shouldSetTextContent from "./shouldSetTextContent";

const ReactThreeFiberRenderer = ReactFiberReconciler({
  appendChild,
  appendChildToContainer,
  appendInitialChild,
  commitMount,
  commitTextUpdate,
  commitUpdate,
  createInstance,
  createTextInstance,
  finalizeInitialChildren,
  getChildHostContext,
  getPublicInstance,
  getRootHostContext,
  insertBefore,
  insertInContainerBefore,
  prepareForCommit,
  prepareUpdate,
  removeChild,
  removeChildFromContainer,
  resetAfterCommit,
  resetTextContent,
  scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,
  shouldDeprioritizeSubtree,
  shouldSetTextContent,
  useSyncScheduling: true,
});

export default ReactThreeFiberRenderer;
