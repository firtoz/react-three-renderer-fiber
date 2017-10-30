import {
  Material, MaterialParameters,
  Mesh, MeshBasicMaterial,
} from "three";
import {TUpdatePayload} from "../../../customRenderer/createReconciler";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import ReactThreeRendererDescriptor from "../../common/ReactThreeRendererDescriptor";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      Material: IThreeElementPropsBase<Material> & MaterialParameters;
    }
  }
}

export abstract class MaterialDescriptorBase<TProps extends MaterialParameters = MaterialParameters,
  TType extends Material = Material> extends ReactThreeRendererDescriptor<TProps,
  TType,
  Mesh> {
  constructor() {
    super();
  }

  public applyInitialPropUpdates(instance: TType, props: TProps): void {
    // skip the updates, we know what we're doing here
    // TODO verify that it is the case for ALL material kinds.
    instance.setValues(props);
  }

  public commitUpdate(instance: TType,
                      updatePayload: TUpdatePayload,
                      oldProps: TProps,
                      newProps: TProps): boolean {
    // that simple!?
    instance.setValues(newProps);

    return true;
  }

  public willBeAddedToParent(instance: TType, parent: Mesh) {
    parent.material = instance;
  }

  public willBeRemovedFromParent(instance: TType, parent: Mesh): void {
    if (parent.material === instance) {
      (parent as any).material = new MeshBasicMaterial();
    }
  }
}

export class MaterialDescriptor extends MaterialDescriptorBase<MaterialParameters,
  Material> {
  constructor() {
    super();
  }

  public createInstance(props: MaterialParameters): Material {
    return new Material();
  }
}

export default MaterialDescriptor;
