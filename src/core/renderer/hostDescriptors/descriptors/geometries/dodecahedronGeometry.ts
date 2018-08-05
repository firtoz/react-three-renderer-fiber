import {DodecahedronBufferGeometry, DodecahedronGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IDodecahedronGeometryProps {
  radius?: number;
  detail?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      dodecahedronGeometry: IThreeElementPropsBase<DodecahedronGeometry> & IDodecahedronGeometryProps;
      dodecahedronBufferGeometry: IThreeElementPropsBase<DodecahedronBufferGeometry> & IDodecahedronGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IDodecahedronGeometryProps, DodecahedronGeometry,
    DodecahedronBufferGeometry>(
    (props) => new DodecahedronGeometry(
      props.radius,
      props.detail,
    ),
    (props) => new DodecahedronBufferGeometry(
      props.radius,
      props.detail,
    ),
    [
      "radius",
      "detail",
    ],
    DodecahedronGeometry,
    DodecahedronBufferGeometry,
  );

export default geometryDescriptor;
