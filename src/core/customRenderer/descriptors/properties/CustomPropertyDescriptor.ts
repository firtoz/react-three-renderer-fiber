import {Validator} from "prop-types";
import {PropertyUpdater} from "./PropertyUpdater";

export default class CustomPropertyDescriptor<TProps, TInstance, TProp> {
  public defaultValue?: TProp = undefined;

  constructor(public groupName: string | null,
              public updateFunction: PropertyUpdater<TProps, TInstance, TProp> | null,
              public updateInitial: boolean,
              private validatorAcceptor: ((validator: Validator<TProp>) => void) | null) {

  }

  public withDefault(defaultValue: TProp): this {
    this.defaultValue = defaultValue;

    return this;
  }

  public withType(validator: Validator<TProp>): this {
    if (this.validatorAcceptor === null) {
      throw new Error("This property cannot have type validation");
    }

    this.validatorAcceptor(validator);

    return this;
  }
}
