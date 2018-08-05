import {BoxBufferGeometry, BoxGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
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
      boxBufferGeometry: IThreeElementPropsBase<BoxBufferGeometry> & IBoxGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IBoxGeometryProps, BoxGeometry, BoxBufferGeometry>(
  (props) => new BoxGeometry(
    props.width,
    props.height,
    props.depth,
    props.widthSegments,
    props.heightSegments,
    props.depthSegments,
  ),
  (props) => new BoxBufferGeometry(
    props.width,
    props.height,
    props.depth,
    props.widthSegments,
    props.heightSegments,
    props.depthSegments,
  ),
  [
    "width",
    "height",
    "depth",
    "widthSegments",
    "heightSegments",
    "depthSegments",
  ],
  BoxGeometry,
  BoxBufferGeometry,
);

export default geometryDescriptor;
