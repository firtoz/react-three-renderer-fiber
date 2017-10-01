export interface CustomReactRenderer<TRootContainer> {
  // childType:;
  // test():void;
  // RootContainer = TRootContainer;
}

interface InstanceInterface {
  foo: string;

  bar(): string;
}


interface ClassInterface {
  // the constructor shape
  new (foo: string): InstanceInterface;

  // default static method
  baz(): void;
}

export interface NativeElement<TProps, Parent, T, TRenderer extends CustomReactRenderer<any>> {
  createInstance(props: TProps, rootContainerInstance: HTMLCanvasElement): T;

  applyInitialPropUpdates(instance: T, props: TProps): void;

  removedFromParent(parent: Parent): void;
}
