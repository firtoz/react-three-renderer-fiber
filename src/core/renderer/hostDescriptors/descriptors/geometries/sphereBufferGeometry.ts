import * as THREE from "three";
import {SphereBufferGeometry} from "three";
import {BufferGeometryWrapperBase, GeometryContainerType} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";
import {ISphereGeometryProps} from "./sphereGeometry";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sphereBufferGeometry: IThreeElementPropsBase<THREE.SphereBufferGeometry> & ISphereGeometryProps;
    }
  }
}

export class SphereBufferGeometryWrapper extends BufferGeometryWrapperBase<ISphereGeometryProps, SphereBufferGeometry> {
  protected constructGeometry(props: ISphereGeometryProps): SphereBufferGeometry {
    return new SphereBufferGeometry(props.radius,
      props.widthSegments,
      props.heightSegments,
      props.phiStart,
      props.phiLength,
      props.thetaStart,
      props.thetaLength,
    );
  }
}

class SphereBufferGeometryDescriptor extends WrappedEntityDescriptor<SphereBufferGeometryWrapper,
  ISphereGeometryProps,
  SphereBufferGeometry,
  GeometryContainerType> {
  constructor() {
    super(SphereBufferGeometryWrapper, SphereBufferGeometry);

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

export default SphereBufferGeometryDescriptor;
