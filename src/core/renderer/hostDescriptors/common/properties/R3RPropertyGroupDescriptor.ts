import {IPropTypeMap} from "../../../../customRenderer/customRenderer";
// tslint:disable-next-line
import CustomPropertyGroupDescriptor from "../../../../customRenderer/descriptors/properties/CustomPropertyGroupDescriptor";
import {PropertyUpdater} from "../../../../customRenderer/descriptors/properties/PropertyUpdater";

export default class R3RPropertyGroupDescriptor<TProps,
  TInstance,
  TProp> extends CustomPropertyGroupDescriptor<TProps,
  TInstance,
  TProp> {
  public defaultValue?: TProp = undefined;
  public wantsRepaint: boolean = false;

  constructor(properties: string[],
              updateFunction: PropertyUpdater<TProps, TInstance, TProp>,
              updateInitial: boolean,
              validatorAcceptor: ((validator: IPropTypeMap) => void) | null) {
    super(properties, updateFunction, updateInitial, validatorAcceptor);
  }

  public withWantsRepaint(value: boolean): this {
    this.wantsRepaint = value;
    return this;
  }
}
