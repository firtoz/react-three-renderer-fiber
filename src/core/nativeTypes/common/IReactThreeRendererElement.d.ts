import {Ref} from "react";

declare global {
  export interface IReactThreeRendererElement<T> {
    ref?: Ref<T>;
  }
}
