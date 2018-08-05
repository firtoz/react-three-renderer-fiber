import {OctahedronBufferGeometry, OctahedronGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IOctahedronGeometryProps {
  radius?: number;
  detail?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      octahedronGeometry: IThreeElementPropsBase<OctahedronGeometry> & IOctahedronGeometryProps;
      octahedronBufferGeometry: IThreeElementPropsBase<OctahedronBufferGeometry> & IOctahedronGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IOctahedronGeometryProps, OctahedronGeometry, OctahedronBufferGeometry>(
    (props) => new OctahedronGeometry(
      props.radius,
      props.detail,
    ),
    (props) => new OctahedronBufferGeometry(
      props.radius,
      props.detail,
    ),
    [
      "radius",
      "detail",
    ],
    OctahedronGeometry,
    OctahedronBufferGeometry,
  );

export default geometryDescriptor;
