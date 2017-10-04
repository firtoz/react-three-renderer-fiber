import {Scene, WebGLRenderer, WebGLRendererParameters} from "three";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      webglRenderer: IReactThreeRendererElement<WebGLRenderer> & IWebGLRendererProps;
    }
  }
}

interface IWebGLRendererProps extends WebGLRendererParameters {
  width: number;
  height: number;
}

class WebGLRendererDescriptor extends ReactThreeRendererDescriptor<IWebGLRendererProps,
  WebGLRenderer,
  HTMLCanvasElement,
  Scene> {

  public createInstance(props: IWebGLRendererProps, rootContainerInstance: HTMLCanvasElement): WebGLRenderer {
    let canvas: HTMLCanvasElement | null = null;

    if (rootContainerInstance instanceof HTMLCanvasElement) {
      canvas = rootContainerInstance;
      // return new WebGLRenderer({
      //   canvas: rootContainerInstance,
      // });
    }

    const propsToUse = Object.assign({}, props);

    if (canvas !== null) {
      propsToUse.canvas = canvas;
    }

    return new WebGLRenderer(propsToUse);
  }

  public applyInitialPropUpdates(instance: WebGLRenderer, props: IWebGLRendererProps): void {
    const {
      width,
      height,
      clearAlpha,
      clearColor,
    } = props;

    instance.setSize(width, height);

    if (clearColor !== undefined) {
      if (clearAlpha !== undefined) {
        instance.setClearColor(clearColor, clearAlpha);
      }
    } else if (clearAlpha !== undefined) {
      instance.setClearAlpha(clearAlpha);
    }
  }

  public willBeRemovedFromParent(instance: WebGLRenderer, parent: HTMLCanvasElement): void {
    // TODO
    if (parent instanceof HTMLCanvasElement) {
      /* */
    } else {
      /* */
    }
    // super.removedFromParent(parent);
  }

  public appendInitialChild(instance: WebGLRenderer, child: Scene): void {
    // if (!instance.userData) {
    //   instance.userData = {};
    // }
    //
    // if (child instanceof Scene) {
    //   instance.userData._scene = child;
    // } else {
    //   throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
    // }
    // super.appendInitialChild(instance, child);
  }

  public appendChild(instance: WebGLRenderer, child: Scene): void {
    // if (!instance.userData) {
    //   instance.userData = {};
    // }
    //
    // if (child instanceof Scene) {
    //   instance.userData._scene = child;
    // } else {
    //   throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
    // }
    // super.appendInitialChild(instance, child);
  }

  public appendToContainer(instance: WebGLRenderer, container: HTMLCanvasElement): void {
    if (instance.domElement === container) {
      /* nothing to do here, as it will be passed in via the constructor */
    } else if (container instanceof Element) {
      container.appendChild(instance.domElement);
    } else {
      throw new Error("Trying to mount a <webglRenderer/> into an invalid object");
    }
  }
}

export default new WebGLRendererDescriptor();
