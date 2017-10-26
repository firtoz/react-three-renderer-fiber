import {IFiber} from "react-fiber-export";

declare global {
  namespace ReactDevtools {
    enum BundleType {
      PROD = 0,
      DEV = 1,
    }

    interface IHookConfig {
      findFiberByHostInstance: (hostInstance: any) => IFiber;
      findHostInstanceByFiber: (fiber: IFiber) => any;
      // This is an enum because we may add more (e.g. profiler build)
      bundleType: number;
      version: string;
      rendererPackageName: string;
    }

    interface IRendererInfo {
      renderer: IHookConfig;
      id: number;
    }

    interface IAgent {
      on(name: "highlight",
         callback: (highlightInfo: any) => void): this;

      on(name: "hideHighlight",
         callback: () => void): this;
    }

    interface IGlobalHook {
      reactDevtoolsAgent: ReactDevtools.IAgent;

      sub(name: "react-devtools",
          callback: (agent: ReactDevtools.IAgent) => void): () => void;

      sub(name: "renderer",
          callback: (rendererInfo: ReactDevtools.IRendererInfo) => void): () => void;
    }
  }

  const __REACT_DEVTOOLS_GLOBAL_HOOK__: ReactDevtools.IGlobalHook;
}
