import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler';
import ReactDOMFrameScheduling from 'react-dom/lib/ReactDOMFrameScheduling';

import applyInitialPropUpdates from './applyInitialPropUpdates';
import diffProperties from './diffProperties';
import createInstanceInternal from './createInstanceInternal';
import commitUpdateInternal from './commitUpdateInternal';
import appendInitialChildInternal from './appendInitialChildInternal';

import r3rRootContainerSymbol from './r3rRootContainerSymbol';
import r3rInstanceSymbol from './r3rInstanceSymbol';

function precacheInstance(internalInstance, threeElement) {
  threeElement[r3rInstanceSymbol] = internalInstance;
}

const R3Renderer = ReactFiberReconciler({
  getRootHostContext(rootContainerInstance) {
    // try to copy from the parents somehow if they're from ReactDOM?

    return {};
  },
  getChildHostContext(parentHostContext, type) {
    return parentHostContext;
  },
  shouldSetTextContent(props) {
    // TODO
    return false;
  },
  shouldDeprioritizeSubtree(type, props) {
    // TODO vis check
    return false;
  },
  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    let createdInstance = {};

    createdInstance = createInstanceInternal(type, createdInstance, rootContainerInstance, props);

    precacheInstance(internalInstanceHandle, createdInstance);
    applyInitialPropUpdates(type, createdInstance, props);

    return createdInstance;
  },
  finalizeInitialChildren(r3rElement, type, props, rootContainerInstance) {
    // TODO ?

    return false;
  },
  prepareForCommit() {
    // TODO ?
  },
  resetAfterCommit() {
    // TODO ?
  },
  prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) {
    return diffProperties(
      oldProps,
      newProps,
    );
  },
  commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
    commitUpdateInternal(updatePayload, type, instance);
  },
  appendChild(parentInstance, child) {
    const parentInternalInstance = parentInstance[r3rInstanceSymbol];
    const childInternalInstance = child[r3rInstanceSymbol];

    const parentType = parentInternalInstance.type;
    const childType = childInternalInstance.type;

    if (parentInstance instanceof HTMLCanvasElement) {
      // party time!
      return;
    }

    switch (parentType) {
      default:
        throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
        break;
    }
  },
  appendInitialChild(parentInstance, child) {
    appendInitialChildInternal(parentInstance, child);
  },
  getPublicInstance(instance) {
    return instance;
  },
  scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,
});

function renderSubtreeIntoContainer(parentComponent, children, containerNode, callback) {
  let root = containerNode[r3rRootContainerSymbol];

  if (!root) {
    const newRoot = R3Renderer.createContainer(containerNode);

    containerNode[r3rRootContainerSymbol] = newRoot;
    containerNode[r3rInstanceSymbol] = newRoot;

    root = newRoot;

    // needed to do increase priority to ensure the updates happen ASAP so that getPublicRootInstance will see us
    R3Renderer.performWithPriority(1, () => {
      R3Renderer.updateContainer(children, newRoot, parentComponent, callback);
    });
  } else {
    R3Renderer.updateContainer(children, root, parentComponent, callback);
  }

  return R3Renderer.getPublicRootInstance(root);
}

class R3R {
  static render(element, container, callback) {
    return renderSubtreeIntoContainer(null, element, container, callback);
  }

  // TODO unmount :D

  static rendererInternal = R3Renderer;
}

export default R3R;
