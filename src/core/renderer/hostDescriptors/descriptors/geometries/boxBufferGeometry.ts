import {BoxBufferGeometry} from "three";
import {BufferGeometryWrapperBase, GeometryContainerType} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";
import {IBoxGeometryProps} from "./boxGeometry";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      boxBufferGeometry: IThreeElementPropsBase<BoxBufferGeometry> & IBoxGeometryProps;
    }
  }
}

export class BoxBufferGeometryWrapper extends BufferGeometryWrapperBase<IBoxGeometryProps,
  BoxBufferGeometry> {
  protected constructGeometry(props: IBoxGeometryProps): BoxBufferGeometry {
    return new BoxBufferGeometry(props.width, props.height, props.depth,
      props.widthSegments, props.heightSegments, props.depthSegments);
  }
}

class BoxBufferGeometryDescriptor extends WrappedEntityDescriptor<BoxBufferGeometryWrapper,
  IBoxGeometryProps,
  BoxBufferGeometry,
  GeometryContainerType> {
  constructor() {
    super(BoxBufferGeometryWrapper, BoxBufferGeometry);

    this.hasRemountProps("width",
      "height",
      "depth",
      "widthSegments",
      "heightSegments",
      "depthSegments",
    );
  }
}

export default BoxBufferGeometryDescriptor;
