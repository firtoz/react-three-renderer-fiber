import * as PropTypes from "prop-types";
import {Validator} from "prop-types";
import {
  Material,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PointsMaterial,
  SpriteMaterial, Texture, TextureLoader,
  Wrapping,
} from "three";
import ReactThreeRendererDescriptor from "../../common/ReactThreeRendererDescriptor";

export type TextureSlotType = "map" |
  "specularMap" |
  "lightMap" |
  "aoMap" |
  "emissiveMap" |
  "bumpMap" |
  "normalMap" |
  "displacementMap" |
  "roughnessMap" |
  "metalnessMap" |
  "alphaMap" |
  "envMap";

export interface ITextureProps {
  url: string;
  anisotropy?: number;
  wrapS?: Wrapping;
  wrapT?: Wrapping;
  onLoad?: (texture: ThreeTexture) => void;
  slot?: TextureSlotType;
}

const textureMetadataSymbol = Symbol("r3r-texture-metadata");

class TextureMetadata {
  public constructor(public parent: TTextureParents | null,
                     public slot: TextureSlotType) {

  }
}

export type ThreeTexture = Texture & {
  [textureMetadataSymbol]: TextureMetadata;
};

export type TTextureParents =
  MeshBasicMaterial
  | MeshBasicMaterial
  | MeshStandardMaterial
  | MeshPhongMaterial
  | PointsMaterial
  | SpriteMaterial;

const defaultSlotValue: TextureSlotType = "map";

class TextureDescriptor extends ReactThreeRendererDescriptor<ITextureProps, ThreeTexture, TTextureParents> {
  private static removeFromSlotOfMaterial(parent: TTextureParents, lastSlot: TextureSlotType, texture: ThreeTexture) {
    if (!(parent as any instanceof Material)) {
      return;
    }

    if ((parent as any)[lastSlot] === texture) {
      (parent as any)[lastSlot] = null;
      // TODO check if needsUpdate is necessary
      parent.needsUpdate = true;
    }
  }

  private static addToSlotOfMaterial(parent: TTextureParents, slot: TextureSlotType, texture: ThreeTexture) {
    if (!(parent as any instanceof Material)) {
      return;
    }

    if ((parent as any)[slot] !== texture) {
      (parent as any)[slot] = texture;
      // TODO check if needsUpdate is necessary
      parent.needsUpdate = true;
    }
  }

  constructor() {
    super();

    this.hasProp<string>("url", (instance, newValue) => {
      throw new Error("Nope");
    }, false);

    this.hasProp<(texture: ThreeTexture) => void>("onLoad", (instance, newValue) => {
      throw new Error("Nope");
    }, false);

    this.hasProp<TextureSlotType>("slot", (instance, newValue) => {
      // TODO test this
      const metadata = instance[textureMetadataSymbol];

      const parent = metadata.parent;

      if (parent !== null) {
        const previousSlot = metadata.slot;

        TextureDescriptor.removeFromSlotOfMaterial(parent, previousSlot, instance);
        TextureDescriptor.addToSlotOfMaterial(parent, newValue, instance);
      }

      metadata.slot = newValue;
    }).withDefault(defaultSlotValue)
      .withType(PropTypes.oneOf([
        "map",
        "specularMap",
        "lightMap",
        "aoMap",
        "emissiveMap",
        "bumpMap",
        "normalMap",
        "displacementMap",
        "roughnessMap",
        "metalnessMap",
        "alphaMap",
        "envMap",
      ]));

    this.hasProp("anisotropy", (instance: ThreeTexture, value: number) => {
      instance.anisotropy = value;
      if (instance.image) {
        instance.needsUpdate = true;
      }
    }).withDefault(1)
      .withType(PropTypes.number);
  }

  public createInstance(props: ITextureProps, rootContainerInstance: any): ThreeTexture {
    const texture = new TextureLoader().load(props.url, props.onLoad) as ThreeTexture;

    if (props.anisotropy !== undefined) {
      texture.anisotropy = props.anisotropy;
    }

    let slot: TextureSlotType | null = null;

    if (props.slot !== undefined) {
      slot = props.slot;
    } else {
      slot = defaultSlotValue;
    }

    texture[textureMetadataSymbol] = new TextureMetadata(null, slot);

    return texture;
  }

  public willBeAddedToParent(instance: ThreeTexture, parent: TTextureParents): void {
    const metadata = instance[textureMetadataSymbol];
    metadata.parent = parent;

    TextureDescriptor.addToSlotOfMaterial(parent, metadata.slot, instance);
  }

  public willBeRemovedFromParent(instance: ThreeTexture, parent: TTextureParents): void {
    const metadata = instance[textureMetadataSymbol];

    TextureDescriptor.removeFromSlotOfMaterial(parent, metadata.slot, instance);
  }

  private validateParentSlot(parent: Material, slot: string) {
    // TODO check if the parent has these fields
  }
}

export default TextureDescriptor;
