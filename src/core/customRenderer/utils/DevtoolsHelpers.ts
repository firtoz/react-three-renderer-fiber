import {IFiber, IHookConfig, IReactFiberRendererConfig, ReactFiberDevToolsHook} from "react-fiber-export";

import {CustomRendererElementInstance} from "../../renderer/hostDescriptors/common/object3DBase";
import {CustomReconcilerConfig} from "../createReconciler";
import {ReactDevtools} from "./dependencies-shim";
import isNonProduction from "./isNonProduction";

const {injectInternals} = ReactFiberDevToolsHook;

declare const process: {
  env: {
    ENABLE_REACT_ADDON_HOOKS: string;
    DISABLE_REACT_ADDON_HOOKS: string;
  };
};

declare function require(filename: string): any;

export function hookDevtools(reconcilerConfig: CustomReconcilerConfig<any>) {
  if (process.env.DISABLE_REACT_ADDON_HOOKS !== "true" &&
    ((isNonProduction) || process.env.ENABLE_REACT_ADDON_HOOKS === "true")) {
    // Inject the runtime into a devtools global hook regardless of browser.
    // Allows for debugging when the hook is injected on the page.
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined") {
      // tslint:disable-next-line:no-var-requires
      const R3RVersion = require("../../../../package.json").version;

      enum BundleType {
        PROD = 0,
        DEV = 1,
      }

      let devtoolsAgent: ReactDevtools.IAgent;
      let highlightCache: any;

      const highlightElement = document.createElement("div");
      highlightElement.appendChild(
        document.createComment("This element is here to be used by React Devtools" +
          " in order to highlight " + reconcilerConfig.constructor.name + " components." +
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

      let reactDevtoolsRendererId: number;
      let rendererListenerCleanup: (() => void) | null;
      // let reconciler: CustomReconcilerConfig<any> | null = null;

      const rendererListener = (info: ReactDevtools.IRendererInfo) => {
        if (reconcilerConfig === (info.renderer as any).reconciler) {
          reactDevtoolsRendererId = info.id;

          if (rendererListenerCleanup != null) {
            rendererListenerCleanup();

            rendererListenerCleanup = null;
          }
        }
      };

      rendererListenerCleanup = __REACT_DEVTOOLS_GLOBAL_HOOK__.sub("renderer", rendererListener);

      type INativeType = any;

      // import interface Fiber from 'R'

      const hookConfig: IHookConfig & { reconciler: IReactFiberRendererConfig } = {
        findFiberByHostInstance(hostInstance: CustomRendererElementInstance): IFiber {
          // debugger;
          console.log("getClosestInstanceFromNode", hostInstance);

          return hostInstance[CustomReconcilerConfig.fiberSymbol];
        },
        findHostInstanceByFiber(/* fiber: ReactFiber.IFiber */): INativeType {
          return highlightElement;
        },
        bundleType: BundleType.DEV,
        // yep, react-dom-style
        reconciler: reconcilerConfig,
        rendererPackageName: "react-dom",
        version: R3RVersion,
      };

      if (!isNonProduction) {
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
        agent
          .on("highlight", onHighlightFromInspector)
          .on("hideHighlight", onHideHighlightFromInspector);
        // agent.on('highlightMany', (...args) => {
        //   console.log('highlightMany?', args);
        // });
      };

      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent !== "undefined") {
        hookAgent(__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent);
      } else {
        const devtoolsCallbackCleanup = __REACT_DEVTOOLS_GLOBAL_HOOK__
          .sub("react-devtools", (agent: ReactDevtools.IAgent) => {
            devtoolsCallbackCleanup();

            hookAgent(agent);
          });
      }
    }
  }

}
