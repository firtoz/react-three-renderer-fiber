import * as THREE from "three";
import {CylinderGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface ICylinderGeometryProps {
  radiusTop?: number;
  radiusBottom?: number;
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
      cylinderGeometry: IThreeElementPropsBase<THREE.CylinderGeometry> & ICylinderGeometryProps;
    }
  }
}

export class CylinderGeometryWrapper extends GeometryWrapperBase<ICylinderGeometryProps, CylinderGeometry> {
  protected constructGeometry(props: ICylinderGeometryProps): CylinderGeometry {
    return new CylinderGeometry(
      props.radiusTop,
      props.radiusBottom,
      props.height,
      props.radialSegments,
      props.heightSegments,
      props.openEnded,
      props.thetaStart,
      props.thetaLength
    );
  }
}

class CylinderGeometryDescriptor extends WrappedEntityDescriptor<CylinderGeometryWrapper,
  ICylinderGeometryProps,
  CylinderGeometry,
  GeometryContainerType> {
  constructor() {
    super(CylinderGeometryWrapper, CylinderGeometry);

    this.hasRemountProps(
      "radiusTop",
      "radiusBottom",
      "height",
      "radialSegments",
      "heightSegments",
      "openEnded",
      "thetaStart",
      "thetaLength"
    );
  }
}

export default CylinderGeometryDescriptor;
