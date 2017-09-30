import {BundleType} from "./DevtoolsHelpers";

window.__DEV__ = true;

import ReactFiberReconciler = require('react-fiber-export/lib/renderers/shared/fiber/ReactFiberReconciler');
import ReactDOMFrameScheduling = require('react-fiber-export/lib/renderers/shared/ReactDOMFrameScheduling');

import applyInitialPropUpdates from './applyInitialPropUpdates';
import diffProperties from './diffProperties';
import createInstanceInternal from './createInstanceInternal';
import commitUpdateInternal from './commitUpdateInternal';
import appendInitialChildInternal from './appendInitialChildInternal';

import r3rRootContainerSymbol from './r3rRootContainerSymbol';
import fiberSymbol from './r3rFiberSymbol';

import {
  injectInternals,
} from 'react-fiber-export/lib/renderers/shared/fiber/ReactFiberDevToolsHook';

const R3RVersion = require('../../package.json').version;

function precacheInstance(fiber: ReactFiber.Fiber, threeElement: any) {
  threeElement[fiberSymbol] = fiber;
}

const emptyObject = {};

const R3Renderer = ReactFiberReconciler({
  appendChild(parentInstance, child) {
    const parentFiber = parentInstance[fiberSymbol];
    const childFiber = child[fiberSymbol];

    debugger;

    const parentType = parentFiber.type;
    const childType = childFiber.type;

    if (parentInstance instanceof HTMLCanvasElement) {
      // party time!
      return;
    }

    switch (parentType) {
      case 'scene':
        console.log(parentInstance, child);
        parentInstance.add(child);
        break;
      default:
        throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
      // break;
    }
  },
  appendChildToContainer(parentInstance: any, child: any): any {
    console.log('appendChildToContainer');

    if (parentInstance instanceof HTMLCanvasElement) {
      // party time!
      return;
    }

    throw new Error('appendChildToContainer');
    // return false;
  },
  appendInitialChild(parentInstance, child) {
    appendInitialChildInternal(parentInstance, child);
  },
  commitTextUpdate(): any {
    console.log('commitTextUpdate');
    throw new Error('commitTextUpdate');
    // return false;
  },
  commitMount(): any {
    console.log('commitMount');
    throw new Error('commitMount');
    // return false;
  },
  commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
    commitUpdateInternal(updatePayload, type, instance);
  },
  createInstance(type: string, props: any, rootContainerInstance: HTMLCanvasElement, hostContext: any, fiber: ReactFiber.Fiber) {
    let createdInstance = {};

    createdInstance = createInstanceInternal(type, createdInstance, rootContainerInstance, props);

    precacheInstance(fiber, createdInstance);
    applyInitialPropUpdates(type, createdInstance, props);

    return createdInstance;
  },
  createTextInstance(text: string, rootContainerInstance: any, internalInstanceHandle: any): any {
    return text;
  },
  finalizeInitialChildren(r3rElement, type, props, rootContainerInstance) {
    // TODO ?

    return false;
  },
  getPublicInstance(instance) {
    return instance;
  },
  insertBefore(): any {
    console.log('insertBefore');
    throw new Error('insertBefore');
    // return false;
  },
  insertInContainerBefore(): any {
    console.log('insertInContainerBefore');
    throw new Error('insertInContainerBefore');
    // return false;
  },
  prepareForCommit() {
    // TODO ?
  },
  prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) {
    return diffProperties(
      oldProps,
      newProps,
    );
  },
  removeChild(currentParent: any, child): any {
    const parentInstance = currentParent[fiberSymbol];
    switch (parentInstance.type) {
      case 'scene':
        currentParent.remove(child);

        break;
      default:
        console.log('removeChild', parentInstance.type, child);
        throw new Error('removeChild');
    }

    // debugger;
    //
    // console.log('removeChild', arguments);
    // throw new Error('removeChild');
    // return false;
  },
  removeChildFromContainer(): any {
    console.log('removeChildFromContainer');
    throw new Error('removeChildFromContainer');
    // return false;
  },
  resetAfterCommit() {
    // TODO ?
  },
  resetTextContent(): any {
    console.log('resetTextContent');
    throw new Error('resetTextContent');
    // return false;
  },
  shouldDeprioritizeSubtree(type, props) {
    // TODO vis check
    return false;
  },
  getRootHostContext(rootContainerInstance: any) {
    // console.log('getRootHostContext', rootContainerInstance);
    // try to copy from the parents somehow if they're from ReactDOM?

    return emptyObject;
  },
  getChildHostContext(parentHostContext: any, type: any) {
    return parentHostContext;
  },
  scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,
  shouldSetTextContent(props: any) {
    // TODO
    return false;
  },
  useSyncScheduling: true,
});

function renderSubtreeIntoContainer(parentComponent: any, children: any, containerNode: any, callback: any) {
  let root = containerNode[r3rRootContainerSymbol];

  if (!root) {
    const newRoot = R3Renderer.createContainer(containerNode);

    containerNode[r3rRootContainerSymbol] = newRoot;
    containerNode[fiberSymbol] = newRoot;

    root = newRoot;

    console.log('rooot', root);

    // needed to do increase priority to ensure the updates happen ASAP so that getPublicRootInstance will see us
    // R3Renderer.performWithPriority(1, () => {
    R3Renderer.updateContainer(children, newRoot, parentComponent, callback);
    // });
  } else {
    R3Renderer.updateContainer(children, root, parentComponent, callback);
  }

  return R3Renderer.getPublicRootInstance(root);
}


class R3R {
  static render(element: any, container: any, callback?: any) {
    return renderSubtreeIntoContainer(null, element, container, callback);
  }

  // TODO unmount :D

  static rendererInternal = R3Renderer;
}

if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_REACT_ADDON_HOOKS === 'true') {
  let devtoolsAgent: ReactDevtools.Agent;
  let highlightCache: any;

  const highlightElement = document.createElement('div');
  highlightElement.appendChild(document.createComment("This element is here to be used by React Devtools in order to highlight ReactThreeRenderer components. It is harmless, but if you'd like to get rid of it, use a production environment."));
  highlightElement.setAttribute("style", "position: absolute;width: 0;height: 0; top: 0; left: 0;");
  document.body.appendChild(highlightElement);

  const onHideHighlightFromInspector = () => {
    if (highlightCache) {
      console.log('hiding highlight');

      highlightCache = null;
    }
  };

  const onHighlightFromInspector = (highlightInfo: any) => {
    if (highlightInfo.node === highlightElement) {
      if (highlightCache !== highlightInfo) {
        highlightCache = highlightInfo;
        console.log('highlighting: ', highlightInfo);
      } else {
        console.log('was already highlighting: ', highlightInfo);
      }
    }
  };

  const globalDevtoolsHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

  // Inject the runtime into a devtools global hook regardless of browser.
  // Allows for debugging when the hook is injected on the page.
  if (typeof globalDevtoolsHook !== 'undefined'
    && typeof injectInternals === 'function') {
    // const devToolsRendererDefinition = {
    //   ComponentTree: {
    //     getClosestInstanceFromNode(node) {
    //       return React3ComponentTree.getClosestInstanceFromMarkup(node);
    //     },
    //     getNodeFromInstance(instInput) {
    //       let inst = instInput;
    //       // inst is an internal instance (but could be a composite)
    //       while (inst._renderedComponent) {
    //         inst = inst._renderedComponent;
    //       }
    //       if (inst) {
    //         return React3ComponentTree.getMarkupFromInstance(inst);
    //       }
    //
    //       return null;
    //     },
    //   },
    //   Mount: this,
    //   Reconciler: ReactReconciler,
    //   TextComponent: InternalComponent,
    // };

    let reactDevtoolsRendererId: number;
    let rendererListenerCleanup: Function;

    const rendererListener = (info: ReactDevtools.RendererInfo) => {
      reactDevtoolsRendererId = info.id;

      rendererListenerCleanup();

      rendererListenerCleanup = null;
    };

    rendererListenerCleanup = globalDevtoolsHook.sub('renderer', rendererListener);

    interface NativeType {

    }

    // import interface Fiber from 'R'

    const hookConfig: ReactDevtools.HookConfig = {
      findFiberByHostInstance(...args: any[]) {
        // debugger;
        console.log("getClosestInstanceFromNode", ...args);
      },
      findHostInstanceByFiber(): NativeType {
        return highlightElement;
      },
      // This is an enum because we may add more (e.g. profiler build)
      bundleType: BundleType.DEV,
      version: R3RVersion,
      rendererPackageName: 'react-dom'
    };

    injectInternals(hookConfig);

    const hookAgent = (agent: ReactDevtools.Agent) => {
      devtoolsAgent = agent;

      console.log('agent hooked!');

      // agent.on('startInspecting', (...args) => {
      //   console.log('start inspecting?', args);
      // });
      // agent.on('setSelection', (...args) => {
      //   console.log('set selection?', args);
      // });
      // agent.on('selected', (...args) => {
      //   console.log('selected?', args);
      // });
      agent.on('highlight', onHighlightFromInspector);
      agent.on('hideHighlight', onHideHighlightFromInspector);
      // agent.on('highlightMany', (...args) => {
      //   console.log('highlightMany?', args);
      // });
    };

    if (typeof globalDevtoolsHook.reactDevtoolsAgent !== 'undefined'
      && globalDevtoolsHook.reactDevtoolsAgent) {
      const agent = globalDevtoolsHook.reactDevtoolsAgent;
      hookAgent(agent);
    } else {
      const devtoolsCallbackCleanup = globalDevtoolsHook
        .sub('react-devtools', (agent: ReactDevtools.Agent) => {
          devtoolsCallbackCleanup();

          hookAgent(agent);
        });
    }
  }
}

//
// if (typeof globalDevtoolsHook !== 'undefined') {
//   let _rendererListenerCleanup: Function;
//
//   if (typeof globalDevtoolsHook.reactDevtoolsAgent !== 'undefined' && globalDevtoolsHook.reactDevtoolsAgent) {
//     const agent = globalDevtoolsHook.reactDevtoolsAgent;
//     this._hookAgent(agent);
//   } else {
//     const devtoolsCallbackCleanup = globalDevtoolsHook
//       .sub('react-devtools', (agent) => {
//         devtoolsCallbackCleanup();
//
//         this._hookAgent(agent);
//       });
//   }
//
//   //
//   // const hookAgent = (agent: ReactDevtools.Agent) => {
//   //
//   // };
//   //
//   // let rendererListener = (info: ReactDevtools.RendererInfo) => {
//   //   if (info.renderer === hookConfig) {
//   //     console.log('welp, we got it!');
//   //
//   //     console.log('addon info:', info);
//   //
//   //     const id = info.id;
//   //
//   //     const agent = globalDevtoolsHook.reactDevtoolsAgent;
//   //
//   //     hookAgent(agent);
//   //
//   //     _rendererListenerCleanup();
//   //
//   //     _rendererListenerCleanup = null;
//   //   }
//   // };
//   //
//   // _rendererListenerCleanup = globalDevtoolsHook
//   //   .sub('renderer', rendererListener);
//
//   const foundDevTools = injectInternals(hookConfig);
//
//   console.log(foundDevTools);
// }


export default R3R;
