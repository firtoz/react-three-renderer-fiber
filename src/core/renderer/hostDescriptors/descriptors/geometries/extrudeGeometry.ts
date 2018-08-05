import {CurvePath, ExtrudeBufferGeometry, ExtrudeGeometry, Shape} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface IExtrudeGeometryProps {
  shapes: Shape | Shape[];
  curveSegments?: number;
  steps?: number;
  depth?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelSegments?: number;
  extrudePath?: CurvePath<any>;
  frames?: object;
  UVGenerator?: object;
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
  createGeometryAndBufferGeometryDescriptors<IExtrudeGeometryProps, ExtrudeGeometry, ExtrudeBufferGeometry>(
    (props) => {
      const {shapes, ...options} = props;
      return new ExtrudeGeometry(
        shapes as Shape[],
        options,
      );
    },
    (props) => {
      const {shapes, ...options} = props;
      return new ExtrudeBufferGeometry(
        shapes as Shape[],
        options,
      );
    },
    [
      "shapes",
      "curveSegments",
      "steps",
      "depth",
      "bevelEnabled",
      "bevelThickness",
      "bevelSize",
      "bevelSegments",
      "extrudePath",
      "frames",
      "UVGenerator",
    ],
    ExtrudeGeometry,
    ExtrudeBufferGeometry,
  );

export default geometryDescriptor;
