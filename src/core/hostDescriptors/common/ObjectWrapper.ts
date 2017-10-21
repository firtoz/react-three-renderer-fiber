import r3rContextSymbol from "../../renderer/utils/r3rContextSymbol";
import {
  PropertyGroupDescriptor,
  ReactThreeRendererDescriptor,
  ReactThreeRendererPropertyDescriptor,
} from "./ReactThreeRendererDescriptor";

type GetterFunction = () => any;
type SetterFunction = (value: any) => void;

const remountGroupName = "#r3r-remount#";

export interface IWrapperType<TProps, TWrapped, TWrapperDetails extends WrapperDetails<TProps, TWrapped>> {
  new(props: TProps): TWrapperDetails;

  get(wrapper: TWrapped): TWrapperDetails;

  set(wrapper: TWrapped, details: TWrapperDetails): void;

  getWrappedType(): new () => any;
}

function createGetterFromExisting(instance: any, getFunction: GetterFunction): GetterFunction {
  return () => {
    return getFunction.call(instance);
  };
}

function createGetter(instance: any, propertyName: string): GetterFunction {
  return () => {
    return (instance)[propertyName];
  };
}

function createSetterFromExisting(instance: any, setFunction: SetterFunction): SetterFunction {
  return (value: any) => {
    return setFunction.call(instance, value);
  };
}

function createSetter(instance: any, propertyName: string): SetterFunction {
  return (value: any) => {
    (instance)[propertyName] = value;
  };
}

const wrapperDetailsSymbol = Symbol("react-three-renderer-details");
const wrapperSymbol = Symbol("react-three-renderer-wrapper");

export function getWrappedAttributes(property: PropertyDescriptor,
                                     objectToWrap: any,
                                     propertyName: string): PropertyDescriptor {
  const attributes: PropertyDescriptor = {
    configurable: true,
    enumerable: property.enumerable,
  };

  if (property.set !== undefined) {
    attributes.set = createSetterFromExisting(objectToWrap, property.set);
  } else if (property.writable !== undefined && property.writable) {
    attributes.set = createSetter(objectToWrap, propertyName);
  }

  if (property.get !== undefined) {
    attributes.get = createGetterFromExisting(objectToWrap, property.get);
  } else {
    attributes.get = createGetter(objectToWrap, propertyName);
  }
  return attributes;
}

export abstract class WrapperDetails<TProps, TWrapped> {
  public static get<TProps,
    TWrapped,
    TWrapperDetails extends WrapperDetails<TProps, TWrapped>>(this: { new(...args: any[]): TWrapperDetails },
                                                              wrapper: TWrapped): TWrapperDetails {
    return (wrapper as any)[wrapperDetailsSymbol];
  }

  public static set<TProps,
    TWrapped,
    TWrapperDetails extends WrapperDetails<TProps, TWrapped>>(this: { new(...args: any[]): TWrapperDetails },
                                                              wrapper: TWrapped,
                                                              details: TWrapperDetails): void {
    details.wrapper = wrapper;
    (wrapper as any)[wrapperDetailsSymbol] = details;
  }

  public static getWrappedType<TProps,
    TWrapped,
    TWrapperDetails extends WrapperDetails<TProps,
      TWrapped>>(this: { new(...args: any[]): TWrapperDetails }): new () => any {
    if (typeof (this as any)[wrapperSymbol] === "undefined") {
      (this as any)[wrapperSymbol] = class {
      };
    }

    return (this as any)[wrapperSymbol];
  }

  public wrappedObject: TWrapped | null;
  public wrapper: any;

  constructor(public props: TProps) {
    const staticType = (this.constructor as IWrapperType<TProps, TWrapped, any>);

    staticType.set(new (staticType.getWrappedType())(), this);
  }

  public wrapObject(objectToWrap: TWrapped) {
    this.wrappedObject = objectToWrap;

    let current = objectToWrap;
    do {
      Object.getOwnPropertyNames(current)
        .forEach((propertyName: string) => {
          if (propertyName === "constructor") {
            return;
          }

          const property = Object.getOwnPropertyDescriptor(current, propertyName);
          const attributes = getWrappedAttributes(property, objectToWrap, propertyName);

          Object.defineProperty(this.wrapper, propertyName, attributes);
        });

      current = Object.getPrototypeOf(current);
    } while (current.constructor !== Object && current !== null);

  }

  public remount(newProps: any) {
    this.wrapObject(this.recreateInstance(newProps));

    if (this.wrapper[r3rContextSymbol] !== undefined) {
      // console.log("triggering a render for context", this.wrapper[r3rContextSymbol]);
      this.wrapper[r3rContextSymbol].triggerRender();
    }
  }

  public abstract addedToParent(instance: TWrapped, parentInstance: any): boolean;

  public abstract addedToParentBefore(instance: TWrapped, parentInstance: any, before: any): boolean;

  public abstract willBeRemovedFromParent(instance: TWrapped, container: any): void;

  protected abstract recreateInstance(newProps: any): TWrapped;
}

export class WrappedEntityDescriptor<TProps = any,
  TInstance = any,
  TParent = any,
  TChild = never,
  TWrapper extends WrapperDetails<TProps, TInstance> = any> extends ReactThreeRendererDescriptor<TProps,
  TInstance,
  TParent,
  TChild> {
  private remountTrigger: (instance: TInstance,
                           newValue: any,
                           oldProps: TProps,
                           newProps: TProps) => void;

  constructor(private wrapperType: IWrapperType<TProps, TInstance, TWrapper>,
              private typeToWrap: any,
              private delayPropUpdatesUntilMount = false) {
    super();

    const wrappedType = wrapperType.getWrappedType();

    let current = typeToWrap;
    while (current !== null && current !== Object) {
      const currentInstanceOf = current[Symbol.hasInstance];

      const currentType = current;

      Object.defineProperty(currentType, Symbol.hasInstance, {
        configurable: true,
        value: (type: any) => {
          // yes let's completely abuse javascript
          return currentInstanceOf.call(currentType, type) || type instanceof wrappedType;
        },
      });

      current = Object.getPrototypeOf(current.prototype).constructor;
    }

    const remountFunction = (instance: TInstance, newProps: TProps) => {
      this.remount(instance, newProps);
    };

    this.remountTrigger = (instance: TInstance,
                           newValue: any,
                           oldProps: TProps,
                           newProps: TProps) => {
      remountFunction(instance, newProps);
    };
  }

  public createInstance(props: TProps, rootContainerInstance: any): any {
    return new this.wrapperType(props).wrapper;
  }

  public internalApplyInitialPropUpdates(instance: TInstance, props: TProps): void {
    if (!this.delayPropUpdatesUntilMount) {
      super.internalApplyInitialPropUpdates(instance, props);
    }
  }

  public addedToParent(instance: TInstance, parentInstance: any): void {
    const wrapperDetails = this.wrapperType.get(instance);

    if (wrapperDetails.addedToParent(instance, parentInstance) && this.delayPropUpdatesUntilMount) {
      super.internalApplyInitialPropUpdates(instance, wrapperDetails.props);
    }
  }

  public addedToParentBefore(instance: TInstance, parentInstance: TParent, before: any): void {
    const wrapperDetails = this.wrapperType.get(instance);

    wrapperDetails.addedToParentBefore(instance, parentInstance, before);

    if (this.delayPropUpdatesUntilMount) {
      super.internalApplyInitialPropUpdates(instance, wrapperDetails.props);
    }
  }

  public willBeRemovedFromParentInternal(instance: TInstance, parent: TParent): void {
    // super.willBeRemovedFromParentInternal(instance, parent);
    const wrapperDetails = this.wrapperType.get(instance);

    wrapperDetails.willBeRemovedFromParent(instance, parent);
  }

  protected hasRemountProps(...propNames: string[]): void {
    if (this.propertyGroups[remountGroupName] === undefined) {
      this.propertyGroups[remountGroupName] = new PropertyGroupDescriptor(
        [],
        this.remountTrigger,
        false,
        true);
    }

    for (const propName of propNames) {
      this.propertyGroups[remountGroupName].properties.push(propName);

      if (typeof this.propertyDescriptors[propName] !== "undefined") {
        throw new Error(`Property type for ${propName} is already defined.`);
      }

      this.propertyDescriptors[propName] = new ReactThreeRendererPropertyDescriptor(
        remountGroupName,
        null,
        false,
        false,
      );
    }
  }

  private remount(instance: TInstance, newProps: TProps) {
    this.wrapperType.get(instance).remount(newProps);

    super.internalApplyInitialPropUpdates(instance, newProps);
  }
}
