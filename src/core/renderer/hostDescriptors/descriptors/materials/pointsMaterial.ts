import * as THREE from "three";
import {PointsMaterial} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {MaterialDescriptorBase} from "./material";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointsMaterial: IThreeElementPropsBase<THREE.PointsMaterial> & THREE.PointsMaterialParameters;
    }
  }
}

class PointsMaterialDescriptor extends MaterialDescriptorBase<THREE.PointsMaterialParameters,
  PointsMaterial> {

  public createInstance(props: THREE.PointsMaterialParameters) {
    return new THREE.PointsMaterial(props);
  }
}

export default PointsMaterialDescriptor;
