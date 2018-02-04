import * as THREE from "three";
import {OctahedronGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface IOctahedronGeometryProps {
  radius: number;
  detail: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      octahedronGeometry: IThreeElementPropsBase<THREE.OctahedronGeometry> & IOctahedronGeometryProps;
    }
  }
}

export class OctahedronGeometryWrapper extends GeometryWrapperBase<IOctahedronGeometryProps, OctahedronGeometry> {
  protected constructGeometry(props: IOctahedronGeometryProps): OctahedronGeometry {
    return new OctahedronGeometry(
      props.radius,
      props.detail
    );
  }
}

class OctahedronGeometryDescriptor extends WrappedEntityDescriptor<OctahedronGeometryWrapper,
  IOctahedronGeometryProps,
  OctahedronGeometry,
  GeometryContainerType> {
  constructor() {
    super(OctahedronGeometryWrapper, OctahedronGeometry);

    this.hasRemountProps(
      "radius",
      "detail"
    );
  }
}

export default OctahedronGeometryDescriptor;
