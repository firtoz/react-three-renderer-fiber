import {
  Material, MaterialParameters,
  Mesh,
} from "three";
import {TUpdatePayload} from "../../renderer/fiberRenderer/prepareUpdate";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      Material: IReactThreeRendererElement<Material> & MaterialParameters;
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

  public abstract createInstance(props: TProps): TType;

  public applyInitialPropUpdates(instance: TType, props: TProps): void {
    instance.setValues(props);
  }

  public commitUpdate(instance: TType,
                      updatePayload: TUpdatePayload,
                      oldProps: TProps,
                      newProps: TProps): void {
    // that simple!?
    instance.setValues(newProps);
  }

  public addedToParent(instance: Material, container: Mesh): void {
    container.material = instance;
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

export default new MaterialDescriptor();
