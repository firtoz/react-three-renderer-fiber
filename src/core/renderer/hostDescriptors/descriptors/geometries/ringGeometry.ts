import {RingBufferGeometry, RingGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IRingGeometryProps {
  innerRadius?: number;
  outerRadius?: number;
  thetaSegments?: number;
  phiSegments?: number;
  thetaStart?: number;
  thetaLength?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ringGeometry: IThreeElementPropsBase<RingGeometry> & IRingGeometryProps;
      ringBufferGeometry: IThreeElementPropsBase<RingBufferGeometry> & IRingGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IRingGeometryProps>()(
    RingGeometry,
    RingBufferGeometry,
    "innerRadius",
    "outerRadius",
    "thetaSegments",
    "phiSegments",
    "thetaStart",
    "thetaLength",
  );

export default geometryDescriptor;
