import * as THREE from "three";
import {SimpleR3RNativeElement} from "../common/SimpleR3RNativeElement";

interface MeshProps {
  geometry?: THREE.Geometry,
  material?: THREE.Material,
}

class MeshCreator extends SimpleR3RNativeElement<MeshProps, THREE.Mesh, THREE.Object3D> {
  createInstance(props: any) {
    return new THREE.Mesh(props.geometry, props.material);
  }

  removedFromParent(parent: THREE.Object3D): void {
  }
}

export default new MeshCreator();
