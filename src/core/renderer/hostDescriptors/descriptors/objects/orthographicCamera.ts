import {EventEmitter} from "events";
import {DirectionalLightShadow, Object3D, OrthographicCamera, Scene, WebGLRenderer} from "three";
import {
  CameraElementProps, cameraEventProjectionMatrixUpdated, cameraEventsSymbol,
  ICameraProps,
} from "../../common/cameraBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase} from "../../common/object3DBase";
import {SceneParents} from "./scene";
import {defaultDirectionalLightCamera} from "./lights/shadows/directionalLightShadow";

export interface IOrthographicCameraProps extends ICameraProps {
  zoom?: number;

  left: number;
  right: number;
  top: number;
  bottom: number;

  near?: number;
  far?: number;
}

export type OrthographicCameraElement =
  CameraElementProps
  & IThreeElementPropsBase<OrthographicCamera>
  & IOrthographicCameraProps;

export type OrthographicCameraParents = Object3D | DirectionalLightShadow;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orthographicCamera: OrthographicCameraElement;
    }
  }
}

const defaultCamera = new OrthographicCamera(0, 0, 0, 0);

class OrthographicCameraDescriptor extends Object3DDescriptorBase<IOrthographicCameraProps,
  OrthographicCamera> {
  public constructor() {
    super();

    this.hasPropGroup([
      "zoom",
      "left",
      "right",
      "top",
      "bottom",
      "near",
      "far",
    ], (instance, newValue: {
      zoom: number,
      left: number,
      right: number,
      top: number,
      bottom: number,
      near: number,
      far: number,
    }) => {
      if (newValue.zoom !== undefined) {
        instance.zoom = newValue.zoom;
      }
      if (newValue.left !== undefined) {
        instance.left = newValue.left;
      }
      if (newValue.right !== undefined) {
        instance.right = newValue.right;
      }
      if (newValue.top !== undefined) {
        instance.top = newValue.top;
      }
      if (newValue.bottom !== undefined) {
        instance.bottom = newValue.bottom;
      }
      if (newValue.near !== undefined) {
        instance.near = newValue.near;
      }
      if (newValue.far !== undefined) {
        instance.far = newValue.far;
      }

      instance.updateProjectionMatrix();

      const cameraEvents: EventEmitter = instance.userData[cameraEventsSymbol];

      cameraEvents.emit(cameraEventProjectionMatrixUpdated);

      // TODO this needs to be reflected within the shadow too...
    }, false, true).withDefault({
      bottom: defaultCamera.bottom,
      far: defaultCamera.far,
      left: defaultCamera.left,
      near: defaultCamera.near,
      right: defaultCamera.right,
      top: defaultCamera.top,
      zoom: defaultCamera.zoom,
    });
  }

  public createInstance(props: IOrthographicCameraProps) {
    const {
      left,
      right,
      top,
      bottom,
      near,
      far,
    } = props;

    console.log("new camera!");

    const camera = new OrthographicCamera(left, right, top, bottom, near, far);

    camera.userData[cameraEventsSymbol] = new EventEmitter();

    return camera;
  }

  public willBeAddedToParent(instance: OrthographicCamera, parentInstance: OrthographicCameraParents): void {
    if (parentInstance instanceof DirectionalLightShadow) {
      // TODO check if we can assign camera, this will help with the properties
      parentInstance.camera.copy(instance);
      console.log("camera being added to parent!");
      // no-op
    } else {
      super.willBeAddedToParent(instance, parentInstance);
    }
  }

  public willBeRemovedFromParent(instance: OrthographicCamera, parentInstance: OrthographicCameraParents): void {
    if (parentInstance instanceof DirectionalLightShadow) {
      parentInstance.camera.copy(defaultDirectionalLightCamera);
      console.log("camera being removed from parent!");
      // no-op
    } else {
      super.willBeRemovedFromParent(instance, parentInstance);
    }
  }
}

export default OrthographicCameraDescriptor;
