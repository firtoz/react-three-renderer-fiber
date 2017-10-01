import * as THREE from "three";
import {IObject3DProps, Object3DDescriptorBase} from "./object3d";

type SceneParents = THREE.Object3D | THREE.WebGLRenderer;

class SceneDescriptor extends Object3DDescriptorBase<IObject3DProps, THREE.Scene, SceneParents> {
  public createInstance(props: IObject3DProps) {
    return new THREE.Scene();
  }
}

export default new SceneDescriptor();
