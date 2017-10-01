import * as THREE from "three";
import {IObject3DProps, Object3DDescriptorBase} from "./object3d";

interface IPerspectiveCameraProps extends IObject3DProps {
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

class PerspectiveCameraDescriptor extends Object3DDescriptorBase<IPerspectiveCameraProps,
  THREE.PerspectiveCamera> {
  public createInstance(props: IPerspectiveCameraProps) {
    const {
      fov,
      aspect,
      near,
      far,
    } = props;

    return new THREE.PerspectiveCamera(fov, aspect, near, far);
  }
}

export default new PerspectiveCameraDescriptor();
