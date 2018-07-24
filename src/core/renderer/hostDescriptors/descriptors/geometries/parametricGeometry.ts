import {ParametricGeometry} from "three";
import {Vector3} from "three/three-core";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

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

export class ParametricGeometryWrapper extends GeometryWrapperBase<IParametricGeometryProps, ParametricGeometry> {
  protected constructGeometry(props: IParametricGeometryProps): ParametricGeometry {
    return new ParametricGeometry(props.func, props.slices, props.stacks);
  }
}

class ParametricGeometryDescriptor extends WrappedEntityDescriptor<ParametricGeometryWrapper,
  IParametricGeometryProps,
  ParametricGeometry,
  GeometryContainerType> {
  constructor() {
    super(ParametricGeometryWrapper, ParametricGeometry);

    this.hasRemountProps("func",
      "slices",
      "stacks");
  }
}

export default ParametricGeometryDescriptor;
