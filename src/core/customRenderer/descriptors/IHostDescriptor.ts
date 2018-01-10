import {Validator} from "prop-types";
import {IPropMap} from "../createReconciler";

export type ICustomReactRenderer<TRootContainer> = any;

export interface IPropTypeMap {
  [propName: string]: Validator<any>;
}

export interface IHostDescriptor<TProps, THost, TParent, TChild, TRoot, TRenderer extends ICustomReactRenderer<any>> {
  propTypes: IPropTypeMap;

  createInstance(props: TProps, rootContainerInstance: TRoot): THost;

  applyInitialPropUpdates(instance: THost, props: TProps): void;

  willBeRemovedFromParent(instance: THost, parent: TParent): void;

  willBeRemovedFromContainer(instance: THost, container: TParent): void;

  appendInitialChild(instance: THost, child: TChild): void;

  willBeAddedToParent(instance: THost, parentInstance: TParent): void;

  willBeAddedToParentBefore(instance: THost, parentInstance: TParent, before: any): void;

  appendChild(instance: THost, child: TChild): void;

  insertBefore(parentInstance: THost, childInstance: TChild, before: TChild): void;

  insertInContainerBefore(childInstance: THost, container: TParent, before: any): void;

  removeChild(instance: THost, child: TChild): void;

  appendToContainer(instance: THost, container: TParent): void;

  commitUpdate(instance: any,
               updatePayload: any[],
               oldProps: IPropMap,
               newProps: IPropMap): void;
}
