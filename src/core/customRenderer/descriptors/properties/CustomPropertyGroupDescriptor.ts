import {IPropTypeMap} from "../../IReconcilerConfig";
import isNonProduction from "../../utils/isNonProduction";
import {PropertyUpdater} from "./PropertyUpdater";

export default class CustomPropertyGroupDescriptor<TProps, TInstance, TProp> {
  public defaultValue?: TProp = undefined;

  public withErrorName: (errorName: string) => this;

  private errorName: string;

  constructor(public properties: string[],
              public updateFunction: PropertyUpdater<TProps, TInstance, TProp>,
              public updateInitial: boolean,
              private validatorAcceptor: ((validator: IPropTypeMap) => void) | null) {

    if (isNonProduction) {
      this.errorName = (this as any).__proto__.constructor.name;

      this.withErrorName = (errorName: string) => {
        this.errorName = errorName;
        return this;
      };
    }
  }

  public withDefault(defaultValue: TProp): this {
    this.defaultValue = defaultValue;

    if (isNonProduction) {
      const keys = Object.keys(defaultValue);

      const missingPropertyNames = this.properties.filter((propName) => !defaultValue.hasOwnProperty(propName));
      if (missingPropertyNames.length > 0) {
        console.warn(`${this.errorName} is declaring a property group with properties ` +
          `[${this.properties.map((propertyName: string) => {
            return `"${propertyName}"`;
          }).join(", ")}] with default values, but is missing the default values for [${
            missingPropertyNames
              .map((propertName) => `"${propertName}"`)
              .join(", ")}].`);
      }
    }
    // TODO in non prod check if prop types match for default values

    return this;
  }

  public withTypes(validator: IPropTypeMap): this {
    if (this.validatorAcceptor === null) {
      throw new Error("This property group cannot have type validation");
    }

    this.validatorAcceptor(validator);

    return this;
  }
}
