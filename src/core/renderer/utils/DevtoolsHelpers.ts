import {IFiber, ReactFiberDevToolsHook} from "react-fiber-export";

import r3rFiberSymbol from "./r3rFiberSymbol";

const {injectInternals} = ReactFiberDevToolsHook;

declare const process: {
  env: {
    NODE_ENV: string,
    ENABLE_REACT_ADDON_HOOKS: string;
  };
};

if (process.env.NODE_ENV !== "production" || process.env.ENABLE_REACT_ADDON_HOOKS === "true") {
  /* tslint:disable */
  const R3RVersion = require("../../../../package.json").version;

  /* tslint:enable */

  enum BundleType {
    PROD = 0,
    DEV = 1,
  }

  let devtoolsAgent: ReactDevtools.IAgent;
  let highlightCache: any;

  const highlightElement = document.createElement("div");
  highlightElement.appendChild(
    document.createComment("This element is here to be used by React Devtools" +
      " in order to highlight ReactThreeRenderer components." +
      " It is harmless, but if you'd like to get rid of it, use a production environment."));
  highlightElement.setAttribute("style", "position: absolute;width: 0;height: 0; top: 0; left: 0;");
  document.body.appendChild(highlightElement);

  const onHideHighlightFromInspector = () => {
    if (highlightCache) {
      console.log("hiding highlight");

      highlightCache = null;
    }
  };

  const onHighlightFromInspector = (highlightInfo: any) => {
    if (highlightInfo.node === highlightElement) {
      if (highlightCache !== highlightInfo) {
        highlightCache = highlightInfo;
        console.log("highlighting: ", highlightInfo);
      } else {
        console.log("was already highlighting: ", highlightInfo);
      }
    }
  };

  const globalDevtoolsHook = __REACT_DEVTOOLS_GLOBAL_HOOK__;

  // Inject the runtime into a devtools global hook regardless of browser.
  // Allows for debugging when the hook is injected on the page.
  if (typeof globalDevtoolsHook !== "undefined") {
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
    let rendererListenerCleanup: (() => void) | null;

    const rendererListener = (info: ReactDevtools.IRendererInfo) => {
      reactDevtoolsRendererId = info.id;

      if (rendererListenerCleanup != null) {
        rendererListenerCleanup();
      }

      rendererListenerCleanup = null;
    };

    rendererListenerCleanup = globalDevtoolsHook.sub("renderer", rendererListener);

    type INativeType = any;

    // import interface Fiber from 'R'

    const hookConfig: ReactDevtools.IHookConfig = {
      findFiberByHostInstance(hostInstance: any): IFiber {
        // debugger;
        console.log("getClosestInstanceFromNode", hostInstance);

        return hostInstance[r3rFiberSymbol];
      },
      findHostInstanceByFiber(/* fiber: ReactFiber.IFiber */): INativeType {
        return highlightElement;
      },
      bundleType: BundleType.DEV,
      rendererPackageName: "react-dom",
      version: R3RVersion,
    };

    if (process.env.NODE_ENV === "production") {
      hookConfig.bundleType = BundleType.PROD;
    }

    injectInternals(hookConfig);

    const hookAgent = (agent: ReactDevtools.IAgent) => {
      devtoolsAgent = agent;

      console.log("agent hooked!");

      // agent.on('startInspecting', (...args) => {
      //   console.log('start inspecting?', args);
      // });
      // agent.on('setSelection', (...args) => {
      //   console.log('set selection?', args);
      // });
      // agent.on('selected', (...args) => {
      //   console.log('selected?', args);
      // });
      agent.on("highlight", onHighlightFromInspector);
      agent.on("hideHighlight", onHideHighlightFromInspector);
      // agent.on('highlightMany', (...args) => {
      //   console.log('highlightMany?', args);
      // });
    };

    if (typeof globalDevtoolsHook.reactDevtoolsAgent !== "undefined"
      && globalDevtoolsHook.reactDevtoolsAgent) {
      const agent = globalDevtoolsHook.reactDevtoolsAgent;
      hookAgent(agent);
    } else {
      const devtoolsCallbackCleanup = globalDevtoolsHook
        .sub("react-devtools", (agent: ReactDevtools.IAgent) => {
          devtoolsCallbackCleanup();

          hookAgent(agent);
        });
    }
  }
}
