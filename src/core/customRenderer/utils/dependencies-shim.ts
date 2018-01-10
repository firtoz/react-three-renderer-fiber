import {IHookConfig} from "react-fiber-export";

export declare namespace ReactDevtools {
  enum BundleType {
    PROD = 0,
    DEV = 1,
  }

  interface IRendererInfo {
    renderer: IHookConfig;
    id: number;
  }

  export interface IAgent {
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

declare global {
  const __REACT_DEVTOOLS_GLOBAL_HOOK__: ReactDevtools.IGlobalHook;
}
