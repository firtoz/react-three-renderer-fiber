import {SphereBufferGeometry, SphereGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface ISphereGeometryProps {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  phiStart?: number;
  phiLength?: number;
  thetaStart?: number;
  thetaLength?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sphereGeometry: IThreeElementPropsBase<SphereGeometry> & ISphereGeometryProps;
      sphereBufferGeometry: IThreeElementPropsBase<SphereBufferGeometry> & ISphereGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<ISphereGeometryProps, SphereGeometry, SphereBufferGeometry>(
    (props) => new SphereGeometry(
      props.radius as number,
      props.widthSegments,
      props.heightSegments,
      props.phiStart,
      props.phiLength,
      props.thetaStart,
      props.thetaLength,
    ),
    (props) => new SphereBufferGeometry(
      props.radius as number,
      props.widthSegments,
      props.heightSegments,
      props.phiStart,
      props.phiLength,
      props.thetaStart,
      props.thetaLength,
    ),
    [
      "radius",
      "widthSegments",
      "heightSegments",
      "phiStart",
      "phiLength",
      "thetaStart",
      "thetaLength",
    ],
    SphereGeometry,
    SphereBufferGeometry,
  );

export default geometryDescriptor;
