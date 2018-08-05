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
  createGeometryAndBufferGeometryDescriptors<ITorusGeometryProps, TorusGeometry, TorusBufferGeometry>(
    (props) => new TorusGeometry(
      props.radius,
      props.tube,
      props.radialSegments,
      props.tubularSegments,
      props.arc,
    ),
    (props) => new TorusBufferGeometry(
      props.radius,
      props.tube,
      props.radialSegments,
      props.tubularSegments,
      props.arc,
    ),
    [
      "radius",
      "tube",
      "radialSegments",
      "tubularSegments",
      "arc",
    ],
    TorusGeometry,
    TorusBufferGeometry,
  );

export default geometryDescriptor;
