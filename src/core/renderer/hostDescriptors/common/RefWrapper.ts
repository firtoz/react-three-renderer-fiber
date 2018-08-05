import * as React from "react";
import {ReactElement} from "react";
import ReactThreeRenderer from "../../reactThreeRenderer";
import ReactThreeRendererDescriptor from "./ReactThreeRendererDescriptor";

export interface IElement<T, Props> extends React.ReactElement<Props> {
  ref?: React.Ref<T>;
}

export type IRenderableProp<TInstance, TProps> = IElement<TInstance, TProps> | TInstance | null;

export class PropertyWrapper<TInstance, TProp> {
  public onRender: ((instance: TInstance, prop: TProp) => void) | null = null;

  public constructor(public propertyName: string,
                     public rawTypes: Array<new (...args: any[]) => TProp>,
                     public rawTypeUpdateFunction: (instance: TInstance, newValue: TProp) => void) {
  }

  public OnRender(callback: (instance: TInstance, prop: TProp) => void): this {
    this.onRender = callback;
    return this;
  }
}

export class SimplePropertyWrapper<TInstance> extends PropertyWrapper<TInstance, any> {
  public constructor(propertyName: string,
                     types: Array<new (...args: any[]) => any>) {
    super(propertyName, types, (instance: TInstance, prop: any) => {
      (instance as any)[propertyName] = prop;
    });

    this.OnRender((instance, prop) => {
      if (instance !== null) {
        (instance as any)[propertyName] = prop;
      }
    });
  }
}

function containToInstance<TInstance>(instance: TInstance): TInstance {
  return instance;
}

function wrapperContainsRawType(wrapper: PropertyWrapper<any, any>, value: any) {
  return wrapper.rawTypes.some((wrapperType) => value instanceof wrapperType);
}

export class RefWrapperBase {
  public readonly wrappedRefs: {
    [index: string]: React.Ref<any> | null;
  };

  public readonly propertyWrappers: {
    [index: string]: PropertyWrapper<any, any>;
  };

  public readonly elementsCache: any[];

  private readonly refWrappers: {
    [index: string]: (instance: any) => void;
  };

  private readonly internalInstances: {
    [index: string]: any;
  };

  constructor(identifiers: string[], private owner: any = null) {
    this.wrappedRefs = {};
    this.refWrappers = {};
    this.internalInstances = {};
    this.propertyWrappers = {};
    this.elementsCache = [];

    identifiers.forEach((identifier, i) => {
      this.internalInstances[identifier] = null;
      this.wrappedRefs[identifier] = null;
      this.elementsCache[i] = null;

      this.regenerateRef(identifier, null);
    });
  }

  public wrapElementAndReturn<T, TProps>(identifier: string, element: IElement<T, TProps>): ReactElement<TProps> {
    const refFromElement: React.Ref<T> | null = element.ref == null ? null : element.ref;

    const originalKey = element.key == null ? "" : element.key;

    if (this.wrappedRefs[identifier] !== refFromElement) {
      this.regenerateRef(identifier, refFromElement);
    }

    return React.cloneElement(element, {
      key: `${identifier}${originalKey}`,
      ref: this.refWrappers[identifier],
    } as any /* partial props won't match type completely */);
  }

  protected getInstance<T>(identifier: string): T | null {
    return this.internalInstances[identifier] as T;
  }

  private regenerateRef<T>(identifier: string, ref: React.Ref<T> | null) {
    let oldWrappedRef = this.wrappedRefs[identifier];

    this.wrappedRefs[identifier] = ref;

    this.refWrappers[identifier] = (instance: T | null): void => {
      if (oldWrappedRef !== null) {
        (oldWrappedRef as any)(null);

        oldWrappedRef = null;
      }

      if (this.wrappedRefs[identifier] !== null) {
        (this.wrappedRefs[identifier] as any)(instance);
      }

      this.internalInstances[identifier] = instance;

      const propertyWrapper = this.propertyWrappers[identifier];

      if (propertyWrapper != null && propertyWrapper.onRender !== null) {
        propertyWrapper.onRender(this.owner, instance);
      }
    };
  }
}

export class RefWrapper {
  private propertyWrappers: Array<PropertyWrapper<any, any>> = [];
  private readonly refWrapperSymbol: symbol;

  constructor(identifiers: string[], private descriptor: ReactThreeRendererDescriptor) {
    const originalCreateInstance = this.descriptor.createInstance;

    this.refWrapperSymbol = Symbol("ref-wrapper");

    this.descriptor.createInstance = (props: any, rootContainerInstance: any): any => {
      const originalCreation: any = originalCreateInstance.call(this.descriptor, props, rootContainerInstance);

      const refWrapperBase = new RefWrapperBase(identifiers, originalCreation);

      originalCreation[this.refWrapperSymbol] = refWrapperBase;

      this.propertyWrappers.forEach((wrapper) => {
        if (refWrapperBase.wrappedRefs[wrapper.propertyName] === undefined) {
          throw new Error(`Trying to wrap a property that's not an identifier for RefWrapper: ${wrapper.propertyName}.
Identifiers: [${Object.keys(refWrapperBase.wrappedRefs).join(", ")}]`);
        }

        refWrapperBase.propertyWrappers[wrapper.propertyName] = wrapper;
      });

      return originalCreation;
    };
  }

  public wrapProperties<TInstance>(wrappers: Array<PropertyWrapper<TInstance, any>>,
                                   containerFunction: (instance: TInstance) => any = containToInstance) {
    if (this.descriptor === null) {
      throw new Error("Cannot use wrapProperties if a descriptor has not been linked to a refWrapper!");
    }

    const startIndex = this.propertyWrappers.length;

    wrappers.forEach((wrapper) => {
      this.propertyWrappers.push(wrapper);
    });
    const propNames = wrappers.map((wrapper) => wrapper.propertyName);

// TODO
//     if (process.env.NODE_ENV !== "production") {
//       propNames.forEach((propName) => {
//         if (this.wrappedRefs[propName] === undefined) {
//           throw new Error(`Trying to wrap a property that's not an identifier for RefWrapper: ${propName}.
// Identifiers: [${Object.keys(this.wrappedRefs).join(", ")}]`);
//         }
//       });
//     }
//
//     wrappers.forEach((wrapper) => {
//       this.propertyWrappers[wrapper.propertyName] = wrapper;
//     });

    this.descriptor.hasPropGroup(propNames, (instance: TInstance, newMap: any, oldProps: any, newProps: any) => {
      const container = containerFunction(instance);

      const wrapperBase = (instance as any)[this.refWrapperSymbol] as RefWrapperBase;

      wrappers.forEach((wrapper) => {
        const value = newMap[wrapper.propertyName];

        if ((value != null)) {
          if (wrapperContainsRawType(wrapper, value)) {
            wrapper.rawTypeUpdateFunction(instance, value);
          }
        }
      });

      wrappers.forEach((wrapper, i) => {
        const propertyName = wrapper.propertyName;
        const value = newProps[propertyName];

        wrapperBase.elementsCache[startIndex + i] = null;

        if ((value != null)) {
          if (!wrapperContainsRawType(wrapper, value)) {
            wrapperBase.elementsCache[startIndex + i] = wrapperBase.wrapElementAndReturn(propertyName, value);
          }
        }
      });

      ReactThreeRenderer.render(wrapperBase.elementsCache, container, () => {
        wrappers.forEach((wrapper) => {
          const value = newMap[wrapper.propertyName];

          if ((value != null) && (wrapperContainsRawType(wrapper, value))) {
            wrapper.rawTypeUpdateFunction(instance, value);
          }
        });
      });
    });
  }

  public wrapProperty<TInstance, TProp>(wrapper: PropertyWrapper<TInstance, any>,
                                        containerFunction: (instance: TInstance) => any = containToInstance) {
    const elementIndex = this.propertyWrappers.length;

    this.propertyWrappers.push(wrapper);

    this.descriptor.hasProp(wrapper.propertyName, (instance: any, newValue: TProp) => {
      const value = newValue;

      const wrapperBase = (instance as any)[this.refWrapperSymbol] as RefWrapperBase;

      wrapperBase.elementsCache[elementIndex] = null;

      if ((value != null)) {
        if ((wrapperContainsRawType(wrapper, value))) {
          wrapper.rawTypeUpdateFunction(instance, value);
        } else {
          wrapperBase.elementsCache[elementIndex]
            = wrapperBase.wrapElementAndReturn(wrapper.propertyName, value as any);
        }
      }

      ReactThreeRenderer.render(wrapperBase.elementsCache, containerFunction(instance), () => {
        // TODO check how can value has changed?
        if ((value != null) && (wrapperContainsRawType(wrapper, value))) {
          wrapper.rawTypeUpdateFunction(instance, value);
        }
      });
    });
  }
}
