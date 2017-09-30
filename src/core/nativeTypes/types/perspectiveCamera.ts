import * as THREE from "three";
import {SimpleR3RNativeElement} from "../common/SimpleR3RNativeElement";

interface PerspectiveCameraProps {
  fov?: number,
  aspect?: number,
  near?: number,
  far?: number,
}

class PerspectiveCamera extends SimpleR3RNativeElement<PerspectiveCameraProps,
  THREE.PerspectiveCamera,
  THREE.Object3D> {
  createInstance(props: PerspectiveCameraProps) {
    const {
      fov,
      aspect,
      near,
      far
    } = props;

    return new THREE.PerspectiveCamera(fov, aspect, near, far);
  }

  removedFromParent(parent: THREE.Object3D): void {
  }
}

export default new PerspectiveCamera();
