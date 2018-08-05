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
  createGeometryAndBufferGeometryDescriptors<ICylinderGeometryProps>()(
    CylinderGeometry,
    CylinderBufferGeometry,
    "radiusTop",
    "radiusBottom",
    "height",
    "radialSegments",
    "heightSegments",
    "openEnded",
    "thetaStart",
    "thetaLength",
  );

export default geometryDescriptor;
