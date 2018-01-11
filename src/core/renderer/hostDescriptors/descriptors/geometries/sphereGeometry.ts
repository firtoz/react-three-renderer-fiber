import * as THREE from "three";
import {SphereGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface ISphereGeometryProps {
  radius: number;
  widthSegments?: number;
  heightSegments?: number;
  phiStart?: number;
  phiLength?: number;
  thetaStart?: number;
  thetaLength?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sphereGeometry: IThreeElementPropsBase<THREE.SphereGeometry> & ISphereGeometryProps;
    }
  }
}

export class SphereGeometryWrapper extends GeometryWrapperBase<ISphereGeometryProps, SphereGeometry> {
  protected constructGeometry(props: ISphereGeometryProps): SphereGeometry {
    return new SphereGeometry(props.radius,
      props.widthSegments,
      props.heightSegments,
      props.phiStart,
      props.phiLength,
      props.thetaStart,
      props.thetaLength,
    );
  }
}

class SphereGeometryDescriptor extends WrappedEntityDescriptor<SphereGeometryWrapper,
  ISphereGeometryProps,
  SphereGeometry,
  GeometryContainerType> {
  constructor() {
    super(SphereGeometryWrapper, SphereGeometry);

    this.hasRemountProps("radius",
      "widthSegments",
      "heightSegments",
      "phiStart",
      "phiLength",
      "thetaStart",
      "thetaLength",
    );
  }
}

export default SphereGeometryDescriptor;
