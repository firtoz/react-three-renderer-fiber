import * as THREE from "three";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

interface BoxGeometryProps {
  width: number,
  height: number,
  depth: number,
  widthSegments?: number,
  heightSegments?: number,
  depthSegments?: number,
}

class BoxGeometryDescriptor extends ReactThreeRendererDescriptor<BoxGeometryProps,
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
}

export default new BoxGeometryDescriptor();
