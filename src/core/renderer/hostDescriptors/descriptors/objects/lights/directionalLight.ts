import * as THREE from "three";
import {DirectionalLight, DirectionalLightShadow, Object3D} from "three";
import {IThreeElementPropsBase} from "../../../common/IReactThreeRendererElement";
import {default as LightDescriptorBase, ILightProps} from "../../../common/lightBase";
import {IRenderableProp} from "../../../common/RefWrapper";
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
class DirectionalLightDescriptor extends LightDescriptorBase<IDirectionalLightProps, DirectionalLight> {
  constructor() {
    super();

    this.hasProp("target", (instance, newValue: Object3D) => {
      throw new Error("Modification of target property for directionalLight is not implemented yet!");
    });
  }

  public createInstance(props: IDirectionalLightProps) {
    return new THREE.DirectionalLight(props.color, props.intensity);
  }
}

export default DirectionalLightDescriptor;
