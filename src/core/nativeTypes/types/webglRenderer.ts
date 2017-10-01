import * as THREE from "three";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

interface WebGLRendererProps extends THREE.WebGLRendererParameters {
  width: number;
  height: number;
}

class WebGLRendererDescriptor extends ReactThreeRendererDescriptor<WebGLRendererProps,
  THREE.WebGLRenderer,
  HTMLCanvasElement,
  THREE.Scene> {

  createInstance(props: WebGLRendererProps, rootContainerInstance: HTMLCanvasElement): THREE.WebGLRenderer {
    return new THREE.WebGLRenderer({
      canvas: rootContainerInstance,
    });
  }

  applyInitialPropUpdates(instance: THREE.WebGLRenderer, props: WebGLRendererProps): void {
    const {
      width,
      height,
    } = props;

    instance.setSize(width, height);
  }

  willBeRemovedFromParent(instance: THREE.WebGLRenderer, parent: HTMLCanvasElement): void {
    console.log('renderer will be removed...');
    // super.removedFromParent(parent);
  }

  appendInitialChild(instance: THREE.WebGLRenderer, child: THREE.Scene): void {
    // if (!instance.userData) {
    //   instance.userData = {};
    // }
    //
    // if (child instanceof THREE.Scene) {
    //   instance.userData._scene = child;
    // } else {
    //   throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
    // }
    // super.appendInitialChild(instance, child);
  }
}

export default new WebGLRendererDescriptor();
