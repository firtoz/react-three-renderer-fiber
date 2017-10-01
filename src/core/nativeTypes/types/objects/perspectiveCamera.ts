import {PerspectiveCamera} from "three";
import {IObject3DProps, Object3DDescriptorBase} from "./object3D";

interface IPerspectiveCameraProps extends IObject3DProps {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      perspectiveCamera: IReactThreeRendererElement<PerspectiveCamera> & IPerspectiveCameraProps;
    }
  }
}

class PerspectiveCameraDescriptor extends Object3DDescriptorBase<IPerspectiveCameraProps,
  PerspectiveCamera> {
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
