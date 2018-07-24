import * as PropTypes from "prop-types";
import {
  Material, MaterialParameters,
  Mesh, Texture,
} from "three";
import {TUpdatePayload} from "../../../../customRenderer/createReconciler";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import ReactThreeRendererDescriptor from "../../common/ReactThreeRendererDescriptor";
import {IRenderableProp, PropertyWrapper, RefWrapper} from "../../common/RefWrapper";
import {ITextureProps, TTextureParents} from "../textures/texture";

// TODO test slots
export type MaterialSlotType = "material" |
  "customDepthMaterial";

interface IMaterialProps extends MaterialParameters {
  map?: IRenderableProp<Texture, ITextureProps>;
  slot?: MaterialSlotType;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      Material: IThreeElementPropsBase<Material> & IMaterialProps;
    }
  }
}

const defaultSlotValue: MaterialSlotType = "material";

class MaterialMetadata {
  public constructor(public parent: Mesh | null,
                     public slot: MaterialSlotType) {

  }
}

const materialMetadataSymbol = Symbol("r3r-material-metadata");

export abstract class MaterialDescriptorBase<TProps extends IMaterialProps = IMaterialProps,
  TType extends Material = Material,
  TEnhancedMaterial extends TType & {
    [materialMetadataSymbol]: MaterialMetadata,
  } = TType & {
    [materialMetadataSymbol]: MaterialMetadata,
  }> extends ReactThreeRendererDescriptor<TProps,
  TType,
  Mesh> {
  private static removeFromSlotOfParent(parent: Mesh, lastSlot: MaterialSlotType, material: any) {
    if (!(parent as any instanceof Mesh)) {
      return;
    }

    if ((parent as any)[lastSlot] === material) {
      (parent as any)[lastSlot] = null;
    }
  }

  private static addToSlotOfParent(parent: Mesh, slot: MaterialSlotType, material: any) {
    if (!(parent as any instanceof Mesh)) {
      return;
    }

    if ((parent as any)[slot] !== material) {
      (parent as any)[slot] = material;
    }
  }

  protected constructor() {
    super();

    this.hasProp<MaterialSlotType>("slot", (instance: TEnhancedMaterial, newValue) => {
      // TODO test this
      const metadata = instance[materialMetadataSymbol];

      const parent = metadata.parent;

      if (parent !== null) {
        const previousSlot = metadata.slot;

        MaterialDescriptorBase.removeFromSlotOfParent(parent, previousSlot, instance);
        MaterialDescriptorBase.addToSlotOfParent(parent, newValue, instance);
      }

      metadata.slot = newValue;
    }).withDefault(defaultSlotValue)
      .withType(PropTypes.oneOf([
        "material",
        "customDepthMaterial",
      ]));
  }

  public applyInitialPropUpdates(instance: TEnhancedMaterial, props: TProps): void {
    delete (props as any).children;

    // skip the updates, we know what we're doing here
    // TODO verify that it is the case for ALL material kinds.
    (instance as Material).setValues(props);

    let slot: MaterialSlotType | null = null;

    if (props.slot !== undefined) {
      slot = props.slot;
    } else {
      slot = defaultSlotValue;
    }

    instance[materialMetadataSymbol] = new MaterialMetadata(null, slot);
  }

  public commitUpdate(instance: TEnhancedMaterial,
                      updatePayload: TUpdatePayload,
                      oldProps: TProps,
                      newProps: TProps): boolean {
    // that simple!?
    (instance as Material).setValues(newProps);

    return true;
  }

  public willBeAddedToParent(instance: TEnhancedMaterial, parent: Mesh) {
    const metadata = instance[materialMetadataSymbol];
    metadata.parent = parent;

    MaterialDescriptorBase.addToSlotOfParent(parent, metadata.slot, instance);
  }

  public willBeRemovedFromParent(instance: TEnhancedMaterial, parent: Mesh): void {
    const metadata = instance[materialMetadataSymbol];
    metadata.parent = null;

    MaterialDescriptorBase.removeFromSlotOfParent(parent, metadata.slot, instance);
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
