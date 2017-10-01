import * as THREE from "three";
import {R3RendererNativeElement} from "../common/r3rendererNativeElement";

interface WebGLRendererProps extends THREE.WebGLRendererParameters {
  width: number;
  height: number;
}

class WebGLRendererDescriptor implements R3RendererNativeElement<WebGLRendererProps,
  HTMLCanvasElement,
  THREE.WebGLRenderer> {

  createInstance(props: WebGLRendererProps, rootContainerInstance: HTMLCanvasElement): THREE.WebGLRenderer {
    return new THREE.WebGLRenderer({
      canvas: rootContainerInstance,
    });
  }

  removedFromParent(parentInstance: HTMLCanvasElement): void {

  }

  applyInitialPropUpdates(instance: THREE.WebGLRenderer, props: WebGLRendererProps): void {
    const {
      width,
      height,
    } = props;

    instance.setSize(width, height);
  }
}

export default new WebGLRendererDescriptor();
