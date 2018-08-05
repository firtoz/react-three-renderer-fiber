import {BufferGeometry, Geometry, WireframeGeometry} from "three";
import {createBufferGeometryDescriptor} from "../../common/createGeometryDescriptor";
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
  createBufferGeometryDescriptor<IWireframeGeometryProps, WireframeGeometry>(
    (props) => new WireframeGeometry(
      props.geometry,
    ),
    [
      "geometry",
    ],
    WireframeGeometry,
  );

export default bufferGeometryDescriptor;
