import {BufferGeometry, EdgesGeometry, Geometry} from "three";
import {createGeometryDescriptor} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IEdgesGeometryProps {
  geometry: BufferGeometry | Geometry;
  thresholdAngle?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      edgesGeometry: IThreeElementPropsBase<EdgesGeometry> & IEdgesGeometryProps;
    }
  }
}

export const bufferGeometryDescriptor =
  createGeometryDescriptor<IEdgesGeometryProps>()(
    EdgesGeometry,
    "geometry",
    "thresholdAngle",
  );

export default bufferGeometryDescriptor;
