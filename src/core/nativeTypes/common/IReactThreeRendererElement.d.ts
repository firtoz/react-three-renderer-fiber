import {Ref} from "react";

declare global {
  export interface IReactThreeRendererElement<T> {
    key?: string;
    ref?: Ref<T>;
  }
}
