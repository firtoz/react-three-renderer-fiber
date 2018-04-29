import ContainerUnawareReconcilerConfig from "../../core/customRenderer/ContainerUnawareReconcilerConfig";
import CustomReactRenderer from "../../core/customRenderer/customReactRenderer";
import ReactThreeRendererDescriptor from "../../core/renderer/hostDescriptors/common/ReactThreeRendererDescriptor";
import ResourceDescriptorWrapper from "./ResourceDescriptorWrapper";
import {ResourcesDescriptor} from "./ResourcesDescriptor";

import {ReactThreeRenderer} from "../../core/renderer/reactThreeRenderer";

class ResourceReconcilerConfig extends ContainerUnawareReconcilerConfig<ReactThreeRendererDescriptor> {
  constructor() {
    super();

    [
      "meshBasicMaterial",
      "boxGeometry",
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
}
