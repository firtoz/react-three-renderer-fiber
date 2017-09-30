import * as THREE from "three";
import {SimpleR3RNativeElement} from "../common/SimpleR3RNativeElement";

type SceneParents = THREE.Object3D | THREE.WebGLRenderer;

class SceneCreator extends SimpleR3RNativeElement<any, THREE.Scene, SceneParents> {
  createInstance(props: THREE.WebGLRendererParameters) {
    return new THREE.Scene();
  }

  removedFromParent(parent: SceneParents): void {
  }
}

export default new SceneCreator();
