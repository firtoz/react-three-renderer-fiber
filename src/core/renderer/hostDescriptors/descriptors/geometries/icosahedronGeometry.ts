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
  createGeometryAndBufferGeometryDescriptors<IIcosahedronGeometryProps, IcosahedronGeometry, IcosahedronBufferGeometry>(
    (props) => new IcosahedronGeometry(
      props.radius,
      props.detail,
    ),
    (props) => new IcosahedronBufferGeometry(
      props.radius,
      props.detail,
    ),
    [
      "radius",
      "detail",
    ],
    IcosahedronGeometry,
    IcosahedronBufferGeometry,
  );

export default geometryDescriptor;
