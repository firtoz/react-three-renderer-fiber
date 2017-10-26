import {
  Material, MaterialParameters,
  Mesh, MeshBasicMaterial,
} from "three";
import {IHostContext} from "../../../renderer/fiberRenderer/createInstance";
import {TUpdatePayload} from "../../../renderer/fiberRenderer/prepareUpdate";
import r3rContextSymbol from "../../../renderer/utils/r3rContextSymbol";
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

  public insertInContainerBefore(instance: TType, container: Mesh, before: any): void {
    container.material = instance;
  }

  public appendToContainer(instance: TType, container: Mesh): void {
    container.material = instance;
  }

  public willBeRemovedFromContainer(instance: TType, container: Mesh): void {
    if (container.material === instance) {
      (container as any).material = new MeshBasicMaterial();
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
