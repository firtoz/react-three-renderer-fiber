import {
  Camera,
  PerspectiveCamera,
  RenderTarget,
  Scene,
  WebGLRenderer,
  WebGLRendererParameters, WebGLShadowMap,
} from "three";

let shadowMapType = WebGLShadowMap;

if (shadowMapType == null) {
// tslint:disable-next-line
  shadowMapType = require("three/src/renderers/webgl/WebGLShadowMap").WebGLShadowMap;
}

import * as THREE from "three";
import ReactThreeRenderer from "../../reactThreeRenderer";
import {IThreeElementPropsBase} from "../common/IReactThreeRendererElement";
import {getWrappedAttributes, WrappedEntityDescriptor, WrapperDetails} from "../common/ObjectWrapper";
import {PropertyWrapper, RefWrapper} from "../common/RefWrapper";
import {WebGLShadowMapWrapper} from "./webGLShadowMap";

function createRendererWithoutLogging(parameters: IWebGLRendererProps): WebGLRenderer {
  const oldLog = window.console.log;

  window.console.log = () => {
    /* no-op on purpose */
  };

  const renderer = new WebGLRenderer(parameters);

  renderer.autoClear = parameters.autoClear !== false;

  if (renderer.getContext().isContextLost()) {
    throw new Error("WebGL context is lost already...");
  }

  window.console.log = oldLog;

  return renderer;
}

export class RendererWrapperDetails extends WrapperDetails<IWebGLRendererProps, WebGLRenderer> {
  private containerIsCanvas: boolean;

  public willBeAddedToParent(instance: WebGLRenderer, parent: Node): boolean {
    if ((this.wrappedObject != null)) {
      throw new Error("Something really funky is going on here");
    }

    const propsToUse: IWebGLRendererProps = Object.assign({}, this.props);

    if (parent instanceof HTMLCanvasElement) {
      this.containerIsCanvas = true;

      propsToUse.canvas = parent;
    }

    const webglRenderer = createRendererWithoutLogging(propsToUse);

    if (!this.containerIsCanvas) {
      parent.appendChild(webglRenderer.domElement);
    }

    this.wrapObject(webglRenderer);

    return true;
  }

  public willBeAddedToParentBefore(instance: WebGLRenderer, parent: Node, before: any): boolean {
    if (this.wrappedObject !== null || this.wrappedObject !== undefined) {
      throw new Error("Something really funky is going on here");
    }

    const propsToUse: IWebGLRendererProps = Object.assign({}, this.props);

    if (parent instanceof HTMLCanvasElement) {
      this.containerIsCanvas = true;

      propsToUse.canvas = parent;
    }

    const webglRenderer = createRendererWithoutLogging(propsToUse);

    if (!this.containerIsCanvas) {
      parent.insertBefore(webglRenderer.domElement, before);
    }

    this.wrapObject(webglRenderer);

    return true;
  }

  public willBeRemovedFromParent(instance: WebGLRenderer, container: any): void {
    const actualRenderer = this.wrappedObject;

    if (actualRenderer !== null) {

      actualRenderer.dispose();

      if (!this.containerIsCanvas && actualRenderer.domElement.parentNode !== null) {
        const contextLossExtension = actualRenderer.extensions.get("WEBGL_lose_context");

        if (contextLossExtension !== undefined) {
          contextLossExtension.loseContext();
        }

        actualRenderer.domElement.parentNode.removeChild(actualRenderer.domElement);
      }
    }
  }

  public wrapObject(rendererInstance: WebGLRenderer) {
    super.wrapObject(rendererInstance);

    const property = Object.getOwnPropertyDescriptor(rendererInstance, "render");

    if (property === undefined) {
      return;
    }

    const renderFunction = (scene: Scene, camera: Camera, renderTarget?: RenderTarget, forceClear?: boolean) => {
      const oldWarn = window.console.warn;

      // get rid of useless message but warn about everything else
      window.console.warn = (...args: string[]) => {
        if (args[0] === "THREE.WebGLShader: gl.getShaderInfoLog()") {
          return;
        }

        oldWarn.call(window.console, ...args);
      };

      rendererInstance.render(scene, camera, renderTarget, forceClear);

      window.console.warn = oldWarn;

      // redefine to wrap
      Object.defineProperty(this.wrapper, "render", getWrappedAttributes(property, rendererInstance, "render"));
    };

    (renderFunction as any).displayName = "render";

    // if (propertyName === "render" && typeof window !== "undefined" && typeof window.console !== "undefined") {
    Object.defineProperty(this.wrapper, "render", {
      configurable: property.configurable,
      enumerable: property.enumerable,
      value: renderFunction,
    });
  }

  protected recreateInstance(newProps: IWebGLRendererProps): WebGLRenderer {
    const lastRenderer = this.wrappedObject;

    if (lastRenderer !== null) {
      const contextLossExtension = lastRenderer.extensions.get("WEBGL_lose_context");

      if (contextLossExtension) {
        // noinspection JSUnresolvedFunction
        contextLossExtension.loseContext();
      }

      lastRenderer.dispose();

      const propsToUse = Object.assign({}, newProps);

      if (this.containerIsCanvas) {
        propsToUse.canvas = lastRenderer.domElement;
      }

      const newRenderer = createRendererWithoutLogging(propsToUse);

      if (!this.containerIsCanvas) {
        const parentNode: Node | null = lastRenderer.domElement.parentNode;
        if (parentNode !== null) {
          parentNode.removeChild(lastRenderer.domElement);
          parentNode.appendChild(newRenderer.domElement);
        }
      }

      // otherwise we don't need to do anything, a new context should have been created

      return newRenderer;
    }

    // it's not even mounted yet...
    throw new Error("props were modified before webGLRenderer could be mounted...\n" +
      "How did this happen?\n" +
      "Please create an issue with details!");
  }
}

export interface IWebGLRendererProps extends WebGLRendererParameters {
  width: number;
  height: number;

  autoClear?: boolean;
  gammaInput?: boolean;
  gammaOutput?: boolean;
}

export type WebGLRendererElementProps = IThreeElementPropsBase<WebGLRenderer> & IWebGLRendererProps;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      webGLRenderer: WebGLRendererElementProps;
    }
  }
}

class WebGLRendererDescriptor extends WrappedEntityDescriptor<RendererWrapperDetails,
  IWebGLRendererProps,
  any,
  HTMLCanvasElement,
  Scene> {
  constructor() {
    super(RendererWrapperDetails, WebGLRenderer, true);

    new RefWrapper(["shadowMap"], this)
      .wrapProperty(new PropertyWrapper<any, any>("shadowMap", [shadowMapType],
        (instance: WebGLRenderer, newValue: WebGLShadowMap) => {
          instance.shadowMap.enabled = newValue.enabled;
          instance.shadowMap.autoUpdate = newValue.autoUpdate;
          instance.shadowMap.needsUpdate = newValue.needsUpdate;
          instance.shadowMap.type = newValue.type;
        }).OnRender((instance, wrapper: WebGLShadowMapWrapper) => {
        // sorted out by parent setting?
      }));

    this.hasPropGroup(["width", "height"], (instance: WebGLRenderer,
                                            newSize: {
                                              width?: number,
                                              height?: number,
                                            }) => {
      const updatedSize: { width: number, height: number } = Object.assign({}, instance.getSize(), newSize);

      instance.setSize(updatedSize.width, updatedSize.height);
    });

    this.hasRemountProps("antialias", "alpha");

    this.hasProp("devicePixelRatio", (instance: WebGLRenderer,
                                      newValue: number): void => {
      instance.setPixelRatio(newValue);
    });

    this.hasPropGroup(["clearColor", "clearAlpha"], (instance: WebGLRenderer,
                                                     newColors: {
                                                       clearColor?: number,
                                                       clearAlpha?: number,
                                                     }) => {
      if (newColors.clearColor !== undefined) {
        if (newColors.clearAlpha !== undefined) {
          instance.setClearColor(newColors.clearColor, newColors.clearAlpha);
        } else {
          instance.setClearColor(newColors.clearColor, instance.getClearAlpha());
        }
      } else if (newColors.clearAlpha !== undefined) {
        instance.setClearAlpha(newColors.clearAlpha);
      }
    });

    this.hasProp("camera", (instance: WebGLRenderer, cameraElement: any) => {
      // console.log(cameraElement);
      const cameraContainer = new THREE.Object3D();
      let camera: PerspectiveCamera;

      ReactThreeRenderer.render(cameraElement, cameraContainer, function(this: PerspectiveCamera) {
        camera = this;
      });
    });

    this.hasSimpleProp("autoClear", false, false)
      .withDefault(true);

    this.hasSimpleProp("gammaInput", true, true)
      .withDefault(false);

    this.hasSimpleProp("gammaOutput", true, true)
      .withDefault(false);
  }
}

export default WebGLRendererDescriptor;
