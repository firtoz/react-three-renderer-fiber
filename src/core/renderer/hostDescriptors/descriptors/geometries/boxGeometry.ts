import {BoxGeometry} from "three";
import createGeometryDescriptor from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IBoxGeometryProps {
  width: number;
  height: number;
  depth: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      boxGeometry: IThreeElementPropsBase<BoxGeometry> & IBoxGeometryProps;
    }
  }
}

export const BoxGeometryDescriptor = createGeometryDescriptor<IBoxGeometryProps, BoxGeometry>(
  (props) => new BoxGeometry(props.width,
    props.height,
    props.depth,
    props.widthSegments,
    props.heightSegments,
    props.depthSegments),
  ["width",
    "height",
    "depth",
    "widthSegments",
    "heightSegments",
    "depthSegments"],
  BoxGeometry,
);

export default BoxGeometryDescriptor;
