import * as React from "react";
import {ReactElement} from "react";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";
import ReactThreeRendererDescriptor from "./ReactThreeRendererDescriptor";

export interface IElement<T, Props> extends React.ReactElement<Props> {
  ref?: React.Ref<T>;
}

export type IRenderableProp<TInstance, TProps> = IElement<TInstance, TProps> | TInstance | null;

export class PropertyWrapper<TInstance, TProp> {
  public constructor(public propertyName: string,
                     public type: new (...args: any[]) => TProp,
                     public updateFunction: (instance: TInstance, newValue: TProp) => void) {
  }
}

export class SimplePropertyWrapper<TInstance> extends PropertyWrapper<TInstance, any> {
  public constructor(propertyName: string,
                     type: new (...args: any[]) => any) {
    super(propertyName, type, (instance: TInstance, prop: any) => {
      (instance as any)[propertyName] = prop;
    });
  }
}

function containToInstance<TInstance>(instance: TInstance): TInstance {
  return instance;
}

export class RefWrapper {
  private wrappedRefs: {
    [index: string]: React.Ref<any> | null;
  };

  private refWrappers: {
    [index: string]: (instance: any) => void;
  };

  private internalInstances: {
    [index: string]: any;
  };

  constructor(identifiers: string[], private descriptor: ReactThreeRendererDescriptor | null = null) {
    /* */
    this.wrappedRefs = {};
    this.refWrappers = {};
    this.internalInstances = {};

    identifiers.forEach((identifier: string) => {
      this.internalInstances[identifier] = null;
      this.wrappedRefs[identifier] = null;

      this.regenerateRef(identifier, null);
    });
  }

  public getInstance<T>(identifier: string): T | null {
    return this.internalInstances[identifier] as T;
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

  public wrapProperties<TInstance>(wrappers: Array<PropertyWrapper<TInstance, any>>,
                                   containerFunction: (instance: TInstance) => any = containToInstance) {
    if (this.descriptor === null) {
      throw new Error("Cannot use wrapProperties if a descriptor has not been linked to a refWrapper!");
    }

    this.descriptor.hasPropGroup(wrappers.map((wrapper) => wrapper.propertyName), (instance: any, newMap: any) => {
      const container = containerFunction(instance);

      const elements: Array<React.ReactElement<any> | null> = [];

      wrappers.forEach((wrapper, i) => {
        const propertyName = wrapper.propertyName;
        const value = newMap[propertyName];

        let valueElement: React.ReactElement<any> | null = null;

        if ((value != null)) {
          if ((value instanceof wrapper.type)) {
            wrapper.updateFunction(instance, value);
          } else {
            valueElement = this.wrapElementAndReturn(propertyName, value);
          }
        }

        elements[i] = valueElement;
      });

      ReactThreeRenderer.render(elements, container, () => {
        wrappers.forEach((wrapper, i) => {
          const value = newMap[wrapper.propertyName];

          if ((value != null) && (value instanceof wrapper.type)) {
            wrapper.updateFunction(instance, value);
          }
        });
      });
    });
  }

  public wrapProperty<TInstance, TProp>(wrapper: PropertyWrapper<TInstance, any>,
                                        containerFunction: (instance: TInstance) => any = containToInstance) {
    // singular form of wrapProperties

    if (this.descriptor === null) {
      throw new Error("Cannot use wrapProperty if a descriptor has not been linked to a refWrapper!");
    }

    const {
      propertyName: propName,
      type: propType,
      updateFunction,
    } = wrapper;

    this.descriptor.hasProp(propName, (instance: any, newValue: TProp) => {
      const value = newValue;

      let valueElement: React.ReactElement<any> | null = null;

      if ((value != null)) {
        if ((value instanceof propType)) {
          updateFunction(instance, value);
        } else {
          valueElement = this.wrapElementAndReturn(propName, value);
        }
      }

      ReactThreeRenderer.render(valueElement, containerFunction(instance), () => {
        if ((value != null) && (value instanceof propType)) {
          updateFunction(instance, value);
        }
      });
    });
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
    };
  }
}
