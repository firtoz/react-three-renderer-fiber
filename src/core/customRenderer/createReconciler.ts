import {
  IFiber,
  IReactFiberRendererConfig,
  IRenderer,
  ReactDebugCurrentFiber,
  ReactDOMFrameScheduling,
  ReactFiberReconciler,
} from "react-fiber-export";

import * as PropTypes from "prop-types";
import isNonProduction from "../renderer/utils/isNonProduction";
import {INativeElement} from "./customRenderer";
import {autoBind, bindAcceptor} from "./decorators/autoBind";

const emptyObject = {};

export interface IPropMap {
  [key: string]: any;
}

export type TUpdatePayload = any[];

const checkPropTypes: (typeSpecs: any,
                       values: IPropMap,
                       location: string,
                       componentName: string,
                       getStack?: () => (string | null)) => void = (PropTypes as any).checkPropTypes;

@bindAcceptor
export class CustomReconcilerConfig<TDescriptor extends INativeElement<any,
  any,
  any,
  any,
  any,
  any>> implements IReactFiberRendererConfig {
  public scheduleDeferredCallback: any = ReactDOMFrameScheduling.rIC;
  public useSyncScheduling: boolean = true;

  private fiberSymbol: symbol = Symbol("custom-renderer-fiber");
  private contextSymbol: symbol = Symbol("custom-renderer-context");

  private hostDescriptors: Map<string, TDescriptor> = new Map();

  public getFiberSymbol() {
    return this.fiberSymbol;
  }

  public getContextSymbol() {
    return this.contextSymbol;
  }

  @autoBind
  public getRootHostContext(rootContainerInstance: any) {
    // console.log("getRootHostContext", this);
    if (rootContainerInstance && rootContainerInstance[this.contextSymbol] !== undefined) {
      return rootContainerInstance[this.contextSymbol];
    }

    return emptyObject;
  }

  public getChildHostContext(parentHostContext: any, type: string) {
    return parentHostContext;
  }

  public shouldSetTextContent(props: IPropMap) {
    // TODO
    return false;
  }

  public shouldDeprioritizeSubtree(type: any, props: any) {
    // debugger;
    // TODO vis check
    return false;
  }

  @autoBind
  public createInstance(type: string,
                        props: IPropMap,
                        rootContainerInstance: any,
                        hostContext: any,
                        fiber: IFiber) {
    const descriptor = this.getDescriptorForType(type);

    if (isNonProduction) {
      checkPropTypes(descriptor.propTypes,
        props,
        "prop",
        type,
        ReactDebugCurrentFiber.getCurrentFiberStackAddendum);
    }

    if (descriptor === undefined) {
      throw new Error("cannot create this type yet: " + type);
    }

    const createdInstance = descriptor.createInstance(props, rootContainerInstance);

    if (hostContext !== null) {
      createdInstance[this.contextSymbol] = hostContext;
    }

    this.precacheInstance(fiber, createdInstance);

    descriptor.applyInitialPropUpdates(createdInstance, props);

    return createdInstance;
  }

  public finalizeInitialChildren(r3rElement: any,
                                 type: any,
                                 props: any,
                                 rootContainerInstance: any) {
    // TODO ?

    return false;
  }

  public prepareForCommit() {
    // console.log("prepare for commit");

    // debugger;
    // TODO ?
  }

  public resetAfterCommit() {
    // console.log("reset after commit");
    // TODO ?
  }

  @autoBind
  public prepareUpdate(instance: any,
                       type: any,
                       oldProps: any,
                       newProps: any,
                       /* rootContainerInstance: any, */
                       /* hostContext: any, */) {
    return this.diffProperties(
      type,
      oldProps,
      newProps,
    );
  }

  @autoBind
  public insertBefore(parentInstance: any, childInstance: any, before: any): void {
    this.getDescriptorForInstance(childInstance).willBeAddedToParentBefore(childInstance, parentInstance, before);
    this.getDescriptorForInstance(parentInstance).insertBefore(parentInstance, childInstance, before);
  }

  @autoBind
  public appendChild(parentInstance: any, child: any): void {
    this.getDescriptorForInstance(child).willBeAddedToParent(child, parentInstance);
    this.getDescriptorForInstance(parentInstance).appendChild(parentInstance, child);
  }

  @autoBind
  public appendInitialChild(parentInstance: any, child: any): void {
    this.getDescriptorForInstance(child).willBeAddedToParent(child, parentInstance);
    this.getDescriptorForInstance(parentInstance).appendInitialChild(parentInstance, child);
  }

  @autoBind
  public commitUpdate(instance: any,
                      updatePayload: any[],
                      type: string,
                      oldProps: IPropMap,
                      newProps: IPropMap,
                      fiber: IFiber): void {
    this.getDescriptorForInstance(instance).commitUpdate(instance, updatePayload, oldProps, newProps);
  }

  public getPublicInstance(instance: any) {
    return instance;
  }

  public createTextInstance(text: string,
                            /* rootContainerInstance: any, */
                            /* internalInstanceHandle: any */): any {
    return text;
  }

  public commitMount(): void {
    throw new Error("commitMount");
  }

  public resetTextContent(): void {
    // console.log("resetTextContent");
    throw new Error("resetTextContent");
    // return false;
  }

  public commitTextUpdate(): void {
    throw new Error("commitTextUpdate");
  }

  @autoBind
  public removeChild(parent: any, child: any): void {
    this.getDescriptorForInstance(child).willBeRemovedFromParent(child, parent);
    this.getDescriptorForInstance(parent).removeChild(parent, child);
  }

  @autoBind
  public appendChildToContainer(parent: any, child: any): void {
    this.getDescriptorForInstance(child).appendToContainer(child, parent);
  }

  @autoBind
  public insertInContainerBefore(container: any, childInstance: any, before: any): void {
    this.getDescriptorForInstance(childInstance).insertInContainerBefore(childInstance, container, before);
  }

  @autoBind
  public removeChildFromContainer(container: any, child: any): void {
    this.getDescriptorForInstance(child).willBeRemovedFromContainer(child, container);
  }

  protected defineHostDescriptor(type: string, descriptor: TDescriptor): void {
    this.hostDescriptors.set(type, descriptor);
  }

  protected getDescriptorForInstance(instance: any): TDescriptor {
    const type = (instance[this.fiberSymbol] as IFiber).type;

    if (!this.hostDescriptors.has(type)) {
      throw new Error(`Cannot find descriptor for type "${type}"`);
    }

    return this.hostDescriptors.get(type) as TDescriptor;
  }

  private precacheInstance(fiber: IFiber, customRendererElement: any) {
    customRendererElement[this.fiberSymbol] = fiber;
  }

  private getDescriptorForType(type: string): TDescriptor {
    if (!this.hostDescriptors.has(type)) {
      throw new Error(`Cannot find descriptor for type "${type}"`);
    }

    return this.hostDescriptors.get(type) as TDescriptor;
  }

  private diffProperties(type: string, lastProps: IPropMap, nextProps: IPropMap): TUpdatePayload | null {
    if (isNonProduction) {
      checkPropTypes(this.getDescriptorForType(type).propTypes,
        nextProps,
        "prop",
        type,
        ReactDebugCurrentFiber.getCurrentFiberStackAddendum);
    }

    let updatePayload: TUpdatePayload | null = null;

    const lastPropsKeys = Object.keys(lastProps);

    for (const propKey of lastPropsKeys) {
      if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
        continue;
      }

      if (updatePayload === null) {
        updatePayload = [];
      }

      // all removed props will be null
      updatePayload.push(propKey, null);
    }

    const nextPropsKeys = Object.keys(nextProps);

    const hasLastProps = (lastProps != null);

    for (const propKey of nextPropsKeys) {
      const nextProp = nextProps[propKey];
      const lastProp = hasLastProps ? lastProps[propKey] : undefined;
      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (!nextProp) && (!lastProp)) {
        continue;
      }

      if (propKey === "children") {
        if (lastProp !== nextProp && (typeof nextProp === "string" || typeof nextProp === "number")) {
          // update text

          if (updatePayload === null) {
            updatePayload = [];
          }

          updatePayload.push(propKey, "" + nextProp);
        }
      } else {
        // update value

        if (updatePayload === null) {
          updatePayload = [];
        }

        updatePayload.push(propKey, nextProp);
      }
    }

    return updatePayload;
  }
}

export default function createReconciler<TDescriptor extends INativeElement<any,
  any,
  any,
  any,
  any,
  any>>(config: CustomReconcilerConfig<TDescriptor>): IRenderer {
  return ReactFiberReconciler(config);
}
