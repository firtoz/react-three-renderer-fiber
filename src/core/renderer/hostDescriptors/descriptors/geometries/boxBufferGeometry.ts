import {BoxBufferGeometry} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {bufferGeometryDescriptor, IBoxGeometryProps} from "./boxGeometry";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      boxBufferGeometry: IThreeElementPropsBase<BoxBufferGeometry> & IBoxGeometryProps;
    }
  }
}

export default bufferGeometryDescriptor;
