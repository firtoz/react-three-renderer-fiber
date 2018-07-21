import * as THREE from "three";
import {DirectionalLight, DirectionalLightShadow, Object3D, OrthographicCamera} from "three";
import {IThreeElementPropsBase} from "../../../common/IReactThreeRendererElement";
import {default as LightDescriptorBase, ILightProps} from "../../../common/lightBase";
import {IRenderableProp, PropertyWrapper, RefWrapper, SimplePropertyWrapper} from "../../../common/RefWrapper";
import {IDirectionalLightShadowProps} from "./shadows/directionalLightShadow";

// TODO default target?
export interface IDirectionalLightProps extends ILightProps {
  target?: Object3D;
  shadow?: IRenderableProp<DirectionalLightShadow, IDirectionalLightShadowProps>;
  castShadow?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      directionalLight: IThreeElementPropsBase<DirectionalLight> & IDirectionalLightProps;
    }
  }
}

// TODO castShadow prop
class DirectionalLightDescriptor
  extends LightDescriptorBase<IDirectionalLightProps,
    DirectionalLight,
    DirectionalLightShadow> {
  constructor() {
    super();

    this.hasProp("target", (instance, newValue: Object3D) => {
      throw new Error("Modification of target property for directionalLight is not implemented yet!");
    });

    new RefWrapper(["shadow"], this)
      .wrapProperty(
        new PropertyWrapper("shadow",
          [DirectionalLightShadow],
          (instance, newValue) => {
            console.log("setting shadow?", newValue);
          }), (instance) => {
          return instance;
        },
      );
  }

  public createInstance(props: IDirectionalLightProps) {
    const result = new THREE.DirectionalLight(props.color, props.intensity);

    console.log(props.shadow);

    if (props.shadow instanceof DirectionalLightShadow) {
      result.shadow = props.shadow;
    }

    return result;
  }

  public appendChild(instance: DirectionalLight, child: DirectionalLightShadow): void {
    instance.shadow = child;
  }

  public removeChild(instance: DirectionalLight, child: DirectionalLightShadow): void {
    if (instance.shadow === child) {
      instance.shadow = new DirectionalLightShadow(new OrthographicCamera(
        -5,
        5,
        5,
        -5,
        0.5,
        500,
      ));
    }
  }
}

export default DirectionalLightDescriptor;
