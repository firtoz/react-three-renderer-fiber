import * as THREE from "three";
import {PointLight} from "three";
import LightDescriptorBase, {ILightProps} from "../../common/lightBase";

interface IPointLightProps extends ILightProps {
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

class PointLightDescriptor extends LightDescriptorBase<IPointLightProps, PointLight> {
  constructor() {
    super();

    this.hasSimpleProp("distance", false);
    this.hasSimpleProp("decay", false);
  }

  public createInstance(props: IPointLightProps) {
    return new THREE.PointLight(props.color, props.intensity, props.distance, props.decay);
  }
}

export default PointLightDescriptor;
