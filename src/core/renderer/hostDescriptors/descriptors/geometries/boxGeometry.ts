import {BoxBufferGeometry, BoxGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IBoxGeometryProps {
  width?: number;
  height?: number;
  depth?: number;
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
  createGeometryAndBufferGeometryDescriptors<IBoxGeometryProps>()(
  BoxGeometry,
  BoxBufferGeometry,
  "width",
  "height",
  "depth",
  "widthSegments",
  "heightSegments",
  "depthSegments",
);

export default geometryDescriptor;
