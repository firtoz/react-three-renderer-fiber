import {INativeElement} from "../../customRenderer/customRenderer";
import {TUpdatePayload} from "../../renderer/fiberRenderer/prepareUpdate";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";
import r3rFiberSymbol from "../../renderer/utils/r3rFiberSymbol";
import IReactThreeRendererPropertyDescriptor, {PropertyDescriptorBase} from "./IPropertyDescriptor";

interface IPropertyDescriptor<TProps, TInstance, TPropType> {
  update(instance: TInstance,
         newValue: TPropType,
         oldProps: TProps,
         newProps: TProps): void;
}

interface IPropertyDescriptorMap<TProps, TInstance> {
  [key: string]: PropertyDescriptorBase<TProps, TInstance, any>;
}

class SimplePropertyDescriptor<TPropType> implements IReactThreeRendererPropertyDescriptor<any,
  any,
  TPropType> {
  constructor(private key: string, public updateInitial: boolean) {
  }

  public update(instance: any, newValue: TPropType, oldProps: any, newProps: any): void {
    (instance as any)[this.key] = newValue;
  }
}

const emptyObject = {};

export type DescriptorType<TProps,
  TInstance,
  TProp> = new (initialUpdate: boolean) => PropertyDescriptorBase<TProps,
  TInstance,
  TProp>;

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
  protected propertyDescriptors: IPropertyDescriptorMap<TProps, TInstance>;

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

      const propertyDescriptor: IPropertyDescriptor<TProps, TInstance, any> = this.propertyDescriptors[key];

      if (propertyDescriptor === undefined) {
        throw new Error(`Property descriptor for ${(instance as any)[r3rFiberSymbol].type}.${key} is not defined.`);
      }

      propertyDescriptor.update(instance, value, oldProps, newProps);
    }
  }

  public abstract createInstance(props: TProps, rootContainerInstance: HTMLCanvasElement): TInstance;

  public willBeRemovedFromParent(instance: TInstance, parent: TParent): void {
    /* noop by default */
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
        throw new Error(`Property descriptor for ${(instance as any)[r3rFiberSymbol].type}.${key} is not defined.`);
      }

      if (propertyDescriptor.updateInitial) {
        propertyDescriptor.update(instance, value, emptyObject as any, props);
      }
    }
  }

  public appendInitialChild(instance: TInstance, child: TChild): void {
    throw new Error("tried to append a child to " + (instance as any)[r3rFiberSymbol].type);
  }

  public appendChild(instance: TInstance, child: TChild): void {
    throw new Error("tried to append a child to " + (instance as any)[r3rFiberSymbol].type);
  }

  public removeChild(instance: TInstance, child: TChild): void {
    throw new Error("tried to remove a child from " + (instance as any)[r3rFiberSymbol].type);
  }

  public abstract appendToContainer(instance: TInstance, container: TParent): void;

  protected hasProp<TProp>(propName: string,
                           descriptor: DescriptorType<TProps, TInstance, TProp>,
                           updateInitial: boolean = true) {
    if (typeof this.propertyDescriptors[name] !== "undefined") {
      throw new Error(`Property type for ${name} is already defined.`);
    }
    this.propertyDescriptors[propName] = new descriptor(updateInitial);
  }

  protected hasSimpleProp<TProp>(propName: string, updateInitial: boolean = true) {
    this.propertyDescriptors[propName] = new SimplePropertyDescriptor(propName, updateInitial);
  }
}
