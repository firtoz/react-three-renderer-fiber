import {INativeElement} from "../../customRenderer/customRenderer";
import {TUpdatePayload} from "../../renderer/fiberRenderer/prepareUpdate";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";
import getDescriptorForInstance from "../../renderer/utils/getDescriptorForInstance";
import r3rFiberSymbol from "../../renderer/utils/r3rFiberSymbol";

type IPropertyUpdater<TProps, TInstance, TPropType> = (instance: TInstance,
                                                       newValue: TPropType,
                                                       oldProps: TProps,
                                                       newProps: TProps) => void;

interface IPropertyUpdaterMap<TProps, TInstance> {
  [key: string]: {
    updateFunction: IPropertyUpdater<TProps, TInstance, any>,
    updateInitial: boolean,
  };
}

const emptyObject = {};

export abstract class ReactThreeRendererDescriptor<TProps = any,
  TInstance = any,
  TParent = any,
  TChild = never>
  implements INativeElement<TProps,
    TInstance,
    TParent,
    TChild,
    HTMLCanvasElement,
    ReactThreeRenderer> {
  protected propertyDescriptors: IPropertyUpdaterMap<TProps, TInstance>;

  constructor() {
    this.propertyDescriptors = {};
  }

  public commitUpdate(instance: TInstance,
                      updatePayload: TUpdatePayload,
                      oldProps: TProps,
                      newProps: TProps): void {
    for (let keyIndex = 0; keyIndex < updatePayload.length; keyIndex += 2) {
      const key: string = updatePayload[keyIndex];
      const value: any = updatePayload[keyIndex + 1];

      const propertyDescriptor: IPropertyUpdater<TProps, TInstance, any> = this.propertyDescriptors[key].updateFunction;

      if (propertyDescriptor === undefined) {
        throw new Error(`Property updateFunction for ${(instance as any)[r3rFiberSymbol].type}.${key} is not defined.`);
      }

      propertyDescriptor(instance, value, oldProps, newProps);
    }
  }

  public abstract createInstance(props: TProps, rootContainerInstance: HTMLCanvasElement): TInstance;

  public willBeRemovedFromParent(instance: TInstance, parent: TParent): void {
    /* noop by default */
  }

  public willBeRemovedFromContainer(instance: TInstance, container: TParent): void {
    this.willBeRemovedFromParent(instance, container);
  }

  public applyInitialPropUpdates(instance: TInstance, props: TProps) {
    const keys = Object.keys(props);

    for (const key of keys) {
      if (key === "children") {
        continue;
      }

      const value = (props as any)[key];

      const propertyDescriptor = this.propertyDescriptors[key];

      if (propertyDescriptor === undefined) {
        throw new Error(`Property updateFunction for ${(instance as any)[r3rFiberSymbol].type}.${key} is not defined.`);
      }

      if (propertyDescriptor.updateInitial) {
        propertyDescriptor.updateFunction(instance, value, emptyObject as any, props);
      }
    }
  }

  public appendInitialChild(instance: TInstance, child: TChild): void {
    (getDescriptorForInstance(child) as ReactThreeRendererDescriptor).addedToParent(child, instance);
    // throw new Error("tried to append a child initial to " + (instance as any)[r3rFiberSymbol].type);
  }

  public appendChild(instance: TInstance, child: TChild): void {
    (getDescriptorForInstance(child) as ReactThreeRendererDescriptor).addedToParent(child, instance);

    // throw new Error("tried to append a child to " + (instance as any)[r3rFiberSymbol].type);
  }

  public removeChild(instance: TInstance, child: TChild): void {
    getDescriptorForInstance(child).willBeRemovedFromParent(child, instance);

    // throw new Error("tried to remove a child from " + (instance as any)[r3rFiberSymbol].type);
  }

  public appendToContainer(instance: TInstance, container: TParent): void {
    this.addedToParent(instance, container);
  }

  protected abstract addedToParent(instance: TInstance, container: TParent): void;

  protected hasProp<TProp>(propName: string,
                           updateFunction: IPropertyUpdater<TProps, TInstance, TProp>,
                           updateInitial: boolean = true) {
    if (typeof this.propertyDescriptors[name] !== "undefined") {
      throw new Error(`Property type for ${name} is already defined.`);
    }
    this.propertyDescriptors[propName] = {
      updateFunction,
      updateInitial,
    };
  }

  protected hasSimpleProp<TProp>(propName: string, updateInitial: boolean = true) {
    this.propertyDescriptors[propName] = {
      updateFunction(instance: any, newValue: TProp): void {
        (instance as any)[this.key] = newValue;
      },
      updateInitial,
    };
  }
}
