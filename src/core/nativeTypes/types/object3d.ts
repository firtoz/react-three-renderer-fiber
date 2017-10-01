import {SimpleR3RNativeElement} from "../common/SimpleR3RNativeElement";
import * as THREE from "three";

export interface Object3DProps {
  name?: string,
  position?: THREE.Vector3,
  rotation?: THREE.Euler,
}

export abstract class Object3DDescriptorBase<TProps extends Object3DProps,
  T extends THREE.Object3D,
  TParent = THREE.Object3D>

  extends SimpleR3RNativeElement<TProps,
    T,
    TParent> {

  removedFromParent(parent: TParent): void {
  }

  applyInitialPropUpdates(instance: T, props: TProps): void {
    const {
      name,
      position,
      rotation,
    } = props;

    if (position != null) {
      instance.position.copy(position);
    }

    if (name != null) {
      instance.name = name;
    }

    if (rotation != null) {
      instance.rotation.copy(rotation);
    }
  }
}

class Object3DDescriptor extends Object3DDescriptorBase<Object3DProps,
  THREE.Object3D> {
  createInstance(props: Object3DProps) {
    return new THREE.Object3D();
  }
}

export default new Object3DDescriptor();
