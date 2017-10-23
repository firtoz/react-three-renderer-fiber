import {Validator} from "prop-types";
import {IPropMap} from "../renderer/fiberRenderer/prepareUpdate";

export type ICustomReactRenderer<TRootContainer> = any;

export interface IPropTypeMap {
  [propName: string]: Validator<any>;
}

export interface INativeElement<TProps, T, TParent, TChild, TRoot, TRenderer extends ICustomReactRenderer<any>> {
  propTypes: IPropTypeMap;

  createInstance(props: TProps, rootContainerInstance: TRoot): T;

  applyInitialPropUpdates(instance: T, props: TProps): void;

  willBeRemovedFromParent(instance: T, parent: TParent): void;

  willBeRemovedFromContainer(instance: T, container: TParent): void;

  appendInitialChild(instance: T, child: TChild): void;

  appendChild(instance: T, child: TChild): void;

  insertBefore(parentInstance: T, childInstance: TChild, before: TChild): void;

  insertInContainerBefore(childInstance: T, container: TParent, before: any): void;

  removeChild(instance: T, child: TChild): void;

  appendToContainer(instance: T, container: TParent): void;

  commitUpdate(instance: any,
               updatePayload: any[],
               oldProps: IPropMap,
               newProps: IPropMap): void;
}
