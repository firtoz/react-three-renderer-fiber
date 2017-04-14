import * as THREE from 'three';

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

function diffProperties(lastProps, nextProps) {
  // if (process.env.NODE_ENV !== 'production') {
  //   validatePropertiesInDevelopment(tag, nextRawProps);
  // }

  let updatePayload = null;

  // let lastProps;
  // let nextProps;

  // assertValidProps(tag, nextProps);

  let propKey;
  const lastPropsKeys = Object.keys(lastProps);

  for (let i = 0; i < lastPropsKeys.length; ++i) {
    const propKey = lastPropsKeys[i];

    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue;
    }
    // For all other deleted properties we add it to the queue. We use
    // the whitelist in the commit phase instead.
    (updatePayload = updatePayload || []).push(propKey, null);
  }

  const nextPropsKeys = Object.keys(nextProps);

  const hasLastProps = !!lastProps;

  for (let i = 0; i < nextPropsKeys.length; ++i) {
    const propKey = nextPropsKeys[i];

    const nextProp = nextProps[propKey];
    const lastProp = hasLastProps ? lastProps[propKey] : undefined;
    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (!nextProp) && (!lastProp)) {
      continue;
    }

    if (propKey === 'children') {
      if (lastProp !== nextProp && (typeof nextProp === 'string' || typeof nextProp === 'number')) {
        (updatePayload = updatePayload || []).push(propKey, '' + nextProp);
      }
    } else {
      // For any other property we always add it to the queue and then we
      // filter it out using the whitelist during the commit.
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }

  return updatePayload;
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
    let createdInstance = {};

    switch (type) {
      default:
        throw new Error('cannot create this type yet: ' + type);
      case 'webglRenderer':
        createdInstance = new THREE.WebGLRenderer({
          canvas: rootContainerInstance,
        });

        break;
      case 'scene':
        createdInstance = new THREE.Scene();

        break;
      case 'mesh':
        const {
          rotation,
        } = props;

        createdInstance = new THREE.Mesh();

        createdInstance.rotation.copy(rotation);

        break;
      case 'meshBasicMaterial':
        const {
          color,
        } = props;

        createdInstance = new THREE.MeshBasicMaterial({
          color,
        });

        break;
      case 'boxGeometry':
        const {
          width,
          height,
          depth,
        } = props;

        createdInstance = new THREE.BoxGeometry(width, height, depth);

        break;
      case 'perspectiveCamera':
        const {
          fov,
          aspect,
          near,
          far,
          name,
          position,
        } = props;

        createdInstance = new THREE.PerspectiveCamera(
          fov,
          aspect,
          near,
          far
        );

        createdInstance.position.copy(position);
        createdInstance.name = name;

        break;
    }

    // createdInstance = {
    //   type,
    // };
    //
    precacheInstance(internalInstanceHandle, createdInstance);
    updateProps(createdInstance, props);

    //
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

    return diffProperties(
      oldProps,
      newProps,
    );
  },
  commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
    // console.log('commitUpdate', instance, updatePayload, type, oldProps, newProps, internalInstanceHandle);
    // instance.commitUpdate(updatePayload, oldProps, newProps);

    for (let i = 0; i < updatePayload.length; i += 2) {
      const propName = updatePayload[i];
      const newValue = updatePayload[i + 1];

      switch (type) {
        case 'mesh':
          switch (propName) {
            case 'rotation':
              instance.rotation.copy(newValue);
              break;
            default:
              throw new Error('Cannot update prop ' + propName + ' for ' + type);
          }

          break;
        default:
          throw new Error('Cannot update prop ' + propName + ' for ' + type);
      }
    }
  },
  appendChild(parentInstance, child) {

    const parentInternalInstance = parentInstance[r3rInstanceSymbol];
    const childInternalInstance = child[r3rInstanceSymbol];

    const parentType = parentInternalInstance.type;
    const childType = childInternalInstance.type;

    if (parentInstance instanceof HTMLCanvasElement) {
      console.log('mounting ', child, 'into canvas!');

      // child.render

      return;
    }

    switch (parentType) {
      // case 'mesh':
      //   if (child instanceof THREE.Geometry) {
      //     parentInstance.geometry = child;
      //   } else if (child instanceof THREE.Material) {
      //     parentInstance.material = child;
      //   } else {
      //     throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
      //   }
      //   break;
      // case 'scene':
      //   if (child instanceof THREE.Object3D) {
      //     parentInstance.add(child);
      //   } else {
      //     throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
      //   }
      //   break;
      // case 'webglRenderer':
      //   if (!parentInstance.userData) {
      //     parentInstance.userData = {};
      //   }
      //
      //   if (child instanceof THREE.Scene) {
      //     parentInstance.userData._scene = child;
      //   } else {
      //     throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
      //   }
      //
      //   break;
      default:
        throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
        break;
    }

    // debugger;

    console.log('appendChild', parentInstance, child);
    // if (parentInstance.appendChild && child.type !== 'scene') {
    //   parentInstance.appendChild(child);
    // }
  },
  appendInitialChild(parentInstance, child) {
    const parentInternalInstance = parentInstance[r3rInstanceSymbol];
    const childInternalInstance = child[r3rInstanceSymbol];

    const parentType = parentInternalInstance.type;
    const childType = childInternalInstance.type;

    switch (parentType) {
      case 'mesh':
        if (child instanceof THREE.Geometry) {
          parentInstance.geometry = child;
        } else if (child instanceof THREE.Material) {
          parentInstance.material = child;
        } else {
          throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
        }
        break;
      case 'scene':
        if (child instanceof THREE.Object3D) {
          parentInstance.add(child);
        } else {
          throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
        }
        break;
      case 'webglRenderer':
        if (!parentInstance.userData) {
          parentInstance.userData = {};
        }

        if (child instanceof THREE.Scene) {
          parentInstance.userData._scene = child;
        } else {
          throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
        }

        break;
      default:
        throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
        break;
    }

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
