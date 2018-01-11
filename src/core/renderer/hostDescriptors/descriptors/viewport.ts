import {WebGLRenderer} from "three";
import Viewport from "../../utils/viewport";
import {IThreeElementPropsBase} from "../common/IReactThreeRendererElement";
import {IObject3DProps} from "../common/object3DBase";
import ReactThreeRendererDescriptor from "../common/ReactThreeRendererDescriptor";
import {IElement} from "../common/RefWrapper";
import {RenderAction} from "./render";

export type ViewportParents = RenderAction;

export interface IViewportProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ViewportElementProps = IThreeElementPropsBase<Viewport> & IViewportProps;

export type ViewportElement = IElement<Viewport, ViewportElementProps>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      viewport: ViewportElementProps;
    }
  }
}

class ViewportDescriptor extends ReactThreeRendererDescriptor<IViewportProps, Viewport, ViewportParents> {
  constructor() {
    super();

    this.hasSimpleProp("x", false);
    this.hasSimpleProp("y", false);
    this.hasSimpleProp("width", false);
    this.hasSimpleProp("height", false);
  }

  public createInstance(props: IViewportProps) {
    return new Viewport(props.x, props.y, props.width, props.height);
  }
}

export default ViewportDescriptor;
