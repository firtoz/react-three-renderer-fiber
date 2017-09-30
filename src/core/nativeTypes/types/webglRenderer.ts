import * as THREE from "three";
import {R3RendererNativeElement} from "../common/r3rendererNativeElement";

class WebGLRendererCreator implements R3RendererNativeElement<THREE.WebGLRendererParameters,
  HTMLCanvasElement,
  THREE.WebGLRenderer> {

  createInstance(props: THREE.WebGLRendererParameters, rootContainerInstance: HTMLCanvasElement): THREE.WebGLRenderer {
    return new THREE.WebGLRenderer({
      canvas: rootContainerInstance,
    });
  }

  removedFromParent(parentInstance: HTMLCanvasElement): void {

  }
}

export default new WebGLRendererCreator();
