import {
  Material, MaterialParameters,
  Mesh,
} from "three";
import {IHostContext} from "../../renderer/fiberRenderer/createInstance";
import {TUpdatePayload} from "../../renderer/fiberRenderer/prepareUpdate";
import r3rContextSymbol from "../../renderer/utils/r3rContextSymbol";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

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

  public abstract createInstance(props: TProps): TType;

  public internalApplyInitialPropUpdates(instance: TType, props: TProps): void {
    instance.setValues(props);

    const context: IHostContext = (instance as any)[r3rContextSymbol];

    if (context !== undefined) {
      context.triggerRender();
    }
  }

  public commitUpdate(instance: TType,
                      updatePayload: TUpdatePayload,
                      oldProps: TProps,
                      newProps: TProps): void {
    // that simple!?
    instance.setValues(newProps);

    const context: IHostContext = (instance as any)[r3rContextSymbol];

    if (context !== undefined) {
      context.triggerRender();
    }
  }

  public addedToParent(instance: Material, container: Mesh): void {
    // container.material = instance;
  }

  public willBeRemovedFromParent(instance: Material, parent: Mesh): void {
    // if (parent.material === instance) {
    //   parent.material = null as any;
    // }
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
