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
  createGeometryAndBufferGeometryDescriptors<IPolyhedronGeometryProps>()(
    PolyhedronGeometry,
    PolyhedronBufferGeometry,
    "vertices",
    "indices",
    "radius",
    "detail",
  );

export default geometryDescriptor;
