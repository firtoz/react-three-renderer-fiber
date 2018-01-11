import {Camera, CameraHelper, Object3D, PerspectiveCamera} from "three";
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

class CameraHelperDescriptor extends Object3DDescriptorBase<ICameraHelperProps, CameraHelper, CameraHelperParents> {
  constructor() {
    super();

    this.hasProp<Camera>("camera", (instance, newValue) => {
      if (instance.camera !== defaultCamera) {
        // TODO remove update listener
      }

      let cameraToUse = newValue;

      if (cameraToUse == null) {
        cameraToUse = defaultCamera;
      } else {
        // TODO add update listener
      }

      instance.camera = cameraToUse;
      instance.update();
    }, false);
  }

  public createInstance(props: ICameraHelperProps) {
    let cameraToUse = props.camera;

    if (cameraToUse == null) {
      cameraToUse = defaultCamera;
    } else {
      // TODO add update listener
    }

    return new CameraHelper(cameraToUse);
  }
}

export default CameraHelperDescriptor;
