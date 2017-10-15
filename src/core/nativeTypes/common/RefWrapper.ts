import * as React from "react";
import {ReactElement} from "react";

export interface IElement<T, Props> extends React.ReactElement<Props> {
  ref?: React.Ref<T>;
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

  constructor(identifiers: string[]) {
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
