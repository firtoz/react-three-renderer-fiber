import * as THREE from "three";
import {PointLight, PointLightShadow} from "three";
import {default as LightDescriptorBase, ILightProps} from "../../../common/lightBase";
import {IRenderableProp, RefWrapper, SimplePropertyWrapper} from "../../../common/RefWrapper";
import {IPointLightShadowProps} from "./shadows/pointLightShadow";

interface IPointLightProps extends ILightProps {
  distance?: number;
  decay?: number;
  power?: number;
  shadow?: IRenderableProp<PointLightShadow, IPointLightShadowProps>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointLight: IThreeElementPropsBase<PointLight> & IPointLightProps;
    }
  }
}

declare const process: {
  env: {
    NODE_ENV: string,
  };
} | undefined;

class PointLightDescriptor extends LightDescriptorBase<IPointLightProps, PointLight> {
  private refWrapper: RefWrapper;

  constructor() {
    super();

    this.refWrapper = new RefWrapper(["shadow"], this);

    this.refWrapper.wrapProperty(new SimplePropertyWrapper("shadow", PointLightShadow));

    this.hasSimpleProp("distance", false);
    this.hasSimpleProp("decay", false);

    this.removeProp("intensity");
    this.hasPropGroup(["intensity", "power"], this.updateIntensityAndPower);
  }

  public createInstance(props: IPointLightProps) {
    return new THREE.PointLight(props.color, props.intensity, props.distance, props.decay);
  }

  private updateIntensityAndPower = (instance: PointLight, newValue: {
    intensity?: number;
    power?: number;
  }) => {
    if (newValue.power !== undefined && newValue.power !== null) {
      if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
        if (newValue.intensity !== undefined && newValue.intensity !== null) {
          console.warn("A light has both `intensity` and `power` parameters.\n" +
            "This is not allowed, only the `power` parameter will be used.");
        }
      }

      instance.power = newValue.power;
    } else {
      if (newValue.intensity !== undefined && newValue.intensity !== null) {
        instance.intensity = newValue.intensity;
      } else {
        // both null...
        // reset to default?

        instance.intensity = 1;
      }
    }
  }
}

export default PointLightDescriptor;
