import {Ref} from "react";

declare global {
  export interface IThreeElementPropsBase<T> {
    key?: string;
    ref?: Ref<T>;
  }
}
