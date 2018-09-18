import {TextBufferGeometry, TextGeometry, TextGeometryParameters} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface ITextGeometryProps {
  text: string;
  parameters?: TextGeometryParameters;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: IThreeElementPropsBase<TextGeometry> & ITextGeometryProps;
      textBufferGeometry: IThreeElementPropsBase<TextBufferGeometry> & ITextGeometryProps;
    }
  }
}

export const { bufferGeometryDescriptor, geometryDescriptor } =
  createGeometryAndBufferGeometryDescriptors<ITextGeometryProps>()(
    TextGeometry,
    TextBufferGeometry,
    "text",
    "parameters",
  );

export default geometryDescriptor;
