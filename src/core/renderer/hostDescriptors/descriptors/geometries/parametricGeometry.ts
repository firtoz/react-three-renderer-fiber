import {ParametricBufferGeometry, ParametricGeometry, Vector3} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IParametricGeometryProps {
  func: (u: number, v: number, dest: Vector3) => void;
  slices: number;
  stacks: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      parametricGeometry: IThreeElementPropsBase<ParametricGeometry> & IParametricGeometryProps;
      parametricBufferGeometry: IThreeElementPropsBase<ParametricBufferGeometry> & IParametricGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IParametricGeometryProps>()(
    ParametricGeometry,
    ParametricBufferGeometry,
    "func",
    "slices",
    "stacks",
  );

export default geometryDescriptor;
