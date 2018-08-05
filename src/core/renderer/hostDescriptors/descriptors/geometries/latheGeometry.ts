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
  createGeometryAndBufferGeometryDescriptors<ILatheGeometryProps, LatheGeometry, LatheBufferGeometry>(
    (props) => new LatheGeometry(
      props.points,
      props.segments,
      props.phiStart,
      props.phiLength,
    ),
    (props) => new LatheBufferGeometry(
      props.points,
      props.segments,
      props.phiStart,
      props.phiLength,
    ),
    [
      "points",
      "segments",
      "phiStart",
      "phiLength",
    ],
    LatheGeometry,
    LatheBufferGeometry,
  );

export default geometryDescriptor;
