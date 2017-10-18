import * as React from "react";
import {Camera, Group, Scene, WebGLRenderer, WebGLRendererParameters} from "three";
import {IHostContext} from "../../renderer/fiberRenderer/createInstance";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";
import r3rContextSymbol from "../../renderer/utils/r3rContextSymbol";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";
import {IElement, RefWrapper} from "../common/RefWrapper";
import {
  CameraElementProps,
} from "./objects/perspectiveCamera";
import {SceneElementProps} from "./objects/scene";

interface IRenderProps extends WebGLRendererParameters {
  camera: IElement<Camera, CameraElementProps> | Camera | null;
  scene: IElement<Scene, SceneElementProps> | Scene | null;
  onAnimationFrame?: () => void;
  autoRender?: boolean;
}

export const wrappedRefSymbol = Symbol("r3r-wrapped-ref");

declare global {
  namespace JSX {
    interface IntrinsicElements {
      render: IThreeElementPropsBase<RenderAction> & IRenderProps;
    }
  }
}

export class RenderAction extends RefWrapper implements IHostContext {
  private renderer: WebGLRenderer | null;

  private group: Group;

  private animationFrameRequest: number;
  private autoRender: boolean = false;

  private internalScene: Scene | null;
  private internalCamera: Camera | null;
  private onAnimationFrame: (() => void) | null;

  constructor() {
    super([
      "scene",
      "camera",
    ]);

    this.internalScene = null;
    this.internalCamera = null;

    this.onAnimationFrame = null;
    this.autoRender = false;

    this.group = new Group();
    (this.group as any)[r3rContextSymbol] = this;

    this.renderer = null;

    this.animationFrameRequest = 0;
  }

  public triggerRender() {
    if (this.animationFrameRequest === 0) {
      this.animationFrameRequest = requestAnimationFrame(this.rafCallback);
    }
  }

  public mountedIntoRenderer(renderer: WebGLRenderer) {
    if (this.renderer === renderer) {
      return;
    }

    if (!(renderer instanceof WebGLRenderer)) {
      console.error(renderer);
      throw new Error("You are trying to add a <render/> into an object that is not a THREEJS renderer.");
    }

    this.renderer = renderer;
  }

  public render = () => {
    let sceneToUse: Scene | null = this.internalScene;
    let cameraToUse: Camera | null = this.internalCamera;

    if (sceneToUse == null) {
      sceneToUse = this.getInstance("scene");
    }

    if (cameraToUse == null) {
      cameraToUse = this.getInstance("camera");
    }

    if (this.renderer == null ||
      sceneToUse == null ||
      cameraToUse == null) {
      return;
    }

    this.group.updateMatrixWorld(false);

    this.renderer.render(sceneToUse, cameraToUse);
  }

  public updateSceneAndCamera(newValue: IRenderProps) {
    const {
      scene,
      camera,
    } = newValue;

    let sceneElementToRender: React.ReactElement<SceneElementProps> | null = null;
    let cameraElementToRender: React.ReactElement<CameraElementProps> | null = null;

    this.internalScene = null;

    if (scene != null) {
      if ((scene instanceof Scene)) {
        this.internalScene = scene;
      } else {
        sceneElementToRender = this.wrapElementAndReturn("scene", scene);
      }
    }

    if (camera != null) {
      if ((camera instanceof Camera)) {
        this.internalCamera = camera;
      } else {
        cameraElementToRender = this.wrapElementAndReturn("camera", camera);
      }
    }

    ReactThreeRenderer.render([sceneElementToRender, cameraElementToRender], this.group);
  }

  public setOnAnimationFrame(newValue: (() => void) | null) {
    this.onAnimationFrame = newValue;
  }

  public setAutoRender(newValue: boolean) {
    this.autoRender = newValue;

    if (newValue === true) {
      if (this.animationFrameRequest === 0) {
        this.triggerRender();
      }
    }
  }

  private rafCallback = () => {
    if (this.onAnimationFrame !== null) {
      this.onAnimationFrame();
    }

    this.render();

    this.animationFrameRequest = 0;

    if (this.autoRender) {
      this.triggerRender();
    }
  }
}

class RenderDescriptor extends ReactThreeRendererDescriptor<IRenderProps, RenderAction, WebGLRenderer, never> {
  constructor() {
    super();

    this.hasPropGroup(["scene", "camera"],
      (instance: RenderAction, newValue: IRenderProps) => {
        instance.updateSceneAndCamera(newValue);
      });

    this.hasProp("onAnimationFrame",
      (instance: RenderAction, newValue: (() => void) | null) => {
        instance.setOnAnimationFrame(newValue);
      });

    this.hasProp("autoRender",
      (instance: RenderAction, newValue: boolean) => {
        instance.setAutoRender(newValue);
      });
  }

  public createInstance(props: IRenderProps, rootContainerInstance: HTMLCanvasElement): RenderAction {
    const rootContext: IHostContext = (rootContainerInstance as any)[r3rContextSymbol];
    const renderAction = new RenderAction();

    if (rootContext.renderActionFound === undefined) {
      console.error(rootContainerInstance);
      throw new Error("No render action receiver for " + rootContainerInstance);
    }

    rootContext.renderActionFound(renderAction);

    return renderAction;
  }

  protected addedToParent(instance: RenderAction, container: WebGLRenderer): void {
    instance.mountedIntoRenderer(container);
  }
}

export default new RenderDescriptor();
