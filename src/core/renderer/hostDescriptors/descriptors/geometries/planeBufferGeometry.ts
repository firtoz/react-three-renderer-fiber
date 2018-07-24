import {PlaneBufferGeometry} from "three";
import {BufferGeometryWrapperBase, GeometryContainerType} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface IPlaneBufferGeometryProps {
  width: number;
  height: number;
  widthSegments?: number;
  heightSegments?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      planeBufferGeometry: IThreeElementPropsBase<PlaneBufferGeometry> & IPlaneBufferGeometryProps;
    }
  }
}

export class PlaneBufferGeometryWrapper extends BufferGeometryWrapperBase<IPlaneBufferGeometryProps,
  PlaneBufferGeometry> {
  protected constructGeometry(props: IPlaneBufferGeometryProps): PlaneBufferGeometry {
    return new PlaneBufferGeometry(props.width, props.height, props.widthSegments, props.heightSegments);
  }
}

class PlaneBufferGeometryDescriptor extends WrappedEntityDescriptor<PlaneBufferGeometryWrapper,
  IPlaneBufferGeometryProps,
  PlaneBufferGeometry,
  GeometryContainerType> {
  constructor() {
    super(PlaneBufferGeometryWrapper, PlaneBufferGeometry);

    this.hasRemountProps("width",
      "height",
      "widthSegments",
      "heightSegments",
    );
  }
}

export default PlaneBufferGeometryDescriptor;
