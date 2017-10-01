import * as THREE from "three";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

class MeshBasicMaterial extends ReactThreeRendererDescriptor<THREE.MeshBasicMaterialParameters,
  THREE.MeshBasicMaterial,
  THREE.Mesh> {

  public createInstance(props: THREE.MeshBasicMaterialParameters) {
    return new THREE.MeshBasicMaterial(props);
  }
}

export default new MeshBasicMaterial();
