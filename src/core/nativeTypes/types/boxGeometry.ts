import {BoxGeometry, Mesh} from "three";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

interface IBoxGeometryProps {
  width: number;
  height: number;
  depth: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
}

class BoxGeometryDescriptor extends ReactThreeRendererDescriptor<IBoxGeometryProps,
  BoxGeometry,
  Mesh> {
  public createInstance(props: IBoxGeometryProps) {
    const {
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments,
    } = props;

    return new BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
  }

  public appendToContainer(instance: BoxGeometry, container: Mesh): void {
    throw new Error("the world is not ready");
  }
}

export default new BoxGeometryDescriptor();
