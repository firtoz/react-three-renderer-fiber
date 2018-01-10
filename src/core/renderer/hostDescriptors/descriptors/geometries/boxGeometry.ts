import * as THREE from "three";
import {BoxGeometry} from "three";
import {GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface IBoxGeometryProps {
  width: number;
  height: number;
  depth: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      boxGeometry: IThreeElementPropsBase<THREE.BoxGeometry> & IBoxGeometryProps;
    }
  }
}

export class BoxGeometryWrapper extends GeometryWrapperBase<IBoxGeometryProps, BoxGeometry> {
  protected constructGeometry(props: IBoxGeometryProps): BoxGeometry {
    return new BoxGeometry(props.width,
      props.height,
      props.depth,
      props.widthSegments,
      props.heightSegments,
      props.depthSegments);
  }
}

class BoxGeometryDescriptor extends WrappedEntityDescriptor<BoxGeometryWrapper,
  IBoxGeometryProps,
  BoxGeometry> {
  constructor() {
    super(BoxGeometryWrapper, BoxGeometry);

    this.hasRemountProps("width",
      "height",
      "depth",
      "widthSegments",
      "heightSegments");
  }
}

export default BoxGeometryDescriptor;
