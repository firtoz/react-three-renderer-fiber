import * as PropTypes from "prop-types";
import {Validator} from "prop-types";
import * as THREE from "three";
import {Texture} from "three";
import ReactThreeRendererDescriptor from "../../common/ReactThreeRendererDescriptor";

function resource(a: any) {
  //
}

interface IPropertyDescriptor<TInstance, TProp> {
  default: TProp;
  type: Validator<TProp>;
  updateInitial?: boolean;

  update(instance: TInstance, value: TProp): void;
}

class BasicRTRDescriptor<TProps, TInstance> extends ReactThreeRendererDescriptor<TProps, TInstance> {
  constructor(private legacyElementDescriptor: THREEElementDescriptor<TInstance>,
              wantsRepaint: boolean = true) {
    super(wantsRepaint);
  }

  public createInstance(props: TProps, rootContainerInstance: any): TInstance {
    return this.legacyElementDescriptor.construct(props);
  }
}

abstract class THREEElementDescriptor<TInstance> {
  public readonly propMap: Map<string, IPropertyDescriptor<TInstance, any>>;

  protected constructor(react3RendererInstance: React3Renderer) {
    this.propMap = new Map<string, IPropertyDescriptor<TInstance, any>>();
  }

  public abstract construct(...args: any[]): any;

  protected hasProp<TProp>(propName: string, descriptor: IPropertyDescriptor<TInstance, TProp>) {
    if (this.propMap.has(propName)) {
      throw new Error("Unhandled!");
    }

    this.propMap.set(propName, descriptor);
  }

  protected triggerRemount(instance: any, value: any): void {
    //
  }

  protected setParent(...args: any[]) {
    //
  }

  protected applyInitialProps(...args: any[]) {
    //
  }

  protected unmount(...args: any[]) {
    //
  }

  protected highlight(threeObject: any): void {
    //
  }

  protected hideHighlight(threeObject: any): void {
    //
  }
}

class Uniform {
  public value: any;

  public setValue(...args: any[]) {
    //
  }
}

class React3Renderer {

}

function propTypeInstanceOf(prop: any): any {
  //
}

function invariant(...args: any[]) {
  //
}

function warning(...args: any[]) {
  //
}

@resource
class TextureDescriptor extends THREEElementDescriptor<Texture> {
  private static removeFromSlotOfMaterial(material: any, slot: any, texture: any) {
    if (material[slot] === texture) {
      material.userData[`_has${slot}}TextureChild`] = false;

      if (material.userData[`_${slot}}Property`]) {
        // restore the map property
        material[slot] = material.userData[`_${slot}}Property`];
      } else {
        material[slot] = null;
      }

      material.needsUpdate = true;
    }
  }

  private static addToSlotOfMaterial(material: any, slot: any, texture: any) {
    material.userData[`_has${slot}}TextureChild`] = true;

    if (material.userData[`_${slot}}Property`]) {
      let slotInfo = "texture";

      if (slot !== "map") {
        slotInfo += `with a '${slot}' slot`;
      }

      warning(false, "The material already has a" +
        ` '${slot}' property but a ${slotInfo} is being added as a child.` +
        " The child will override the property.");
    } else {
      // removing invariant to enable slot swapping
    }

    if (material[slot] !== texture) {
      material[slot] = texture;
    }
  }

  private static validateParentSlot(parent: any, slot: any) {
    const react3internalComponent = parent.userData.react3internalComponent;
    if (react3internalComponent) {
      const descriptor = react3internalComponent.threeElementDescriptor;
      if (descriptor && !descriptor._supportedMaps[slot]) {
        // TODO add test for this
        warning(false, `A texture cannot be assigned as a '${slot}' to '${parent.type}'`);
      }
    }
  }

  constructor(react3RendererInstance: React3Renderer) {
    super(react3RendererInstance);

    this.hasProp("slot", {
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

            if (parent instanceof THREE.Material) {
              if (process.env.NODE_ENV !== "production") {
                TextureDescriptor.validateParentSlot(parent, slot);
              }

              // remove from previous slot and assign to new slot
              // TODO add test for this
              TextureDescriptor.removeFromSlotOfMaterial(parent, lastSlot, texture);
              TextureDescriptor.addToSlotOfMaterial(parent, slot, texture);
            }
          }
        }
      },
      updateInitial: true,
    });

    this.hasProp("repeat", {
      default: new THREE.Vector2(1, 1),
      type: propTypeInstanceOf(THREE.Vector2),
      updateInitial: true,
      update(threeObject: any, repeat: any) {
        if (repeat) {
          threeObject.repeat.copy(repeat);
        } else {
          threeObject.repeat.set(1, 1);
        }
      },
    });

    this.hasProp("offset", {
      default: new THREE.Vector2(0, 0),
      type: propTypeInstanceOf(THREE.Vector2),
      updateInitial: true,
      update(threeObject: any, offset: any) {
        if (offset) {
          threeObject.offset.copy(offset);
        } else {
          threeObject.offset.set(0, 0);
        }
      },
    });

    [
      "wrapS",
      "wrapT",
    ].forEach((propName) => {
      this.hasProp(propName, {
        default: THREE.ClampToEdgeWrapping,
        type: PropTypes.oneOf([
          THREE.RepeatWrapping,
          THREE.ClampToEdgeWrapping,
          THREE.MirroredRepeatWrapping,
        ]),
        updateInitial: true,
        update(threeObject: any, value: any) {
          threeObject[propName] = value;
          if (threeObject.image) {
            threeObject.needsUpdate = true;
          }
        },
      });
    });

    this.hasProp("anisotropy", {
      default: 1,
      type: PropTypes.number,
      updateInitial: true,
      update(threeObject: any, value: any) {
        threeObject.anisotropy = value;
        if (threeObject.image) {
          threeObject.needsUpdate = true;
        }
      },
    });

    this.hasProp("url", {
      default: "",
      type: PropTypes.string.isRequired,
      update: this.triggerRemount,
    });

    this.hasProp("crossOrigin", {
      default: undefined,
      type: PropTypes.string,
      update: this.triggerRemount,
    });

    [
      "onLoad",
      "onProgress",
      "onError",
    ].forEach((eventName) => {
      this.hasProp(eventName, {
        default: undefined,
        type: PropTypes.func,
        update() {
          // do nothing because these props are only used for initial loading callbacks
        },
      });
    });

    this.hasProp("magFilter", {
      default: THREE.LinearFilter,
      type: PropTypes.oneOf([
        THREE.LinearFilter,
        THREE.NearestFilter,
      ]),
      update(texture: any, magFilter: any) {
        texture.magFilter = magFilter;
        if (texture.image) {
          texture.needsUpdate = true;
        }
      },
    });

    this.hasProp("minFilter", {
      default: THREE.LinearMipMapLinearFilter,
      type: PropTypes.oneOf([
        THREE.LinearMipMapLinearFilter,
        THREE.NearestFilter,
        THREE.NearestMipMapNearestFilter,
        THREE.NearestMipMapLinearFilter,
        THREE.LinearFilter,
        THREE.LinearMipMapNearestFilter,
      ]),
      update(texture: any, minFilter: any) {
        texture.minFilter = minFilter;
        if (texture.image) {
          texture.needsUpdate = true;
        }
      },
    });
  }

  public construct(props: any) {
    let result;

    if (props.hasOwnProperty("url")) {
      const textureLoader = new THREE.TextureLoader();

      if (props.hasOwnProperty("crossOrigin")) {
        textureLoader.crossOrigin = props.crossOrigin;
      }

      let onLoad;
      let onProgress;
      let onError;

      if (props.hasOwnProperty("onLoad")) {
        onLoad = props.onLoad;
      }

      if (props.hasOwnProperty("onProgress")) {
        onProgress = props.onProgress;
      }

      if (props.hasOwnProperty("onError")) {
        onError = props.onError;
      }

      result = textureLoader.load(props.url, onLoad, onProgress, onError);
      if (props.hasOwnProperty("minFilter")) {
        result.minFilter = props.minFilter;
      }
    } else {
      invariant(false, "The texture needs a url property.");
    }

    return result;
  }

  public setParent(texture: any, parent: any) {
    if (parent instanceof THREE.Material) {
      const {_materialSlot: slot} = texture.userData;

      if (process.env.NODE_ENV !== "production") {
        TextureDescriptor.validateParentSlot(parent, slot);
      }

      TextureDescriptor.addToSlotOfMaterial(parent, slot, texture);
    } else if (parent instanceof Uniform) { // Uniform as per the assert above
      parent.setValue(texture);
    } else {
      invariant(false,
        "Parent of a texture is not a material nor a uniform, it needs to be one of them.");
    }

    super.setParent(texture, parent);
  }

  public applyInitialProps(threeObject: any, props: any) {
    threeObject.userData = {
      ...threeObject.userData,
    };

    super.applyInitialProps(threeObject, props);
  }

  public unmount(texture: any) {
    const parent = texture.userData.markup.parentMarkup.threeObject;

    const {_materialSlot: slot} = texture.userData;

    // could either be a resource description or an actual texture
    if (parent instanceof THREE.Material) {
      TextureDescriptor.removeFromSlotOfMaterial(parent, slot, texture);
    } else if (parent instanceof Uniform) {
      if (parent.value === texture) {
        parent.setValue(null);
      }
    }

    texture.dispose();

    super.unmount(texture);
  }

  public highlight(threeObject: any) {
    const parent = threeObject.userData.markup.parentMarkup.threeObject;
    parent.userData._descriptor.highlight(parent);
  }

  public hideHighlight(threeObject: any) {
    const parent = threeObject.userData.markup.parentMarkup.threeObject;
    parent.userData._descriptor.hideHighlight(parent);
  }
}

export default TextureDescriptor;

// module.exports = TextureDescriptor;
