import {
  Geometry,
  Material, MaterialParameters,
  Mesh, MeshBasicMaterial, MeshDepthMaterial, Texture,
} from "three";
import {MeshMaterial} from "three/three-core";
import {TUpdatePayload} from "../../../../customRenderer/createReconciler";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import ReactThreeRendererDescriptor from "../../common/ReactThreeRendererDescriptor";
import {IRenderableProp, PropertyWrapper, RefWrapper, SimplePropertyWrapper} from "../../common/RefWrapper";
import {ITextureProps, TTextureParents} from "../textures/texture";

interface IMaterialProps extends MaterialParameters {
  map?: IRenderableProp<Texture, ITextureProps>;
}

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
  public applyInitialPropUpdates(instance: TType, props: TProps): void {
    delete (props as any).children;

    // if(props.map)
    // if(props.)
    // skip the updates, we know what we're doing here
    // TODO verify that it is the case for ALL material kinds.
    (instance as Material).setValues(props);
  }

  public commitUpdate(instance: TType,
                      updatePayload: TUpdatePayload,
                      oldProps: TProps,
                      newProps: TProps): boolean {
    // that simple!?
    (instance as Material).setValues(newProps);

    return true;
  }

  public willBeAddedToParent(instance: TType, parent: Mesh) {
    // TODO use slot like texture
    // parent.material = instance as any as MeshMaterial;
  }

  public willBeRemovedFromParent(instance: TType, parent: Mesh): void {
    // TODO use slot like texture
    // if (parent.material === instance as any as MeshMaterial) {
    //   parent.material = new MeshBasicMaterial();
    // }
  }

  protected hasMap(): void {
    new RefWrapper([
      "map",
    ], this)
      .wrapProperty(new PropertyWrapper<TTextureParents, Texture>(
        "map",
        [Texture],
        (instance, newValue) => {
          instance.map = newValue;

          instance.needsUpdate = true;
        }));
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
