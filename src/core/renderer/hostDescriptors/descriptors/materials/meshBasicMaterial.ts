import * as THREE from "three";
import {MeshBasicMaterial} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {MaterialDescriptorBase} from "./material";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshBasicMaterial: IThreeElementPropsBase<THREE.MeshBasicMaterial> & THREE.MeshBasicMaterialParameters;
    }
  }
}

class MeshBasicMaterialDescriptor extends MaterialDescriptorBase<THREE.MeshBasicMaterialParameters,
  MeshBasicMaterial> {

  public createInstance(props: THREE.MeshBasicMaterialParameters) {
    return new THREE.MeshBasicMaterial(props);
  }
}

export default MeshBasicMaterialDescriptor;
