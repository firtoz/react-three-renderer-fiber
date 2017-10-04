import * as THREE from "three";
import {Mesh, PointLight} from "three";
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

  public createInstance(props: IPointLightProps) {
    return new THREE.PointLight(props.color, props.intensity, props.distance, props.decay);
  }

  public appendToContainer(instance: PointLight, container: Mesh): void {
    throw new Error("the world is not ready");
  }
}

export default new PointLightDescriptor();
