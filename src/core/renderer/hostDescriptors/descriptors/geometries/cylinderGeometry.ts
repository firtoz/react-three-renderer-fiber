import {CylinderBufferGeometry, CylinderGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface ICylinderGeometryProps {
  radiusTop?: number;
  radiusBottom?: number;
  height?: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded?: boolean;
  thetaStart?: number;
  thetaLength?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cylinderGeometry: IThreeElementPropsBase<CylinderGeometry> & ICylinderGeometryProps;
      cylinderBufferGeometry: IThreeElementPropsBase<CylinderBufferGeometry> & ICylinderGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<ICylinderGeometryProps, CylinderGeometry, CylinderBufferGeometry>(
    (props) => new CylinderGeometry(
      props.radiusTop,
      props.radiusBottom,
      props.height,
      props.radialSegments,
      props.heightSegments,
      props.openEnded,
      props.thetaStart,
      props.thetaLength,
    ),
    (props) => new CylinderBufferGeometry(
      props.radiusTop,
      props.radiusBottom,
      props.height,
      props.radialSegments,
      props.heightSegments,
      props.openEnded,
      props.thetaStart,
      props.thetaLength,
    ),
    [
      "radiusTop",
      "radiusBottom",
      "height",
      "radialSegments",
      "heightSegments",
      "openEnded",
      "thetaStart",
      "thetaLength",
    ],
    CylinderGeometry,
    CylinderBufferGeometry,
  );

export default geometryDescriptor;
