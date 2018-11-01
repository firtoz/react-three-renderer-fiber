import * as React from "react";
import * as ReactReconciler from "react-reconciler";
import {CustomRendererElementInstance} from "../renderer/hostDescriptors/common/object3DBase";
import {RenderAction} from "../renderer/hostDescriptors/descriptors/render";
import {CustomReconcilerConfig} from "./createReconciler";
import isNonProduction from "./utils/isNonProduction";

export default class CustomReactRenderer<TReconcilerConfig extends //
  CustomReconcilerConfig<any> = CustomReconcilerConfig<any>> {
  private readonly reconciler: ReactReconciler.Reconciler<any, any, any, any>;

  constructor(reconcilerConfig: TReconcilerConfig, packageName: string) {
    this.reconciler = ReactReconciler(reconcilerConfig);
    this.reconciler.injectIntoDevTools({
      bundleType: isNonProduction ? 1 : 0,
      findFiberByHostInstance: (hostInstance: CustomRendererElementInstance): ReactReconciler.Fiber => {
        // debugger;
        console.log("getClosestInstanceFromNode", hostInstance);

        return hostInstance[CustomReconcilerConfig.fiberSymbol];
      },
      rendererPackageName: packageName,
      // This needs to be the React version in order for DevTools to work:
      // tslint:disable-next-line:max-line-length
      // https://github.com/facebook/react-devtools/blob/c2db8dd5c13edd29444c72714b49cdb1073a1a44/backend/attachRendererFiber.js#L25
      version: React.version,
    });
  }

  public render<TProps>(element: React.ReactElement<TProps> | null,
                        container: any,
                        callback?: any): any | null;

  public render(elements: ReadonlyArray<React.ReactElement<any> | null>,
                container: any,
                callback?: any): any[] | null ;

  public render<TProps>(element: //
                          React.ReactElement<TProps>
                          | ReadonlyArray<React.ReactElement<any> | null>
                          | null,
                        container: any,
                        callback?: any): any | null {
    return this.renderSubtreeIntoContainer(this.reconciler,
      CustomReconcilerConfig.contextSymbol,
      CustomReconcilerConfig.rootContainerSymbol,
      null,
      element,
      container,
      false,
      callback);
  }

  public unmountComponentAtNode(container: any, callback?: () => void): any {
    if (container[CustomReconcilerConfig.rootContainerSymbol]) {
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
      this.reconciler.unbatchedUpdates(() => {
        this.renderSubtreeIntoContainer(this.reconciler,
          CustomReconcilerConfig.contextSymbol,
          CustomReconcilerConfig.rootContainerSymbol,
          null,
          null,
          container,
          false,
          () => {
            delete container[CustomReconcilerConfig.rootContainerSymbol];

            if (callback != null) {
              callback();
            }
          });
      });
      // If you call unmountComponentAtNode twice in quick succession, you'll
      // get `true` twice. That's probably fine?
      return true;
    } else {
      if (callback != null) {
        callback();
      }
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

  public findHostObject(componentOrElement: any) {
    if (componentOrElement == null) {
      return null;
    }

    if (componentOrElement[CustomReconcilerConfig.fiberSymbol] !== undefined) {
      // must be a host instance already then
      return componentOrElement;
    }

    return this.reconciler.findHostInstance(componentOrElement);
  }

  protected renderSubtreeIntoContainer(reconciler: ReactReconciler.Reconciler<any, any, any, any>,
                                       contextSymbol: symbol,
                                       rootContainerSymbol: symbol,
                                       parentComponent: React.Component<any, any> | null,
                                       children: any,
                                       container: any,
                                       forceHydrate: boolean,
                                       callback: () => void): any {
    if (forceHydrate) {
      throw new Error("forceHydrate not implemented yet");
    }

    let root = container[rootContainerSymbol];

    if (!root) {
      const newRoot = reconciler.createContainer(container, false, false);

      container[rootContainerSymbol] = newRoot;

      const renderActionsForContainer: RenderAction[] = [];

      if (container[contextSymbol] === undefined) {
        container[contextSymbol] = this.createContext(renderActionsForContainer);
      }

      root = newRoot;

      reconciler.unbatchedUpdates(() => {
        reconciler.updateContainer(children, newRoot, parentComponent, callback);
      });
    } else {
      reconciler.updateContainer(children, root, parentComponent, callback);
    }

    return reconciler.getPublicRootInstance(root);
  }

  protected createContext(renderActionsForContainer: RenderAction[]): any {
    return undefined;
  }
}
