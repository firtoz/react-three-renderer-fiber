import {IPropTypeMap} from "../../../../customRenderer/customRenderer";
import isNonProduction from "../../../../customRenderer/utils/isNonProduction";
import {PropertyUpdater} from "./PropertyUpdater";

export default class PropertyGroupDescriptor<TProps, TInstance, TProp> {
  public defaultValue?: TProp = undefined;

  constructor(public properties: string[],
              public updateFunction: PropertyUpdater<TProps, TInstance, TProp>,
              public updateInitial: boolean,
              public wantsRepaint: boolean,
              private validatorAcceptor: ((validator: IPropTypeMap) => void) | null) {
  }

  public withDefault(defaultValue: TProp): this {
    this.defaultValue = defaultValue;

    if (isNonProduction) {
      const keys = Object.keys(defaultValue);

      const missingPropertyNames = this.properties.filter((propName) => !defaultValue.hasOwnProperty(propName));
      if (missingPropertyNames.length > 0) {
        console.warn(`${this.constructor.name} is declaring a property group with properties ` +
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
