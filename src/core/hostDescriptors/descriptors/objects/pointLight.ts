import * as THREE from "three";
import {PointLight} from "three";
import {IObject3DProps, Object3DDescriptorBase} from "./object3D";

interface IPointLightProps extends IObject3DProps {
  color?: number | string;
  intensity?: number;
  distance?: number;
  decay?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointLight: IThreeElementPropsBase<PointLight> & IPointLightProps;
    }
  }
}

class PointLightDescriptor extends Object3DDescriptorBase<IPointLightProps,
  PointLight> {

  constructor() {
    super();

    this.hasProp("color", (instance: PointLight,
                           newValue: any): void => {
      instance.color.set(newValue);
    }, false);

    this.hasSimpleProp("intensity", false);
    this.hasSimpleProp("distance", false);
    this.hasSimpleProp("decay", false);
  }

  public createInstance(props: IPointLightProps) {
    return new THREE.PointLight(props.color, props.intensity, props.distance, props.decay);
  }
}

export default new PointLightDescriptor();
