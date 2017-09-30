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

class BoxGeometry extends SimpleR3RNativeElement<BoxGeometryProps,
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
}

export default new BoxGeometry();
