import * as THREE from "three";
import {LatheGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface ILatheGeometryProps {
  points: THREE.Vector2[];
  segments?: number;
  phiStart?: number;
  phiLength?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      latheGeometry: IThreeElementPropsBase<THREE.LatheGeometry> & ILatheGeometryProps;
    }
  }
}

export class LatheGeometryWrapper extends GeometryWrapperBase<ILatheGeometryProps, LatheGeometry> {
  protected constructGeometry(props: ILatheGeometryProps): LatheGeometry {
    return new LatheGeometry(
      props.points as any,
      props.segments,
      props.phiStart,
      props.phiLength,
    );
  }
}

class LatheGeometryDescriptor extends WrappedEntityDescriptor<LatheGeometryWrapper,
  ILatheGeometryProps,
  LatheGeometry,
  GeometryContainerType> {
  constructor() {
    super(LatheGeometryWrapper, LatheGeometry);

    this.hasRemountProps(
      "points",
      "segments",
      "phiStart",
      "phiLength",
    );
  }
}

export default LatheGeometryDescriptor;
