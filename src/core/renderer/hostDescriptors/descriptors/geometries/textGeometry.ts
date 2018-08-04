import {Font, TextGeometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "../../common/geometryBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor} from "../../common/ObjectWrapper";

export interface ITextGeometryProps {
  text: string;
  font?: Font;
  size?: number;
  height?: number;
  curveSegments?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelSegments?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: IThreeElementPropsBase<TextGeometry> & ITextGeometryProps;
    }
  }
}

export class TextGeometryWrapper extends GeometryWrapperBase<ITextGeometryProps, TextGeometry> {
  protected constructGeometry(props: ITextGeometryProps): TextGeometry {
    return new TextGeometry(props.text, {
      bevelEnabled: props.bevelEnabled,
      bevelSegments: props.bevelSegments,
      bevelSize: props.bevelSize,
      bevelThickness: props.bevelThickness,
      curveSegments: props.curveSegments,
      font: props.font,
      height: props.height,
      size: props.size,
    });
  }
}

class TextGeometryDescriptor extends WrappedEntityDescriptor<TextGeometryWrapper,
  ITextGeometryProps,
  TextGeometry,
  GeometryContainerType> {
  constructor() {
    super(TextGeometryWrapper, TextGeometry);

    this.hasRemountProps("text",
      "bevelEnabled",
      "bevelSegments",
      "bevelSize",
      "bevelThickness",
      "curveSegments",
      "font",
      "height",
      "size");
  }
}

export default TextGeometryDescriptor;
