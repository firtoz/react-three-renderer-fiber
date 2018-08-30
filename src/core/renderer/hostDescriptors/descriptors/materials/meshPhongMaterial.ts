import * as THREE from "three";
import {MeshPhongMaterial} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {MaterialDescriptorBase} from "./material";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshPhongMaterial: IThreeElementPropsBase<THREE.MeshPhongMaterial> & THREE.MeshPhongMaterialParameters;
    }
  }
}

class MeshPhongMaterialDescriptor extends MaterialDescriptorBase<THREE.MeshPhongMaterialParameters,
  MeshPhongMaterial> {
  constructor() {
    super();

    this.hasMap();
  }

  public createInstance(props: THREE.MeshPhongMaterialParameters) {
    return new THREE.MeshPhongMaterial(props);
  }
}

export default MeshPhongMaterialDescriptor;
