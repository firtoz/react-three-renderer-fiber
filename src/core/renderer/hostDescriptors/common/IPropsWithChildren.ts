import {ReactNode} from "react";

export type ChildType<TChildProps> =
  React.ReactElement<TChildProps>
  | ((...args: any[]) => ChildType<TChildProps>)
  | ((...args: any[]) => Array<ChildType<TChildProps>>)
  | null
  | undefined;

export interface IPropsWithChild<TChildProps = any> {
  children?: ChildType<TChildProps>;
}

export interface IPropsWithChildren<TChildProps = any> {
  children?: ReactNode | ChildType<TChildProps> | Array<ChildType<TChildProps>>;
}
