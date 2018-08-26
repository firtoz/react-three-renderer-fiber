import * as THREE from "three";
import {MeshDepthMaterial} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {MaterialDescriptorBase} from "./material";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshDepthMaterial: IThreeElementPropsBase<THREE.MeshDepthMaterial> & THREE.MeshDepthMaterialParameters;
    }
  }
}

class MeshDepthMaterialDescriptor extends MaterialDescriptorBase<THREE.MeshDepthMaterialParameters,
  MeshDepthMaterial> {

  public createInstance(props: THREE.MeshDepthMaterialParameters) {
    return new THREE.MeshDepthMaterial(props);
  }
}

export default MeshDepthMaterialDescriptor;
