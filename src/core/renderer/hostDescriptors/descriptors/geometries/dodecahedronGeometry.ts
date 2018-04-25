import * as THREE from "three";
import {DodecahedronGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface IDodecahedronGeometryProps {
  radius: number;
  detail: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      dodecahedronGeometry: IThreeElementPropsBase<THREE.DodecahedronGeometry> & IDodecahedronGeometryProps;
    }
  }
}

export class DodecahedronGeometryWrapper extends GeometryWrapperBase<IDodecahedronGeometryProps, DodecahedronGeometry> {
  protected constructGeometry(props: IDodecahedronGeometryProps): DodecahedronGeometry {
    return new DodecahedronGeometry(
      props.radius,
      props.detail,
    );
  }
}

class DodecahedronGeometryDescriptor extends WrappedEntityDescriptor<DodecahedronGeometryWrapper,
  IDodecahedronGeometryProps,
  DodecahedronGeometry,
  GeometryContainerType> {
  constructor() {
    super(DodecahedronGeometryWrapper, DodecahedronGeometry);

    this.hasRemountProps(
      "radius",
      "detail",
    );
  }
}

export default DodecahedronGeometryDescriptor;
