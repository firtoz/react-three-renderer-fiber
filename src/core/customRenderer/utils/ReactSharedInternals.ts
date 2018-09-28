import "react";

declare module "react" {
  interface IReactDebugCurrentFrame {
    getStackAddendum?: () => string;
  }

  interface IReactSharedInternals {
    ReactDebugCurrentFrame?: IReactDebugCurrentFrame;
  }

  const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: IReactSharedInternals;
}
