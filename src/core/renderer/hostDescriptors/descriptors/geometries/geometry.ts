import * as THREE from "three";
import {Geometry, Vector3} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface IGeometryProps {
  vertices?: Vector3[];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      geometry: IThreeElementPropsBase<THREE.Geometry> & IGeometryProps;
    }
  }
}

export class GeometryWrapper extends GeometryWrapperBase<IGeometryProps, Geometry> {
  protected constructGeometry(props: IGeometryProps) {
    const geometry = new Geometry();

    if (props.vertices !== undefined) {
      geometry.vertices = props.vertices;
    }

    return geometry;
  }
}

class GeometryDescriptor extends WrappedEntityDescriptor<GeometryWrapper,
  IGeometryProps,
  Geometry,
  GeometryContainerType> {
  constructor() {
    super(GeometryWrapper, Geometry);

    this.hasProp<Vector3[]>("vertices", (instance, newValue, oldProps, newProps) => {
      if (instance.vertices.length !== newValue.length) {
        this.remountTrigger(instance, newValue, oldProps, newProps);
        return;
      }

      instance.vertices = newValue;
      instance.verticesNeedUpdate = true;
    }, false, true);
  }
}

export default GeometryDescriptor;
