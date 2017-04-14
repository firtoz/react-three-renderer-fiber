import * as THREE from 'three';

import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler';
import ReactDOMFrameScheduling from 'react-dom/lib/ReactDOMFrameScheduling';

const r3rRootContainerSymbol = Symbol('r3r-root');
const r3rInstanceSymbol = Symbol('r3r-root');

function applyInitialPropUpdates(type, createdInstance, props) {
  switch (type) {
    case 'boxGeometry':
    case 'meshBasicMaterial':
    case 'scene':
      break;
    case 'webglRenderer': {
      const {
        width,
        height,
      } = props;

      createdInstance.setSize(width, height);

      break;
    }
    case 'mesh':
      const {
        rotation,
      } = props;

      createdInstance.rotation.copy(rotation);

      break;
    case 'perspectiveCamera':
      const {
        name,
        position,
      } = props;

      createdInstance.position.copy(position);
      createdInstance.name = name;

      break;
    default:
      throw new Error('cannot apply props for this type yet: ' + type);
  }
}

function precacheInstance(internalInstance, threeElement) {
  threeElement[r3rInstanceSymbol] = internalInstance;
}

// see ReactDOMFiberComponent.diffProperties
function diffProperties(lastProps, nextProps) {
  // if (process.env.NODE_ENV !== 'production') {
  //   validatePropertiesInDevelopment(tag, nextRawProps); // TODO
  // }

  let updatePayload = null;

  const lastPropsKeys = Object.keys(lastProps);

  for (let i = 0; i < lastPropsKeys.length; ++i) {
    const propKey = lastPropsKeys[i];

    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue;
    }
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
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }

  return updatePayload;
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

    switch (type) {
      default:
        throw new Error('cannot create this type yet: ' + type);
      case 'webglRenderer': {
        createdInstance = new THREE.WebGLRenderer({
          canvas: rootContainerInstance,
        });
        break;
      }
      case 'scene':
        createdInstance = new THREE.Scene();

        break;
      case 'mesh':
        createdInstance = new THREE.Mesh();
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
        } = props;

        createdInstance = new THREE.PerspectiveCamera(
          fov,
          aspect,
          near,
          far
        );

        break;
    }

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
    let sizeUpdates = null;

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
        case 'perspectiveCamera':

          switch (propName) {
            case 'aspect':
              instance.aspect = newValue;
              instance.updateProjectionMatrix();
              break;
            default:
              throw new Error('Cannot update prop ' + propName + ' for ' + type);
          }
          break;
        case 'webglRenderer':
          if (propName === 'width' || propName === 'height') {
            if (!sizeUpdates) {
              sizeUpdates = {};
            }

            sizeUpdates[propName] = newValue;
          }

          break;
        default:
          throw new Error('Cannot update prop ' + propName + ' for ' + type);
      }
    }

    if (type === 'webglRenderer' && sizeUpdates) {
      const newSize = Object.assign({}, instance.getSize(), sizeUpdates);

      instance.setSize(newSize.width, newSize.height);
    }
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
