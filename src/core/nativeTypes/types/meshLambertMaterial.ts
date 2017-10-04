import * as THREE from "three";
import {Mesh, MeshLambertMaterial} from "three";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLambertMaterial: IReactThreeRendererElement<THREE.MeshLambertMaterial> & THREE.MeshLambertMaterialParameters;
    }
  }
}

class MeshLambertMaterialDescriptor extends ReactThreeRendererDescriptor<THREE.MeshLambertMaterialParameters,
  MeshLambertMaterial,
  Mesh> {

  public createInstance(props: THREE.MeshLambertMaterialParameters) {
    return new THREE.MeshLambertMaterial(props);
  }

  public appendToContainer(instance: MeshLambertMaterial, container: Mesh): void {
    throw new Error("the world is not ready");
  }
}

export default new MeshLambertMaterialDescriptor();
