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
  createGeometryAndBufferGeometryDescriptors<IOctahedronGeometryProps>()(
    OctahedronGeometry,
    OctahedronBufferGeometry,
    "radius",
    "detail",
  );

export default geometryDescriptor;
