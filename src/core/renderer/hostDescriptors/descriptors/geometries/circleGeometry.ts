import {CircleBufferGeometry, CircleGeometry } from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface ICircleGeometryProps {
  radius?: number;
  segments?: number;
  thetaStart?: number;
  thetaLength?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      circleGeometry: IThreeElementPropsBase<CircleGeometry> & ICircleGeometryProps;
      circleBufferGeometry: IThreeElementPropsBase<CircleBufferGeometry> & ICircleGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<ICircleGeometryProps>()(
    CircleGeometry,
    CircleBufferGeometry,
    "radius",
    "segments",
    "thetaStart",
    "thetaLength",
  );

export default geometryDescriptor;
