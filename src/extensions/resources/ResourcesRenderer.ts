import ContainerUnawareReconcilerConfig from "../../core/customRenderer/ContainerUnawareReconcilerConfig";
import CustomReactRenderer from "../../core/customRenderer/customReactRenderer";
import ReactThreeRendererDescriptor from "../../core/renderer/hostDescriptors/common/ReactThreeRendererDescriptor";
import BoxGeometryDescriptor from "../../core/renderer/hostDescriptors/descriptors/geometries/boxGeometry";
import MeshBasicMaterialDescriptor from "../../core/renderer/hostDescriptors/descriptors/materials/meshBasicMaterial";
import ResourceDescriptorWrapper from "./ResourceDescriptorWrapper";
import {ResourcesDescriptor} from "./ResourcesDescriptor";

class ResourceReconcilerConfig extends ContainerUnawareReconcilerConfig<ReactThreeRendererDescriptor> {
  constructor() {
    super();

    [
      ["boxGeometry", BoxGeometryDescriptor],
      ["meshBasicMaterial", MeshBasicMaterialDescriptor],
    ].forEach(([name, descriptor]: any) => {
      this.defineHostDescriptor(name, new (ResourceDescriptorWrapper(descriptor))());
    });
    // const wrappedBoxGeometry = WrapClass(BoxGeometryDescriptor);

    this.defineHostDescriptor("resources", new ResourcesDescriptor());
    // descriptorsRequireContext
    //   .keys()
    //   .forEach((key: string) => {
    //     const name = key.match(/(\w+)\.ts$/);
    //     if (name !== null) {
    //       this.defineHostDescriptor(name[1], new (descriptorsRequireContext(key).default)());
    //     }
    //   });
  }
}

export default class ResourceRenderer extends CustomReactRenderer {
  constructor(wantsDevtools: boolean = true) {
    super(new ResourceReconcilerConfig(), wantsDevtools);
  }
}
