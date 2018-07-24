import * as React from "react";
import {IRenderer} from "react-fiber-export";
import ContainerUnawareReconcilerConfig from "../../core/customRenderer/ContainerUnawareReconcilerConfig";
import CustomReactRenderer from "../../core/customRenderer/customReactRenderer";
import ReactThreeRendererDescriptor from "../../core/renderer/hostDescriptors/common/ReactThreeRendererDescriptor";
import {ReactThreeRenderer} from "../../core/renderer/reactThreeRenderer";
import ResourceDescriptorWrapper from "./ResourceDescriptorWrapper";
import {ResourcesDescriptor} from "./ResourcesDescriptor";

class ResourceReconcilerConfig extends ContainerUnawareReconcilerConfig<ReactThreeRendererDescriptor> {
  constructor() {
    super();

    [
      "meshBasicMaterial",
      "boxGeometry",
      "texture",
      "meshLambertMaterial",
      "parametricGeometry",
    ].forEach((descName) => {
      const hostDescriptor = ReactThreeRenderer.getHostDescriptorClass(descName);

      if (hostDescriptor === undefined) {
        throw new Error(`Cannot find ${descName} descriptor.`);
      }

      this.defineHostDescriptor(descName, new (ResourceDescriptorWrapper(hostDescriptor))());
    });

    this.defineHostDescriptor("resources", new ResourcesDescriptor());
  }
}

export default class ResourceRenderer extends CustomReactRenderer {
  constructor(wantsDevtools: boolean = true) {
    super(new ResourceReconcilerConfig(), wantsDevtools);
  }

  protected renderSubtreeIntoContainer(reconciler: IRenderer,
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
      const newRoot = reconciler.createContainer(container);

      container[rootContainerSymbol] = newRoot;

      root = newRoot;

      reconciler.unbatchedUpdates(() => {
        reconciler.updateContainer(children, newRoot, parentComponent, callback);
      });
    } else {
      reconciler.updateContainer(children, root, parentComponent, callback);
    }

    return reconciler.getPublicRootInstance(root);
  }
}
