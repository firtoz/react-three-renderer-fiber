import * as THREE from "three";
import {LineBasicMaterial} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {MaterialDescriptorBase} from "./material";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      lineBasicMaterial: IThreeElementPropsBase<THREE.LineBasicMaterial> & THREE.LineBasicMaterialParameters;
    }
  }
}

class LineBasicMaterialDescriptor extends MaterialDescriptorBase<THREE.LineBasicMaterialParameters,
  LineBasicMaterial> {

  public createInstance(props: THREE.LineBasicMaterialParameters) {
    return new THREE.LineBasicMaterial(props);
  }
}

export default LineBasicMaterialDescriptor;
