import {PerspectiveCamera} from "three";
import {CameraElementProps, ICameraProps} from "../../common/cameraBase";
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

    // TODO emit update event for properties to be used by camera helpers

    this.hasSimpleProp("fov", false).withDefault(defaultCamera.fov);
    this.hasProp("aspect", (instance: PerspectiveCamera, newValue: number) => {
      instance.aspect = newValue;
      instance.updateProjectionMatrix();
    }).withDefault(defaultCamera.aspect);
    this.hasSimpleProp("near", false).withDefault(defaultCamera.near);
    this.hasSimpleProp("far", false).withDefault(defaultCamera.far);
  }

  public createInstance(props: IPerspectiveCameraProps) {
    const {
      fov,
      aspect,
      near,
      far,
    } = props;

    return new PerspectiveCamera(fov, aspect, near, far);
  }
}

export default PerspectiveCameraDescriptor;
