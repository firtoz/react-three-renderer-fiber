import * as React from "react";
import {Camera, Group, Scene, WebGLRenderer, WebGLRendererParameters} from "three";
import {IHostContext} from "../../renderer/fiberRenderer/createInstance";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";
import r3rContextSymbol from "../../renderer/utils/r3rContextSymbol";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

interface IRenderProps extends WebGLRendererParameters {
  camera: JSX.Element;
  scene: JSX.Element;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      render: IReactThreeRendererElement<RenderAction> & IRenderProps;
    }
  }
}

export class RenderAction implements IHostContext {
  private internalCamera: Camera | null;
  private internalScene: Scene | null;

  private renderer: WebGLRenderer | null;

  private group: Group;

  private wrappedSceneRef: React.Ref<Scene> | null;
  private wrappedCameraRef: React.Ref<Camera> | null;

  private sceneRef: React.Ref<Scene>;
  private cameraRef: React.Ref<Camera>;
  private animationFrameRequest: number;

  constructor() {
    this.group = new Group();
    (this.group as any)[r3rContextSymbol] = this;

    this.renderer = null;

    this.regenerateSceneRef(null);
    this.regenerateCameraRef(null);

    this.animationFrameRequest = 0;

    this.triggerRender();
  }

  public triggerRender() {
    if (this.animationFrameRequest === 0) {
      this.animationFrameRequest = requestAnimationFrame(this.rafCallback);
    }
  }

  public mountedIntoRenderer(renderer: WebGLRenderer) {
    // console.log("mounted");
    this.renderer = renderer;
    // console.log("yep this is my renderer now", renderer);
  }

  public render = () => {
    if (this.renderer == null || this.internalScene == null || this.internalCamera == null) {
      return;
    }

    this.group.updateMatrixWorld(false);

    this.renderer.render(this.internalScene, this.internalCamera);
  }

  public updateProperties(newValue: IRenderProps) {
    const {
      scene,
      camera,
    } = newValue;

    const sceneRefFromELement = (scene as any).ref || null;
    const cameraRefFromElement = (camera as any).ref || null;

    if (this.wrappedSceneRef !== sceneRefFromELement) {
      this.regenerateSceneRef(sceneRefFromELement);
    }
    if (this.wrappedCameraRef !== cameraRefFromElement) {
      this.regenerateCameraRef(cameraRefFromElement);
    }

    const clonedSceneElement = React.cloneElement(scene, {
      key: "scene",
      ref: this.sceneRef,
    });

    const clonedCameraElement = React.cloneElement(camera as any, {
      key: "camera",
      ref: this.cameraRef,
    });

    ReactThreeRenderer.render([clonedSceneElement, clonedCameraElement], this.group, this.render);
  }

  private rafCallback = () => {
    this.render();

    this.animationFrameRequest = 0;
  }

  private regenerateSceneRef(sceneRef: React.Ref<Scene> | null): void {
    this.wrappedSceneRef = sceneRef;

    this.sceneRef = (scene: Scene | null) => {
      if (sceneRef !== null) {
        (sceneRef as any)(scene);
      }

      this.internalScene = scene;
    };
  }

  private regenerateCameraRef(cameraRef: React.Ref<Camera> | null): void {
    this.wrappedCameraRef = cameraRef;

    this.cameraRef = (camera: Camera | null) => {
      if (cameraRef !== null) {
        (cameraRef as any)(camera);
      }

      this.internalCamera = camera;
    };
  }
}

class RenderDescriptor extends ReactThreeRendererDescriptor<IRenderProps, RenderAction, WebGLRenderer, never> {
  constructor() {
    super();

    this.hasPropGroup(["scene", "camera"], (instance: RenderAction, newValue: IRenderProps) => {
      instance.updateProperties(newValue);
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
    // TODO
    instance.mountedIntoRenderer(container);
  }
}

export default new RenderDescriptor();
