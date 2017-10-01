import {R3RendererNativeElement} from "./r3rendererNativeElement";

export abstract class SimpleR3RNativeElement<TProps, T, TParent> implements R3RendererNativeElement<TProps,
  TParent,
  T> {

  abstract createInstance(props: TProps): T;

  abstract removedFromParent(parent: TParent): void;

  abstract applyInitialPropUpdates(instance: T, props: TProps): void;
}
