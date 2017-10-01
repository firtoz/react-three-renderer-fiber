import {ReactFiber} from "./dts";

declare module "react-fiber-export/lib/renderers/shared/fiber/ReactFiberReconciler" {
  function ReactFiberReconciler(config: ReactFiber.IReactFiberRendererConfig): ReactFiber.IRenderer;

  export = ReactFiberReconciler;
}
