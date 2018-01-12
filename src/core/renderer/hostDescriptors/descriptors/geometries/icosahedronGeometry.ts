import * as THREE from "three";
import {IcosahedronGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface IIcosahedronGeometryProps {
  radius: number;
  detail: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      icosahedronGeometry: IThreeElementPropsBase<THREE.IcosahedronGeometry> & IIcosahedronGeometryProps;
    }
  }
}

export class IcosahedronGeometryWrapper extends GeometryWrapperBase<IIcosahedronGeometryProps, IcosahedronGeometry> {
  protected constructGeometry(props: IIcosahedronGeometryProps): IcosahedronGeometry {
    return new IcosahedronGeometry(
      props.radius,
      props.detail
    );
  }
}

class IcosahedronGeometryDescriptor extends WrappedEntityDescriptor<IcosahedronGeometryWrapper,
  IIcosahedronGeometryProps,
  IcosahedronGeometry,
  GeometryContainerType> {
  constructor() {
    super(IcosahedronGeometryWrapper, IcosahedronGeometry);

    this.hasRemountProps(
      "radius",
      "detail"
    );
  }
}

export default IcosahedronGeometryDescriptor;
