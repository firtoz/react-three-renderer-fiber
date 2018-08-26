import {ConeBufferGeometry, ConeGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IConeGeometryProps {
  radius?: number;
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
      coneGeometry: IThreeElementPropsBase<ConeGeometry> & IConeGeometryProps;
      coneBufferGeometry: IThreeElementPropsBase<ConeBufferGeometry> & IConeGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IConeGeometryProps>()(
    ConeGeometry,
    ConeBufferGeometry,
    "radius",
    "height",
    "radialSegments",
    "heightSegments",
    "openEnded",
    "thetaStart",
    "thetaLength",
  );

export default geometryDescriptor;
