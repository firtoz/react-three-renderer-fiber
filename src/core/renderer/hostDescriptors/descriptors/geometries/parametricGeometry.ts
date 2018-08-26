import {ParametricGeometry, Vector3} from "three";
import {createGeometryDescriptor} from "../../common/createGeometryDescriptor";
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
    }
  }
}

export const geometryDescriptor =
  createGeometryDescriptor<IParametricGeometryProps>()(
    ParametricGeometry,
    "func",
    "slices",
    "stacks",
  );

export default geometryDescriptor;
