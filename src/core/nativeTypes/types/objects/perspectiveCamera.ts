import {Camera, PerspectiveCamera} from "three";
import {IObject3DProps, Object3DDescriptorBase} from "./object3D";

// tslint:disable-next-line no-empty-interface
export interface ICameraProps extends IObject3DProps {

}

interface IPerspectiveCameraProps extends ICameraProps {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

export type CameraElementProps = IReactThreeRendererElement<Camera> & ICameraProps;

export type PerspectiveCameraElement =
  CameraElementProps
  & IReactThreeRendererElement<PerspectiveCamera>
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
    this.hasSimpleProp("aspect", false);
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

export default new PerspectiveCameraDescriptor();
