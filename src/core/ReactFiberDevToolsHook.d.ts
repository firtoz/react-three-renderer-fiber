import {ReactDevtools, ReactFiber} from "./dts";

declare module "react-fiber-export/lib/renderers/shared/fiber/ReactFiberDevToolsHook" {
  export function injectInternals(internals: ReactDevtools.IHookConfig): any;

  export function onCommitRoot(root: ReactFiber.IFiberRoot): any;

  export function onCommitUnmount(): any;
}
