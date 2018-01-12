import {EventEmitter} from "events";
import {Camera, CameraHelper, Object3D, PerspectiveCamera} from "three";
import {cameraEventProjectionMatrixUpdated, cameraEventsSymbol} from "../../common/cameraBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase, IObject3DProps} from "../../common/object3DBase";
import {IElement} from "../../common/RefWrapper";

export type CameraHelperParents = Object3D;

export interface ICameraHelperProps extends IObject3DProps {
  camera: Camera;
}

export type CameraHelperElementProps = IThreeElementPropsBase<CameraHelper> & ICameraHelperProps;

export type CameraHelperElement = IElement<CameraHelper, CameraHelperElementProps>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cameraHelper: CameraHelperElementProps;
    }
  }
}

const defaultCamera = new PerspectiveCamera();

const cameraEventListenerSymbol = Symbol("camera-helper-event-listener");

class CameraHelperDescriptor extends Object3DDescriptorBase<ICameraHelperProps, CameraHelper, CameraHelperParents> {
  constructor() {
    super();

    this.hasProp<Camera>("camera", (instance, newValue) => {
      const cameraHelperUserData = instance.userData as any;

      const cameraEventListener = cameraHelperUserData[cameraEventListenerSymbol];

      if (instance.camera !== defaultCamera) {
        const userData = instance.camera.userData as any;

        const cameraEventEmitter: EventEmitter = userData[cameraEventsSymbol];

        cameraEventEmitter
          .removeListener(cameraEventProjectionMatrixUpdated, cameraEventListener);
      }

      let cameraToUse = newValue;

      if (cameraToUse == null) {
        cameraToUse = defaultCamera;
      } else {
        const userData = newValue.userData as any;

        userData[cameraEventsSymbol]
          .addListener(cameraEventProjectionMatrixUpdated, cameraEventListener);
      }

      instance.camera = cameraToUse;

      instance.matrix = cameraToUse.matrixWorld;

      instance.update();
    }, false);
  }

  public createInstance(props: ICameraHelperProps) {
    let cameraToUse = props.camera;

    if (cameraToUse == null) {
      cameraToUse = defaultCamera;
    }

    const instance = new CameraHelper(cameraToUse);

    const cameraHelperUserData = instance.userData as any;

    cameraHelperUserData[cameraEventListenerSymbol] = () => {
      instance.update();
    };

    if (props.camera != null) {
      const cameraEventEmitter: EventEmitter = props.camera.userData[cameraEventsSymbol];

      cameraEventEmitter
        .addListener(cameraEventProjectionMatrixUpdated, cameraHelperUserData[cameraEventListenerSymbol]);
    }

    return instance;
  }
}

export default CameraHelperDescriptor;
