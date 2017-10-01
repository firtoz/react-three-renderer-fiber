import ReactFiberReconciler = require("react-fiber-export/lib/renderers/shared/fiber/ReactFiberReconciler");
import ReactDOMFrameScheduling = require("react-fiber-export/lib/renderers/shared/ReactDOMFrameScheduling");
import resetAfterCommit from "./resetAfterCommit";
import getRootHostContext from "./getRootHostContext";
import appendInitialChild from "./appendInitialChild";
import commitMount from "./commitMount";
import commitUpdate from "./commitUpdate";
import insertBefore from "./insertBefore";
import prepareForCommit from "./prepareForCommit";
import removeChildFromContainer from "./removeChildFromContainer";
import createInstance from "./createInstance";
import finalizeInitialChildren from "./finalizeInitialChildren";
import createTextInstance from "./createTextInstance";
import getChildHostContext from "./getChildHostContext";
import resetTextContent from "./resetTextContent";
import prepareUpdate from "./prepareUpdate";
import shouldDeprioritizeSubtree from "./shouldDeprioritizeSubtree";
import insertInContainerBefore from "./insertInContainerBefore";
import appendChild from "./appendChild";
import commitTextUpdate from "./commitTextUpdate";
import shouldSetTextContent from "./shouldSetTextContent";
import removeChild from "./removeChild";
import getPublicInstance from "./getPublicInstance";
import appendChildToContainer from "./appendChildToContainer";

const ReactThreeFiberRenderer = ReactFiberReconciler({
  appendChild,
  appendChildToContainer,
  appendInitialChild,
  commitTextUpdate,
  commitMount,
  commitUpdate,
  createInstance,
  createTextInstance,
  finalizeInitialChildren,
  getPublicInstance,
  insertBefore,
  insertInContainerBefore,
  prepareForCommit,
  prepareUpdate,
  removeChild,
  removeChildFromContainer,
  resetAfterCommit,
  resetTextContent,
  shouldDeprioritizeSubtree,
  getRootHostContext,
  getChildHostContext,
  scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,
  shouldSetTextContent,
  useSyncScheduling: true,
});

export default ReactThreeFiberRenderer;
