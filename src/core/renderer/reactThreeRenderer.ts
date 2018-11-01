import * as ReactReconciler from "react-reconciler";
import {IReactThreeRendererDescriptorClass} from "../../extensions/resources/ResourceDescriptorWrapper";
import CustomReactRenderer from "../customRenderer/customReactRenderer";
import {RenderAction} from "./hostDescriptors/descriptors/render";
import r3rReconcilerConfig, {ReactThreeReconcilerConfig} from "./reconciler/r3rReconcilerConfig";

export interface IHostContext {
  triggerRender(): void;

  renderActionFound?(action: RenderAction): void;
}

function renderSubtreeIntoContainer(reconciler: ReactReconciler.Reconciler<any, any, any, any>,
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
    const newRoot = reconciler.createContainer(container, false, false);

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

export class ReactThreeRenderer extends CustomReactRenderer<ReactThreeReconcilerConfig> {
  public static getHostDescriptorClass(descriptorName: string): IReactThreeRendererDescriptorClass | undefined {
    return ReactThreeReconcilerConfig.getHostDescriptorClass(descriptorName);
  }

  public constructor() {
    super(r3rReconcilerConfig, "react-three-renderer-fiber");
  }

  public findTHREEObject(componentOrElement: any): any {
    return super.findHostObject(componentOrElement);
  }

  protected createContext(renderActionsForContainer: RenderAction[]): IHostContext {
    return {
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
  }
}

export default new ReactThreeRenderer();
