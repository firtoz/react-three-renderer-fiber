import {TorusKnotBufferGeometry, TorusKnotGeometry} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface ITorusKnotGeometryProps {
  radius?: number;
  tube?: number;
  radialSegments?: number;
  tubularSegments?: number;
  p?: number;
  q?: number;
  heightScale?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      torusKnotGeometry: IThreeElementPropsBase<TorusKnotGeometry> & ITorusKnotGeometryProps;
      torusKnotBufferGeometry: IThreeElementPropsBase<TorusKnotBufferGeometry> & ITorusKnotGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<ITorusKnotGeometryProps>()(
    TorusKnotGeometry,
    TorusKnotBufferGeometry,
    "radius",
    "tube",
    "radialSegments",
    "tubularSegments",
    "p",
    "q",
    "heightScale",
  );

export default geometryDescriptor;
