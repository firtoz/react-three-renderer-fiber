import * as THREE from "three";
import {SimpleR3RNativeElement} from "../common/SimpleR3RNativeElement";

class MeshBasicMaterial extends SimpleR3RNativeElement<THREE.MeshBasicMaterialParameters,
  THREE.MeshBasicMaterial,
  THREE.Mesh> {
  createInstance(props: THREE.MeshBasicMaterialParameters) {
    return new THREE.MeshBasicMaterial(props);
  }

  removedFromParent(parent: THREE.Mesh): void {
  }

  applyInitialPropUpdates(instance: THREE.MeshBasicMaterial, props: THREE.MeshBasicMaterialParameters): void {
    // already done by constructor
  }
}

export default new MeshBasicMaterial();
