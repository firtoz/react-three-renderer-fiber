import * as THREE from "three";
import {Mesh, MeshBasicMaterial} from "three";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

class MeshBasicMaterialDescriptor extends ReactThreeRendererDescriptor<THREE.MeshBasicMaterialParameters,
  MeshBasicMaterial,
  Mesh> {

  public createInstance(props: THREE.MeshBasicMaterialParameters) {
    return new THREE.MeshBasicMaterial(props);
  }

  public appendToContainer(instance: MeshBasicMaterial, container: Mesh): void {
    throw new Error("the world is not ready");
  }
}

export default new MeshBasicMaterialDescriptor();
