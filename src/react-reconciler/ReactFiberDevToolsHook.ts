import * as ReactReconciler from "react-reconciler";
import warningWithoutStack from "./warningWithoutStack";

declare var __REACT_DEVTOOLS_GLOBAL_HOOK__: object | void;

let onCommitFiberRoot = null;
let onCommitFiberUnmount = null;
let hasLoggedError = false;

function catchErrors(fn: (arg: ReactReconciler.Fiber | ReactReconciler.FiberRoot) => any) {
  return (arg: ReactReconciler.Fiber | ReactReconciler.FiberRoot) => {
    try {
      return fn(arg);
    } catch (err) {
      if (!hasLoggedError) {
        hasLoggedError = true;
        warningWithoutStack(
          false,
          "React DevTools encountered an error: %s",
          err,
        );
      }
    }
  };
}
export function injectInternals(internals: object): boolean {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined") {
    // No DevTools
    return false;
  }
  const hook = __REACT_DEVTOOLS_GLOBAL_HOOK__ as any;
  if (hook.isDisabled) {
    // This isn't a real property on the hook, but it can be set to opt out
    // of DevTools integration and associated warnings and logs.
    // https://github.com/facebook/react/issues/3877
    return true;
  }
  if (!hook.supportsFiber) {
    warningWithoutStack(
      false,
      "The installed version of React DevTools is too old and will not work " +
        "with the current version of React. Please update React DevTools. " +
        "https://fb.me/react-devtools",
    );
    // DevTools exists, even though it doesn't support Fiber.
    return true;
  }
  try {
    const rendererID = hook.inject(internals);
    // We have successfully injected, so now it is safe to set up hooks.
    onCommitFiberRoot = catchErrors((root: ReactReconciler.FiberRoot) =>
      hook.onCommitFiberRoot(rendererID, root),
    );
    onCommitFiberUnmount = catchErrors((fiber: ReactReconciler.Fiber) =>
      hook.onCommitFiberUnmount(rendererID, fiber),
    );
  } catch (err) {
    // Catch all errors because it is unsafe to throw during initialization.
    warningWithoutStack(
      false,
      "React DevTools encountered an error: %s.",
      err,
    );
  }
  // DevTools exists
  return true;
}
