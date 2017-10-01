import * as THREE from "three";
import {Object3DDescriptorBase, Object3DProps} from "./object3d";

interface PerspectiveCameraProps extends Object3DProps {
  fov?: number,
  aspect?: number,
  near?: number,
  far?: number,
}

class PerspectiveCameraDescriptor extends Object3DDescriptorBase<PerspectiveCameraProps,
  THREE.PerspectiveCamera> {
  createInstance(props: PerspectiveCameraProps) {
    const {
      fov,
      aspect,
      near,
      far
    } = props;

    return new THREE.PerspectiveCamera(fov, aspect, near, far);
  }
}

export default new PerspectiveCameraDescriptor();
