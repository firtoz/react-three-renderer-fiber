import {EventEmitter} from "events";
import {PerspectiveCamera} from "three";
import {
  CameraElementProps,
  cameraEventsSymbol,
  ICameraProps,
  cameraEventProjectionMatrixUpdated
} from "../../common/cameraBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase} from "../../common/object3DBase";

export interface IPerspectiveCameraProps extends ICameraProps {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

export type PerspectiveCameraElement =
  CameraElementProps
  & IThreeElementPropsBase<PerspectiveCamera>
  & IPerspectiveCameraProps;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      perspectiveCamera: PerspectiveCameraElement;
    }
  }
}

const defaultCamera = new PerspectiveCamera();

class PerspectiveCameraDescriptor extends Object3DDescriptorBase<IPerspectiveCameraProps,
  PerspectiveCamera> {
  public constructor() {
    super();

    this.hasPropGroup([
      "fov",
      "aspect",
      "near",
      "far",
    ], (instance, newValue: {
      fov: number,
      aspect: number,
      near: number,
      far: number,
    }) => {
      if (newValue.fov !== undefined) {
        instance.fov = newValue.fov;
      }
      if (newValue.aspect !== undefined) {
        instance.aspect = newValue.aspect;
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
    }, false, true).withDefault({
      aspect: defaultCamera.aspect,
      far: defaultCamera.far,
      fov: defaultCamera.fov,
      near: defaultCamera.near,
    });
  }

  public createInstance(props: IPerspectiveCameraProps) {
    const {
      fov,
      aspect,
      near,
      far,
    } = props;

    const camera = new PerspectiveCamera(fov, aspect, near, far);

    camera.userData[cameraEventsSymbol] = new EventEmitter();

    return camera;
  }
}

export default PerspectiveCameraDescriptor;
