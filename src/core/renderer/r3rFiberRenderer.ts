import ReactFiberReconciler = require("react-fiber-export/lib/renderers/shared/fiber/ReactFiberReconciler");
import ReactDOMFrameScheduling = require("react-fiber-export/lib/renderers/shared/ReactDOMFrameScheduling");
import resetAfterCommit from "./fiberRenderer/resetAfterCommit";
import getRootHostContext from "./fiberRenderer/getRootHostContext";
import appendInitialChild from "./fiberRenderer/appendInitialChild";
import commitMount from "./fiberRenderer/commitMount";
import commitUpdate from "./fiberRenderer/commitUpdate";
import insertBefore from "./fiberRenderer/insertBefore";
import prepareForCommit from "./fiberRenderer/prepareForCommit";
import removeChildFromContainer from "./fiberRenderer/removeChildFromContainer";
import createInstance from "./fiberRenderer/createInstance";
import finalizeInitialChildren from "./fiberRenderer/finalizeInitialChildren";
import createTextInstance from "./fiberRenderer/createTextInstance";
import getChildHostContext from "./fiberRenderer/getChildHostContext";
import resetTextContent from "./fiberRenderer/resetTextContent";
import prepareUpdate from "./fiberRenderer/prepareUpdate";
import shouldDeprioritizeSubtree from "./fiberRenderer/shouldDeprioritizeSubtree";
import insertInContainerBefore from "./fiberRenderer/insertInContainerBefore";
import appendChild from "./fiberRenderer/appendChild";
import commitTextUpdate from "./fiberRenderer/commitTextUpdate";
import shouldSetTextContent from "./fiberRenderer/shouldSetTextContent";
import removeChild from "./fiberRenderer/removeChild";
import getPublicInstance from "./fiberRenderer/getPublicInstance";
import appendChildToContainer from "./fiberRenderer/appendChildToContainer";

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
