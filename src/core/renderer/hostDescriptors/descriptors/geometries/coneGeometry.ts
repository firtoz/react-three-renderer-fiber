import * as THREE from "three";
import {ConeGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface IConeGeometryProps {
  radius?: number;
  height?: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded?: boolean;
  thetaStart?: number;
  thetaLength?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      coneGeometry: IThreeElementPropsBase<THREE.ConeGeometry> & IConeGeometryProps;
    }
  }
}

export class ConeGeometryWrapper extends GeometryWrapperBase<IConeGeometryProps, ConeGeometry> {
  protected constructGeometry(props: IConeGeometryProps): ConeGeometry {
    return new ConeGeometry(
      props.radius,
      props.height,
      props.radialSegments,
      props.heightSegments,
      props.openEnded,
      props.thetaStart,
      props.thetaLength,
    );
  }
}

class ConeGeometryDescriptor extends WrappedEntityDescriptor<ConeGeometryWrapper,
  IConeGeometryProps,
  ConeGeometry,
  GeometryContainerType> {
  constructor() {
    super(ConeGeometryWrapper, ConeGeometry);

    this.hasRemountProps(
      "radius",
      "height",
      "radialSegments",
      "heightSegments",
      "openEnded",
      "thetaStart",
      "thetaLength",
    );
  }
}

export default ConeGeometryDescriptor;
