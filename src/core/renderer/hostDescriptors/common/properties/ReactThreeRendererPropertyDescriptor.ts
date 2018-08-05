import {Validator} from "prop-types";
import CustomPropertyDescriptor from "../../../../customRenderer/descriptors/properties/CustomPropertyDescriptor";
import {PropertyUpdater} from "../../../../customRenderer/descriptors/properties/PropertyUpdater";

export default class ReactThreeRendererPropertyDescriptor<TProps, TInstance, TProp>
  extends CustomPropertyDescriptor<TProps, TInstance, TProp> {
  public defaultValue?: TProp = undefined;
  public wantsRepaint: boolean = false;

  constructor(groupName: string | null,
              updateFunction: PropertyUpdater<TProps, TInstance, TProp> | null,
              updateInitial: boolean,
              validatorAcceptor: ((validator: Validator<TProp | undefined | null>) => void) | null) {
    super(groupName, updateFunction, updateInitial, validatorAcceptor);
  }

  public withWantsRepaint(value: boolean): this {
    this.wantsRepaint = value;

    return this;
  }
}
