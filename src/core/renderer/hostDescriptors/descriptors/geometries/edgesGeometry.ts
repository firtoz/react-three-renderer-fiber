import {BufferGeometry, EdgesGeometry, Geometry} from "three";
import {BufferGeometryWrapperBase, GeometryContainerType} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface IEdgesGeometryProps {
  geometry: BufferGeometry | Geometry;
  thresholdAngle: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      edgesGeometry: IThreeElementPropsBase<EdgesGeometry> & IEdgesGeometryProps;
    }
  }
}

export class EdgesGeometryWrapper extends BufferGeometryWrapperBase<IEdgesGeometryProps, EdgesGeometry> {
  protected constructGeometry(props: IEdgesGeometryProps): EdgesGeometry {
    return new EdgesGeometry(props.geometry, props.thresholdAngle);
  }
}

class EdgesGeometryDescriptor extends WrappedEntityDescriptor<EdgesGeometryWrapper,
  IEdgesGeometryProps,
  EdgesGeometry,
  GeometryContainerType> {
  constructor() {
    super(EdgesGeometryWrapper, EdgesGeometry);

    this.hasRemountProps("geometry",
      "thresholdAngle");
  }
}

export default EdgesGeometryDescriptor;
