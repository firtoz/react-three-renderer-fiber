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

export interface ITextureProps {
  url: string;
  anisotropy?: number;
  wrapS?: Wrapping;
  wrapT?: Wrapping;
}

export type TTextureParents =
  MeshBasicMaterial
  | MeshBasicMaterial
  | MeshStandardMaterial
  | MeshPhongMaterial
  | PointsMaterial
  | SpriteMaterial;

class TextureDescriptor extends ReactThreeRendererDescriptor<ITextureProps, Texture, TTextureParents> {
  constructor() {
    super();

    this.hasPropLegacy("slot", {
      default: "map",
      type: PropTypes.oneOf([
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
      ]),
      update: (texture: any, slot: string) => {
        const lastSlot = texture.userData._materialSlot;
        texture.userData._materialSlot = slot;

        if (texture.userData.markup) {
          const parentMarkup = texture.userData.markup.parentMarkup;
          if (parentMarkup) {
            const parent = parentMarkup.threeObject;

            if (parent instanceof Material) {
              if (process.env.NODE_ENV !== "production") {
                this.validateParentSlot(parent, slot);
              }

              // remove from previous slot and assign to new slot
              // TODO add test for this
              this.removeFromSlotOfMaterial(parent, lastSlot, texture);
              this.addToSlotOfMaterial(parent, slot, texture);
            }
          }
        }
      },
      updateInitial: true,
    });
  }

  public hasPropLegacy<TProp>(propName: string, propData: {
    default?: TProp,
    type: Validator<TProp>,
    updateInitial?: boolean,
    update(instance: Texture, value: TProp): void;
  }) {
    // TODO
  }

  public createInstance(props: ITextureProps, rootContainerInstance: any): Texture {
    const texture = new TextureLoader().load(props.url);

    if (props.anisotropy !== undefined) {
      texture.anisotropy = props.anisotropy;
    }

    return texture;
  }

  public willBeAddedToParent(instance: Texture, parent: TTextureParents): void {
    parent.map = instance;
  }

  public willBeRemovedFromParent(instance: Texture, parent: TTextureParents): void {
    if (parent.map === instance) {
      // using "as any" here because it's assuming the map cannot be set to null, but it actually can
      (parent as any).map = null;
    }
  }

  private validateParentSlot(parent: Material, slot: string) {
    // TODO
  }

  private removeFromSlotOfMaterial(parent: Material, lastSlot: any, texture: any) {
    // TODO
  }

  private addToSlotOfMaterial(parent: Material, slot: string, texture: any) {
    // TODO
  }
}

export default TextureDescriptor;
