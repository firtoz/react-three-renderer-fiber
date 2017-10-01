import * as THREE from "three";
import {SimpleR3RNativeElement} from "../common/SimpleR3RNativeElement";

interface BoxGeometryProps {
  width: number,
  height: number,
  depth: number,
  widthSegments?: number,
  heightSegments?: number,
  depthSegments?: number,
}

class BoxGeometryDescriptor extends SimpleR3RNativeElement<BoxGeometryProps,
  THREE.BoxGeometry,
  THREE.Mesh> {
  createInstance(props: BoxGeometryProps) {
    const {
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments,
    } = props;

    return new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
  }

  removedFromParent(parent: THREE.Mesh): void {
  }

  applyInitialPropUpdates(instance: THREE.BoxGeometry, props: BoxGeometryProps): void {
    // already done by constructor
  }
}

export default new BoxGeometryDescriptor();
