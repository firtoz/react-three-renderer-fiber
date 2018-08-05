import {Curve, TubeBufferGeometry, TubeGeometry, Vector3} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface ITubeGeometryProps {
  path: Curve<Vector3>;
  tubularSegments?: number;
  radius?: number;
  radiusSegments?: number;
  closed?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      tubeGeometry: IThreeElementPropsBase<TubeGeometry> & ITubeGeometryProps;
      tubeBufferGeometry: IThreeElementPropsBase<TubeBufferGeometry> & ITubeGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<ITubeGeometryProps>()(
    TubeGeometry,
    TubeBufferGeometry,
    "path",
    "tubularSegments",
    "radius",
    "radiusSegments",
    "closed",
  );

export default geometryDescriptor;
