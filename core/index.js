import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler';
import ReactDOMFrameScheduling from 'react-dom/lib/ReactDOMFrameScheduling';
// import { getInstanceFromNode } from 'react-dom/lib/ReactDOMComponentTree';

const r3rRootContainerSymbol = '__r3r-root-symbol'; //Symbol('r3r-root');
const r3rInstanceSymbol = '__r3r-instance-symbol'; // Symbol('r3r-root');

function updateProps(instance, props) {

}

function precacheInstance(internalInstance, threeElement) {
  threeElement[r3rInstanceSymbol] = internalInstance;
}

const R3Renderer = ReactFiberReconciler({
  getRootHostContext(rootContainerInstance) {
    // console.log('getting rootContainerInstance', rootContainerInstance);

    return {};
  },
  getChildHostContext(parentHostContext, type) {
    // console.log('parentHostContext', parentHostContext, 'type', type);

    return parentHostContext;
  },
  shouldSetTextContent(props) {
    return false;
  },
  shouldDeprioritizeSubtree(type, props) {
    return false;
  },
  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    // console.log('createInstance', type, props, rootContainerInstance, hostContext, internalInstanceHandle);
    let createdInstance;

    if (type === 'canvas') {
      createdInstance = document.createElement('canvas');
    } else {
      createdInstance = {
        type,
      };
    }

    precacheInstance(internalInstanceHandle, createdInstance);
    updateProps(createdInstance, props);

    return createdInstance;
  },
  finalizeInitialChildren(r3rElement, type, props, rootContainerInstance) {
    // debugger;

    // console.log('finalizeInitialChildren', r3rElement, type, props, rootContainerInstance);
    return false;
  },
  prepareForCommit() {

  },
  resetAfterCommit() {

  },
  prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) {
    // console.log("prepareUpdate", instance, type, oldProps, newProps, rootContainerInstance, hostContext);

    return {
      oldProps,
      newProps,
    };
  },
  commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
    // console.log('commitUpdate', instance, updatePayload, type, oldProps, newProps, internalInstanceHandle);
    // instance.commitUpdate(updatePayload, oldProps, newProps);
  },
  appendChild(parentInstance, child) {
    // debugger;

    // console.log('appendChild', parentInstance, child);
    // if (parentInstance.appendChild && child.type !== 'scene') {
    //   parentInstance.appendChild(child);
    // }
  },
  appendInitialChild(parentInstance, child) {
    // debugger;

    // console.log('appendInitialChild', parentInstance, child);

  },
  getPublicInstance(instance) {
    return instance;
  },
  scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,
});

function renderSubtreeIntoContainer(parentComponent, children, containerNode, callback) {

  // debugger;

  // const internalInstance = getInstanceFromNode(containerNode);

  let root = containerNode[r3rRootContainerSymbol];

  if (!root) {
    // first clear any existing content

    while (containerNode.lastChild) {
      containerNode.removeChild(containerNode.lastChild);
    }

    const newRoot = R3Renderer.createContainer(containerNode);

    containerNode[r3rRootContainerSymbol] = newRoot;
    containerNode[r3rInstanceSymbol] = newRoot;

    root = newRoot;

    // newRoot.tag = 3;
    // newRoot.type = "wut";
    // newRoot.memoizedProps = {
    //   // children
    // };
    //
    // internalInstance.child = newRoot;
    // newRoot['return'] = internalInstance;

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
    // console.log('render!');
    return renderSubtreeIntoContainer(null, element, container, callback);
  }

  static rendererInternal = R3Renderer;
}

export default R3R;
