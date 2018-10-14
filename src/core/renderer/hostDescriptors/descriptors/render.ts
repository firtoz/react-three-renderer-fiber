import * as React from "react";
import {Camera, Group, Scene, WebGLRenderer, WebGLRendererParameters} from "three";
import {CustomReconcilerConfig} from "../../../customRenderer/createReconciler";
import {default as ReactThreeRenderer, IHostContext} from "../../reactThreeRenderer";
import Viewport from "../../utils/viewport";
import {CameraElementProps} from "../common/cameraBase";
import {IThreeElementPropsBase} from "../common/IReactThreeRendererElement";
import {CustomRendererElementInstance} from "../common/object3DBase";
import ReactThreeRendererDescriptor from "../common/ReactThreeRendererDescriptor";
import {IRenderableProp, RefWrapperBase} from "../common/RefWrapper";
import {SceneElementProps} from "./objects/scene";
import {ViewportElementProps} from "./viewport";

export interface IRenderProps extends WebGLRendererParameters {
  camera: IRenderableProp<Camera, CameraElementProps>;
  scene: IRenderableProp<Scene, SceneElementProps>;
  viewport?: IRenderableProp<Viewport, ViewportElementProps>;
  onBeforeRender?: () => void;
  autoRender?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      render: IThreeElementPropsBase<RenderAction> & IRenderProps;
    }
  }
}

export class RenderAction extends RefWrapperBase implements IHostContext {
  private renderer: WebGLRenderer | null;

  private readonly group: Group & CustomRendererElementInstance;

  private animationFrameRequest: number;
  private autoRender: boolean = false;

  private internalScene: Scene | null;
  private internalCamera: Camera | null;
  private internalViewport: Viewport | null;

  private onBeforeRender: (() => void) | null;

  constructor() {
    super([
      "scene",
      "camera",
      "viewport",
    ]);

    // TODO add viewport tests

    this.internalScene = null;
    this.internalCamera = null;
    this.internalViewport = null;

    this.onBeforeRender = null;
    this.autoRender = false;
    this.group = CustomRendererElementInstance.wrapContext(new Group(), this);

    this.renderer = null;

    this.animationFrameRequest = 0;
  }

  public triggerRender() {
    if (this.animationFrameRequest === 0) {
      this.animationFrameRequest = requestAnimationFrame(this.rafCallback);
    }
  }

  public mountedIntoRenderer(renderer: any) {
    if (this.renderer === renderer) {
      return;
    }

    if (!(renderer instanceof WebGLRenderer)) {
      console.error(renderer);
      throw new Error("You are trying to add a <render/> into an object that is not a THREE.JS renderer.");
    }

    this.renderer = renderer;

    // Initial render trigger!
    this.triggerRender();
  }

  public render = () => {
    let sceneToUse: Scene | null = this.internalScene;
    let cameraToUse: Camera | null = this.internalCamera;
    let viewportToUse: Viewport | null = this.internalViewport;

    if (sceneToUse == null) {
      sceneToUse = this.getInstance("scene");
    }

    if (cameraToUse == null) {
      cameraToUse = this.getInstance("camera");
    }

    if (viewportToUse == null) {
      viewportToUse = this.getInstance("viewport");
    }

    if (this.renderer == null ||
      sceneToUse == null ||
      cameraToUse == null) {
      return;
    }

    this.group.updateMatrixWorld(false);

    if (viewportToUse !== null) {
      this.renderer.setViewport(viewportToUse.x, viewportToUse.y, viewportToUse.width, viewportToUse.height);
    } else {
      this.renderer.setViewport(0, 0, this.renderer.getSize().width, this.renderer.getSize().height);
    }

    this.renderer.render(sceneToUse, cameraToUse);
  }

  public updateProps(newValue: IRenderProps) {
    const {
      scene,
      camera,
      viewport,
    } = newValue;

    let sceneElementToRender: React.ReactElement<SceneElementProps> | null = null;
    let cameraElementToRender: React.ReactElement<CameraElementProps> | null = null;
    let viewportElementToRender: React.ReactElement<ViewportElementProps> | null = null;

    this.internalScene = null;

    if (scene != null) {
      if ((scene instanceof Scene)) {
        this.internalScene = scene;
      } else {
        sceneElementToRender = this.wrapElementAndReturn("scene", scene);
      }
    }

    this.internalCamera = null;

    if (camera != null) {
      if ((camera instanceof Camera)) {
        this.internalCamera = camera;
      } else {
        cameraElementToRender = this.wrapElementAndReturn("camera", camera);
      }
    }

    this.internalViewport = null;

    if (viewport != null) {
      if ((viewport instanceof Viewport)) {
        this.internalViewport = viewport;
      } else {
        viewportElementToRender = this.wrapElementAndReturn("viewport", viewport);
      }
    }

    ReactThreeRenderer.render([
      sceneElementToRender,
      cameraElementToRender,
      viewportElementToRender], this.group);
  }

  public setOnBeforeRender(newValue: (() => void) | null) {
    this.onBeforeRender = newValue;
  }

  public setAutoRender(newValue: boolean) {
    this.autoRender = newValue;

    if (newValue) {
      if (this.animationFrameRequest === 0) {
        this.triggerRender();
      }
    }
  }

  private rafCallback = () => {
    if (this.onBeforeRender !== null) {
      this.onBeforeRender();
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

    this.hasPropGroup(["scene", "camera", "viewport"],
      (instance: RenderAction, newValue: IRenderProps) => {
        instance.updateProps(newValue);
      });

    this.hasProp("onBeforeRender",
      (instance: RenderAction, newValue: (() => void) | null) => {
        instance.setOnBeforeRender(newValue);
      });

    this.hasProp("autoRender",
      (instance: RenderAction, newValue: boolean) => {
        instance.setAutoRender(newValue);
      });
  }

  public createInstance(props: IRenderProps, rootContainerInstance: CustomRendererElementInstance): RenderAction {
    const rootContext = rootContainerInstance[CustomReconcilerConfig.contextSymbol];
    const renderAction = new RenderAction();

    if (rootContext.renderActionFound === undefined) {
      console.error(rootContainerInstance);
      throw new Error("No render action receiver for " + rootContainerInstance);
    }

    rootContext.renderActionFound(renderAction);

    return renderAction;
  }

  public willBeAddedToParent(instance: RenderAction, container: WebGLRenderer): void {
    instance.mountedIntoRenderer(container);
  }
}

export default RenderDescriptor;
