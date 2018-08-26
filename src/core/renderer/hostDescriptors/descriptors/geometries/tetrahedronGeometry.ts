import {TetrahedronBufferGeometry, TetrahedronGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface ITetrahedronGeometryProps {
  radius?: number;
  detail?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      tetrahedronGeometry: IThreeElementPropsBase<TetrahedronGeometry> & ITetrahedronGeometryProps;
      tetrahedronBufferGeometry: IThreeElementPropsBase<TetrahedronBufferGeometry> & ITetrahedronGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<ITetrahedronGeometryProps>()(
    TetrahedronGeometry,
    TetrahedronBufferGeometry,
    "radius",
    "detail",
  );

export default geometryDescriptor;
