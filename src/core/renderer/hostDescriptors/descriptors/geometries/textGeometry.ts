import {TextBufferGeometry, TextGeometry, TextGeometryParameters} from "three";
import {createGeometryAndBufferGeometryDescriptors} from "../../common/createGeometryDescriptor";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";

export interface ITextGeometryProps extends TextGeometryParameters {
  text: string;
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
  createGeometryAndBufferGeometryDescriptors<ITextGeometryProps, TextGeometry, TextBufferGeometry>(
    (props) => {
      const {text, ...parameters} = props;
      return new TextGeometry(
        text,
        parameters,
      );
    },
    (props) => {
      const {text, ...parameters} = props;
      return new TextBufferGeometry(
        text,
        parameters,
      );
    },
    [
      "text",
      "font",
      "size",
      "height",
      "curveSegments",
      "bevelEnabled",
      "bevelThickness",
      "bevelSize",
      "bevelSegments",
    ],
    TextGeometry,
    TextBufferGeometry,
  );

export default geometryDescriptor;
