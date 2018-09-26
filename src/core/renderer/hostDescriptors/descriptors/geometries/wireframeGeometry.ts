import {BufferGeometry, Geometry, WireframeGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";
import {IRenderableProp, RefWrapper, SimplePropertyWrapper} from "../../common/RefWrapperTest";
import {IGeometryElementProps} from "../objects/mesh";

export interface IWireframeGeometryProps {
  geometry: IRenderableProp<BufferGeometry | Geometry, IGeometryElementProps>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      wireframeGeometry: IThreeElementPropsBase<WireframeGeometry> & IWireframeGeometryProps;
    }
  }
}

class WireframeGeometryWrapper extends GeometryWrapperBase<IWireframeGeometryProps, WireframeGeometry> {
  protected constructGeometry(props: IWireframeGeometryProps): WireframeGeometry {
    return new WireframeGeometry(new BufferGeometry());
  }
}

export default class WireframeGeometryDescriptor extends WrappedEntityDescriptor<WireframeGeometryWrapper,
  IWireframeGeometryProps,
  WireframeGeometry,
  GeometryContainerType> {
  constructor() {
    super(WireframeGeometryWrapper, WireframeGeometry);
    new RefWrapper(["geometry"], this)
      .wrapProperty(new SimplePropertyWrapper("geometry", [Geometry, BufferGeometry]));
  }
}
