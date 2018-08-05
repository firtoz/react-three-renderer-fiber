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
  createGeometryAndBufferGeometryDescriptors<IRingGeometryProps, RingGeometry, RingBufferGeometry>(
    (props) => new RingGeometry(
      props.innerRadius,
      props.outerRadius,
      props.thetaSegments,
      props.phiSegments,
      props.thetaStart,
      props.thetaLength,
    ),
    (props) => new RingBufferGeometry(
      props.innerRadius,
      props.outerRadius,
      props.thetaSegments,
      props.phiSegments,
      props.thetaStart,
      props.thetaLength,
    ),
    [
      "innerRadius",
      "outerRadius",
      "thetaSegments",
      "phiSegments",
      "thetaStart",
      "thetaLength",
    ],
    RingGeometry,
    RingBufferGeometry,
  );

export default geometryDescriptor;
