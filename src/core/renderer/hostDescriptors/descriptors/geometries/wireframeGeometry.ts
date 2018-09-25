import {BufferGeometry, Geometry, WireframeGeometry} from "three";
import {createGeometryDescriptor} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {IRenderableProp} from "../../common/RefWrapper";
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

export const bufferGeometryDescriptor =
  createGeometryDescriptor<IWireframeGeometryProps>()(
    WireframeGeometry,
    "geometry",
  );

export default bufferGeometryDescriptor;
