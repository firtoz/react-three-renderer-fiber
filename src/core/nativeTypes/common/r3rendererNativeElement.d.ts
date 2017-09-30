import {NativeElement} from "../../customRenderer/customRenderer";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";

export interface R3RendererNativeElement<Props,
  Parent,
  T>
  extends NativeElement<Props,
    Parent,
    T,
    ReactThreeRenderer> {
}
