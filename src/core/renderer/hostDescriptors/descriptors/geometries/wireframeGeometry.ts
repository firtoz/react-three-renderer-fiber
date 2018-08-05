import {BufferGeometry, Geometry, WireframeGeometry} from "three";
import {createGeometryDescriptor} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IWireframeGeometryProps {
  geometry: BufferGeometry | Geometry;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      wireframeGeometry: IThreeElementPropsBase<WireframeGeometry> & IWireframeGeometryProps;
    }
  }
}

export const bufferGeometryDescriptor =
  createGeometryDescriptor<IWireframeGeometryProps>()(
    WireframeGeometry,
    "geometry",
  );

export default bufferGeometryDescriptor;
