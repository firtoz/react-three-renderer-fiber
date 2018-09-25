import {PlaneBufferGeometry, PlaneGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IPlaneGeometryProps {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      planeGeometry: IThreeElementPropsBase<PlaneGeometry> & IPlaneGeometryProps;
      planeBufferGeometry: IThreeElementPropsBase<PlaneBufferGeometry> & IPlaneGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IPlaneGeometryProps>()(
    PlaneGeometry,
    PlaneBufferGeometry,
    "width",
    "height",
    "widthSegments",
    "heightSegments",
  );

export default geometryDescriptor;
