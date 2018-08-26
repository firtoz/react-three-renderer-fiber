import {TorusBufferGeometry, TorusGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface ITorusGeometryProps {
  radius?: number;
  tube?: number;
  radialSegments?: number;
  tubularSegments?: number;
  arc?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      torusGeometry: IThreeElementPropsBase<TorusGeometry> & ITorusGeometryProps;
      torusBufferGeometry: IThreeElementPropsBase<TorusBufferGeometry> & ITorusGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<ITorusGeometryProps>()(
    TorusGeometry,
    TorusBufferGeometry,
    "radius",
    "tube",
    "radialSegments",
    "tubularSegments",
    "arc",
  );

export default geometryDescriptor;
