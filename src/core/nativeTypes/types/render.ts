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
import {SceneElement, SceneElementProps} from "./objects/scene";

interface IRenderProps extends WebGLRendererParameters {
  camera: IElement<Camera, CameraElementProps> | Camera | null;
  scene: any | SceneElement | Scene | null;
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

  constructor() {
    super([
      "scene",
      "camera",
    ]);

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
    const internalScene: Scene | null = this.getInstance("scene");
    const internalCamera: Camera | null = this.getInstance("camera");

    if (this.renderer === null ||
      internalScene === null ||
      internalCamera === null) {
      return;
    }

    if (this.renderer === undefined ||
      internalScene === undefined ||
      internalCamera === undefined) {
      return;
    }

    this.group.updateMatrixWorld(false);

    this.renderer.render(internalScene, internalCamera);
  }

  public updateProperties(newValue: IRenderProps) {
    const {
      scene,
      camera,
    } = newValue;

    let sceneElementToRender: React.ReactElement<SceneElementProps> | null = null;
    let cameraElementToRender: React.ReactElement<CameraElementProps> | null = null;

    if (scene !== null && scene !== undefined && !(scene instanceof Scene)) {
      sceneElementToRender = this.wrapElementAndReturn("scene", scene);
    }

    if (camera !== null && camera !== undefined && !(camera instanceof Camera)) {
      cameraElementToRender = this.wrapElementAndReturn("camera", camera);
    }

    ReactThreeRenderer.render([sceneElementToRender, cameraElementToRender], this.group);
  }

  private rafCallback = () => {
    this.render();

    this.animationFrameRequest = 0;
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
    instance.mountedIntoRenderer(container);
  }

  protected addedToParentBefore(instance: RenderAction, parentInstance: WebGLRenderer, before: any): void {
    this.addedToParent(instance, parentInstance);
  }
}

export default new RenderDescriptor();
