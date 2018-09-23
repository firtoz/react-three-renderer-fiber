import {ExtrudeBufferGeometry, ExtrudeGeometry, ExtrudeGeometryOptions, Shape} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IExtrudeGeometryProps {
  shapes: Shape | Shape[];
  options?: ExtrudeGeometryOptions;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      extrudeGeometry: IThreeElementPropsBase<ExtrudeGeometry> & IExtrudeGeometryProps;
      extrudeBufferGeometry: IThreeElementPropsBase<ExtrudeBufferGeometry> & IExtrudeGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IExtrudeGeometryProps>()(
    ExtrudeGeometry,
    ExtrudeBufferGeometry,
    "shapes",
    "options",
  );

export default geometryDescriptor;
