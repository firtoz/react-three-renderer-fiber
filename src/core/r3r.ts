window.__DEV__ = process.env.NODE_ENV !== "production";

import {BundleType} from "./DevtoolsHelpers";

import r3rRootContainerSymbol from './r3rRootContainerSymbol';
import fiberSymbol from './r3rFiberSymbol';

import {injectInternals,} from 'react-fiber-export/lib/renderers/shared/fiber/ReactFiberDevToolsHook';
import appendChild from './renderer/appendChild';
import appendChildToContainer from './renderer/appendChildToContainer';
import appendInitialChild from './renderer/appendInitialChild';
import commitTextUpdate from './renderer/commitTextUpdate';
import commitMount from './renderer/commitMount';
import commitUpdate from './renderer/commitUpdate';
import createInstance from './renderer/createInstance';
import createTextInstance from './renderer/createTextInstance';
import finalizeInitialChildren from './renderer/finalizeInitialChildren';
import getPublicInstance from './renderer/getPublicInstance';
import insertBefore from './renderer/insertBefore';
import insertInContainerBefore from './renderer/insertInContainerBefore';
import prepareForCommit from './renderer/prepareForCommit';
import prepareUpdate from './renderer/prepareUpdate';
import removeChild from './renderer/removeChild';
import removeChildFromContainer from './renderer/removeChildFromContainer';
import resetAfterCommit from './renderer/resetAfterCommit';
import resetTextContent from './renderer/resetTextContent';
import shouldDeprioritizeSubtree from './renderer/shouldDeprioritizeSubtree';
import getRootHostContext from './renderer/getRootHostContext';
import getChildHostContext from './renderer/getChildHostContext';
import shouldSetTextContent from './renderer/shouldSetTextContent';
import ReactFiberReconciler = require('react-fiber-export/lib/renderers/shared/fiber/ReactFiberReconciler');
import ReactDOMFrameScheduling = require('react-fiber-export/lib/renderers/shared/ReactDOMFrameScheduling');

const R3RVersion = require('../../package.json').version;

const R3Renderer = ReactFiberReconciler({
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

function renderSubtreeIntoContainer(parentComponent: React.Component<any, any> | null,
                                    children: any,
                                    container: any,
                                    forceHydrate: boolean,
                                    callback: Function,) {
  let root = container[r3rRootContainerSymbol];

  if (!root) {
    const newRoot = R3Renderer.createContainer(container);

    container[r3rRootContainerSymbol] = newRoot;
    container[fiberSymbol] = newRoot;

    root = newRoot;

    console.log('rooot', root);

    R3Renderer.unbatchedUpdates(function () {
      R3Renderer.updateContainer(children, newRoot, parentComponent, callback);
    });
  } else {
    R3Renderer.updateContainer(children, root, parentComponent, callback);
  }

  return R3Renderer.getPublicRootInstance(root);
}

class R3R {
  static render(element: any, container: any, callback?: any) {
    return renderSubtreeIntoContainer(null, element, container, false, callback);
  }

  static unmountComponentAtNode(container: any): any {
    if (container[r3rRootContainerSymbol]) {
      // if (__DEV__) {
      //   const rootEl = getReactRootElementInContainer(container);
      //   const renderedByDifferentReact =
      //     rootEl && !ReactDOMComponentTree.getInstanceFromNode(rootEl);
      //   warning(
      //     !renderedByDifferentReact,
      //     "unmountComponentAtNode(): The node you're attempting to unmount " +
      //     'was rendered by another copy of React.',
      //   );
      // }

      // Unmount should not be batched.
      R3Renderer.unbatchedUpdates(() => {
        renderSubtreeIntoContainer(null, null, container, false, () => {
          container[r3rRootContainerSymbol] = null;
        });
      });
      // If you call unmountComponentAtNode twice in quick succession, you'll
      // get `true` twice. That's probably fine?
      return true;
    } else {
      // if (__DEV__) {
      //   const rootEl = getReactRootElementInContainer(container);
      //   const hasNonRootReactChild = !!(rootEl &&
      //     ReactDOMComponentTree.getInstanceFromNode(rootEl));
      //
      //   // Check if the container itself is a React root node.
      //   const isContainerReactRoot =
      //     container.nodeType === 1 &&
      //     isValidContainer(container.parentNode) &&
      //     !!container.parentNode._reactRootContainer;
      //
      //   warning(
      //     !hasNonRootReactChild,
      //     "unmountComponentAtNode(): The node you're attempting to unmount " +
      //     'was rendered by React and is not a top-level container. %s',
      //     isContainerReactRoot
      //       ? 'You may have accidentally passed in a React root node instead ' +
      //       'of its container.'
      //       : 'Instead, have the parent component update its state and ' +
      //       'rerender in order to remove this component.',
      //   );
      // }

      return false;
    }
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

  const globalDevtoolsHook = __REACT_DEVTOOLS_GLOBAL_HOOK__;

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
    let rendererListenerCleanup: Function | null;

    const rendererListener = (info: ReactDevtools.RendererInfo) => {
      reactDevtoolsRendererId = info.id;

      if (rendererListenerCleanup != null) {
        rendererListenerCleanup();
      }

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
