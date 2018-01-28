import * as THREE from "three";
import {AmbientLight} from "three";
import {IThreeElementPropsBase} from "../../../common/IReactThreeRendererElement";
import {default as LightDescriptorBase, ILightProps} from "../../../common/lightBase";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: IThreeElementPropsBase<AmbientLight> & ILightProps;
    }
  }
}

class AmbientLightDescriptor extends LightDescriptorBase<ILightProps, AmbientLight> {
  constructor() {
    super();
  }

  public createInstance(props: ILightProps) {
    return new THREE.AmbientLight(props.color, props.intensity);
  }
}

export default AmbientLightDescriptor;
