import {PolyhedronBufferGeometry, PolyhedronGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IPolyhedronGeometryProps {
  vertices: number[];
  indices: number[];
  radius?: number;
  detail?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      polyhedronGeometry: IThreeElementPropsBase<PolyhedronGeometry> & IPolyhedronGeometryProps;
      polyhedronBufferGeometry: IThreeElementPropsBase<PolyhedronBufferGeometry> & IPolyhedronGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IPolyhedronGeometryProps, PolyhedronGeometry, PolyhedronBufferGeometry>(
    (props) => new PolyhedronGeometry(
      props.vertices,
      props.indices,
      props.radius,
      props.detail,
    ),
    (props) => new PolyhedronBufferGeometry(
      props.vertices,
      props.indices,
      props.radius as number,
      props.detail as number,
    ),
    [
      "vertices",
      "indices",
      "radius",
      "detail",
    ],
    PolyhedronGeometry,
    PolyhedronBufferGeometry,
  );

export default geometryDescriptor;
