export default interface IReactThreeRendererPropertyDescriptor<TProps, TInstance, TPropType> {
  updateInitial: boolean;

  update(instance: TInstance,
         newValue: TPropType,
         oldProps: TProps,
         newProps: TProps): void;

}

export abstract class PropertyDescriptorBase<TProps, TInstance, TPropType>
  implements IReactThreeRendererPropertyDescriptor<TProps, TInstance, TPropType> {

  public constructor(public updateInitial: boolean = true) {

  }

  public abstract update(instance: TInstance,
                         newValue: TPropType,
                         oldProps: TProps,
                         newProps: TProps): void;
}
