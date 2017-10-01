export interface CustomReactRenderer<TRootContainer> {
  // childType:;
  // test():void;
  // RootContainer = TRootContainer;
}


export interface NativeElement<TProps, T, TParent, TChild, TRoot, TRenderer extends CustomReactRenderer<any>> {
  createInstance(props: TProps, rootContainerInstance: TRoot): T;

  applyInitialPropUpdates(instance: T, props: TProps): void;

  willBeRemovedFromParent(instance: T, parent: TParent): void;

  appendInitialChild(instance: T, child: TChild): void;

  removeChild(instance: T, child: TChild): void;
}
