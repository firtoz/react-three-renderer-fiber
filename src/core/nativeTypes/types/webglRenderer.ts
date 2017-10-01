import * as THREE from "three";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

interface IWebGLRendererProps extends THREE.WebGLRendererParameters {
  width: number;
  height: number;
}

class WebGLRendererDescriptor extends ReactThreeRendererDescriptor<IWebGLRendererProps,
  THREE.WebGLRenderer,
  HTMLCanvasElement,
  THREE.Scene> {

  public createInstance(props: IWebGLRendererProps, rootContainerInstance: HTMLCanvasElement): THREE.WebGLRenderer {
    return new THREE.WebGLRenderer({
      canvas: rootContainerInstance,
    });
  }

  public applyInitialPropUpdates(instance: THREE.WebGLRenderer, props: IWebGLRendererProps): void {
    const {
      width,
      height,
    } = props;

    instance.setSize(width, height);
  }

  public willBeRemovedFromParent(instance: THREE.WebGLRenderer, parent: HTMLCanvasElement): void {
    console.log("renderer will be removed...");
    // super.removedFromParent(parent);
  }

  public appendInitialChild(instance: THREE.WebGLRenderer, child: THREE.Scene): void {
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
