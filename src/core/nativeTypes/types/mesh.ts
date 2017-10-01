import * as THREE from "three";
import {Object3DDescriptorBase, Object3DProps} from "./object3d";

interface MeshProps extends Object3DProps {
  geometry?: THREE.Geometry,
  material?: THREE.Material,
}

class MeshCreator extends Object3DDescriptorBase<MeshProps, THREE.Mesh> {
  createInstance(props: any) {
    return new THREE.Mesh(props.geometry, props.material);
  }
}

export default new MeshCreator();
