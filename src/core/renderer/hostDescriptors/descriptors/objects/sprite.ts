import {
  Sprite,
  SpriteMaterial,
  SpriteMaterialParameters,
} from "three";

import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase, IObject3DProps} from "../../common/object3DBase";
import {IRenderableProp, RefWrapper, SimplePropertyWrapper} from "../../common/RefWrapper";

export interface ISpriteProps extends IObject3DProps {
  material?: IRenderableProp<SpriteMaterial, SpriteMaterialParameters>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sprite: IThreeElementPropsBase<Sprite> & ISpriteProps;
    }
  }
}

export type SpriteChildType = SpriteMaterial;

class LineDescriptor extends Object3DDescriptorBase<ISpriteProps, Sprite, SpriteChildType> {
  constructor() {
    super();

    new RefWrapper(["material"], this)
      .wrapProperties([
          new SimplePropertyWrapper("material", [
            SpriteMaterial,
          ]),
        ],
      );
  }

  public createInstance(props: ISpriteProps) {
    let material: any;

    if (props.material instanceof SpriteMaterial) {
      material = props.material;
    }

    return new Sprite(material);
  }

  public appendInitialChild(instance: Sprite, child: SpriteChildType): void {
    if (child instanceof SpriteMaterial) {
      instance.material = child;
    } else {
      super.appendInitialChild(instance, child);
    }
  }

  public appendChild(instance: Sprite, child: SpriteChildType): void {
    if (child instanceof SpriteMaterial) {
      instance.material = child;
    } else {
      super.appendChild(instance, child);
    }
  }

  public insertBefore(instance: Sprite, child: SpriteChildType, before: any): void {
    if (child instanceof SpriteMaterial) {
      instance.material = child;
    } else {
      super.insertBefore(instance, child, before);
    }
  }

  public removeChild(instance: Sprite, child: SpriteChildType): void {
    if (child instanceof SpriteMaterial) {
      instance.material = null as any;
    } else {
      super.removeChild(instance, child);
      // throw new Error('cannot remove ' + (child as any)[r3rFiberSymbol].type + ' as a childInstance from mesh');
    }
  }
}

export default LineDescriptor;
