import * as THREE from "three";
import {ExtrudeGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface IExtrudeGeometryProps {
  shapes: THREE.Shape[];
  curveSegments?: number;
  steps?: number;
  amount?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelSegments?: number;
  extrudePath?: THREE.CurvePath<any>;
  frames?: object;
  UVGenerator?: object;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      extrudeGeometry: IThreeElementPropsBase<THREE.ExtrudeGeometry> & IExtrudeGeometryProps;
    }
  }
}

export class ExtrudeGeometryWrapper extends GeometryWrapperBase<IExtrudeGeometryProps, ExtrudeGeometry> {
  protected constructGeometry(props: IExtrudeGeometryProps): ExtrudeGeometry {
    const {shapes, ...opts} = props;

    return new ExtrudeGeometry(
      shapes,
      opts,
    );
  }
}

class ExtrudeGeometryDescriptor extends WrappedEntityDescriptor<ExtrudeGeometryWrapper,
  IExtrudeGeometryProps,
  ExtrudeGeometry,
  GeometryContainerType> {
  constructor() {
    super(ExtrudeGeometryWrapper, ExtrudeGeometry);

    this.hasRemountProps(
      "shapes",
      "extrudeGeometry",
      "curveSegments",
      "steps",
      "amount",
      "bevelEnabled",
      "bevelThickness",
      "bevelSize",
      "bevelSegments",
      "extrudePath",
      "frames",
      "UVGenerator",
    );
  }
}

export default ExtrudeGeometryDescriptor;
