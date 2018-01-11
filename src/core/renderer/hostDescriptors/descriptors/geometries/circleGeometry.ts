import * as THREE from "three";
import {CircleGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface ICircleGeometryProps {
  radius: number;
  segments?: number;
  thetaStart?: number;
  thetaLength?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      circleGeometry: IThreeElementPropsBase<THREE.CircleGeometry> & ICircleGeometryProps;
    }
  }
}

export class CircleGeometryWrapper extends GeometryWrapperBase<ICircleGeometryProps, CircleGeometry> {
  protected constructGeometry(props: ICircleGeometryProps): CircleGeometry {
    return new CircleGeometry(
      props.radius,
      props.segments,
      props.thetaStart,
      props.thetaLength,
    );
  }
}

class CircleGeometryDescriptor extends WrappedEntityDescriptor<CircleGeometryWrapper,
  ICircleGeometryProps,
  CircleGeometry,
  GeometryContainerType> {
  constructor() {
    super(CircleGeometryWrapper, CircleGeometry);

    this.hasRemountProps(
      "radius",
      "segments",
      "thetaStart",
      "thetaLength",
    );
  }
}

export default CircleGeometryDescriptor;
