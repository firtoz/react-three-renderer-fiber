import * as THREE from "three";
import {Mesh, PointLight} from "three";
import {PropertyDescriptorBase} from "../../common/IPropertyDescriptor";
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
      pointLight: IReactThreeRendererElement<PointLight> & IPointLightProps;
    }
  }
}

class PointLightDescriptor extends Object3DDescriptorBase<IPointLightProps,
  PointLight> {

  constructor() {
    super();

    this.hasProp("color", (instance: PointLight,
                           newValue: number | string): void => {
      instance.color.set(newValue as any);
    }, false);
  }

  public createInstance(props: IPointLightProps) {
    return new THREE.PointLight(props.color, props.intensity, props.distance, props.decay);
  }
}

export default new PointLightDescriptor();
