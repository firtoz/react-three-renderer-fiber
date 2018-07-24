import {Light, LightShadow} from "three";
import {default as Object3DDescriptorBase, IObject3DProps} from "./object3DBase";

export interface ILightProps extends IObject3DProps {
  color?: number | string;
  intensity?: number;
}

abstract class LightDescriptorBase<TProps extends ILightProps,
  TInstance extends Light, TChild = any>
  extends Object3DDescriptorBase<TProps, TInstance, TChild> {
  protected constructor() {
    super();

    this.hasProp("color", (instance: Light,
                           newValue: any): void => {
      instance.color.set(newValue);
    }, false);

    this.hasSimpleProp("intensity", false);
  }
}

export default LightDescriptorBase;
