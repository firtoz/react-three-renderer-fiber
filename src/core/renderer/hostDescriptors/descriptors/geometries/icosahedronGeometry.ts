import {IcosahedronBufferGeometry, IcosahedronGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IIcosahedronGeometryProps {
  radius?: number;
  detail?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      icosahedronGeometry: IThreeElementPropsBase<IcosahedronGeometry> & IIcosahedronGeometryProps;
      icosahedronBufferGeometry: IThreeElementPropsBase<IcosahedronBufferGeometry> & IIcosahedronGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IIcosahedronGeometryProps>()(
    IcosahedronGeometry,
    IcosahedronBufferGeometry,
    "radius",
    "detail",
  );

export default geometryDescriptor;
