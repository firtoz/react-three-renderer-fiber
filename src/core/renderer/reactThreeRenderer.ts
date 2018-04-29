import {IDescriptorClass} from "../../extensions/resources/ResourceDescriptorWrapper";
import CustomReactRenderer from "../customRenderer/customReactRenderer";
import r3rReconcilerConfig, {ReactThreeReconcilerConfig} from "./reconciler/r3rReconcilerConfig";

export class ReactThreeRenderer extends CustomReactRenderer<ReactThreeReconcilerConfig> {
  public static getHostDescriptorClass(descriptorName: string): IDescriptorClass | undefined {
    return ReactThreeReconcilerConfig.getHostDescriptorClass(descriptorName);
  }

  public findTHREEObject(componentOrElement: any): any {
    return super.findHostObject(componentOrElement);
  }
}

export default new ReactThreeRenderer(r3rReconcilerConfig);
