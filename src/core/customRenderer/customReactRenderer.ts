import {IFiber, IRenderer, ReactFiberReconciler} from "react-fiber-export";
import {RenderAction} from "../renderer/hostDescriptors/descriptors/render";
import {CustomReconcilerConfig} from "./createReconciler";
import {hookDevtools} from "./utils/DevtoolsHelpers";
import isNonProduction from "./utils/isNonProduction";

export interface IHostContext {
  triggerRender(): void;

  renderActionFound?(action: RenderAction): void;
}

function renderSubtreeIntoContainer(reconciler: IRenderer,
                                    contextSymbol: symbol,
                                    rootContainerSymbol: symbol,
                                    parentComponent: React.Component<any, any> | null,
                                    children: any,
                                    container: any,
                                    forceHydrate: boolean,
                                    callback: () => void) {
  if (forceHydrate) {
    throw new Error("forceHydrate not implemented yet");
  }

  let root = container[rootContainerSymbol];

  if (!root) {
    const newRoot = reconciler.createContainer(container);

    container[rootContainerSymbol] = newRoot;

    const renderActionsForContainer: RenderAction[] = [];

    if (container[contextSymbol] === undefined) {
      // noinspection UnnecessaryLocalVariableJS
      const rootContext: IHostContext = {
        triggerRender() {
          // console.log("render triggered for", renderActionsForContainer);

          renderActionsForContainer.forEach((action: RenderAction) => {
            action.triggerRender();
          });
        },
        renderActionFound(action: RenderAction) {
          // console.log("render action found", action);
          renderActionsForContainer.push(action);
        },
      };

      container[contextSymbol] = rootContext;
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

export default class CustomReactRenderer {
  private readonly reconciler: IRenderer;

  constructor(private reconcilerConfig: CustomReconcilerConfig<any>, wantsDevtools: boolean = true) {
    if (wantsDevtools && isNonProduction) {
      hookDevtools(reconcilerConfig);
    }

    this.reconciler = ReactFiberReconciler(reconcilerConfig);
  }

  public render<TProps>(element: React.ReactElement<TProps> | null,
                        container: any,
                        callback?: any): any | null;

  public render(elements: Array<React.ReactElement<any> | null>,
                container: any,
                callback?: any): any[] | null ;

  public render<TProps>(element: //
                          React.ReactElement<TProps>
                          | Array<React.ReactElement<any> | null>
                          | null,
                        container: any,
                        callback?: any): any | null {
    return renderSubtreeIntoContainer(this.reconciler,
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
        renderSubtreeIntoContainer(this.reconciler,
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

    const fiber: IFiber = componentOrElement._reactInternalFiber;
    if ((fiber != null)) {
      return this.reconciler.findHostInstance(fiber);
    }

    if (typeof componentOrElement.render === "function") {
      throw new Error("Unable to find node on an unmounted component.");
    } else {
      throw new Error("Element appears to be" +
        " neither ReactComponent nor DOMNode. Keys: %s" + Object.keys(componentOrElement));
    }
  }
}
