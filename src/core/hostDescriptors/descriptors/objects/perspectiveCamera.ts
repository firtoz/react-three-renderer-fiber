import {PerspectiveCamera} from "three";
import {CameraElementProps, ICameraProps} from "../../common/cameraBase";
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

class PerspectiveCameraDescriptor extends Object3DDescriptorBase<IPerspectiveCameraProps,
  PerspectiveCamera> {

  public constructor() {
    super();

    this.hasSimpleProp("fov", false);
    this.hasProp("aspect", (instance: PerspectiveCamera, newValue: number) => {
      instance.aspect = newValue;
      instance.updateProjectionMatrix();
    });
    this.hasSimpleProp("near", false);
    this.hasSimpleProp("far", false);
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
