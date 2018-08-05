import {LatheBufferGeometry, LatheGeometry, Vector2} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface ILatheGeometryProps {
  points: Vector2[];
  segments?: number;
  phiStart?: number;
  phiLength?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      latheGeometry: IThreeElementPropsBase<LatheGeometry> & ILatheGeometryProps;
      latheBufferGeometry: IThreeElementPropsBase<LatheBufferGeometry> & ILatheGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<ILatheGeometryProps>()(
    LatheGeometry,
    LatheBufferGeometry,
    "points",
    "segments",
    "phiStart",
    "phiLength",
  );

export default geometryDescriptor;
