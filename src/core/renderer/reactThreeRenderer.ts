import CustomReactRenderer from "../customRenderer/customReactRenderer";
import r3rReconcilerConfig from "./reconciler/r3rReconcilerConfig";

export class ReactThreeRenderer extends CustomReactRenderer {
  public findTHREEObject(componentOrElement: any): any {
    return super.findHostObject(componentOrElement);
  }
}

export default new ReactThreeRenderer(r3rReconcilerConfig);
