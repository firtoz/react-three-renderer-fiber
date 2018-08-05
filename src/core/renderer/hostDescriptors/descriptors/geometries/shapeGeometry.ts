import {Shape, ShapeBufferGeometry, ShapeGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IShapeGeometryProps {
  shapes: Shape | Shape[];
  curveSegments?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      shapeGeometry: IThreeElementPropsBase<ShapeGeometry> & IShapeGeometryProps;
      shapeBufferGeometry: IThreeElementPropsBase<ShapeBufferGeometry> & IShapeGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<IShapeGeometryProps, ShapeGeometry, ShapeBufferGeometry>(
    (props) => new ShapeGeometry(
      props.shapes as Shape[],
      props.curveSegments,
    ),
    (props) => new ShapeBufferGeometry(
      props.shapes as Shape[],
      props.curveSegments,
    ),
    [
      "shapes",
      "curveSegments",
    ],
    ShapeGeometry,
    ShapeBufferGeometry,
  );

export default geometryDescriptor;
