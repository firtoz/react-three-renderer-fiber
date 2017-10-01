import * as THREE from "three";
import {Object3DDescriptorBase, Object3DProps} from "./object3d";

type SceneParents = THREE.Object3D | THREE.WebGLRenderer;

class SceneDescriptor extends Object3DDescriptorBase<Object3DProps, THREE.Scene, SceneParents> {
  createInstance(props: Object3DProps) {
    return new THREE.Scene();
  }
}

export default new SceneDescriptor();
