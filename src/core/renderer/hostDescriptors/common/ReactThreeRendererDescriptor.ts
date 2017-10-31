import {Validator} from "prop-types";
import {TUpdatePayload} from "../../../customRenderer/createReconciler";
import {IPropTypeMap} from "../../../customRenderer/customRenderer";
import {CustomDescriptor} from "../../../customRenderer/descriptors/CustomDescriptor";
import ReactThreeRenderer from "../../reactThreeRenderer";
import PropertyGroupDescriptor from "./properties/PropertyGroupDescriptor";
import {PropertyUpdater} from "./properties/PropertyUpdater";
import ReactThreeRendererPropertyDescriptor from "./properties/ReactThreeRendererPropertyDescriptor";

const emptyObject: any = {};

function final(instanceParameterIndex: number = 0): any {
  return (target: any,
          propertyKey: string,
          descriptor: PropertyDescriptor): void => {
    descriptor.writable = false;
    descriptor.configurable = false;
  };
}

/**
 * A base type for all ReactThreeRenderer element descriptors.
 */
export default abstract class ReactThreeRendererDescriptor< //
  /**
   * @typedef {any} ReactThreeRendererDescriptor.TProps
   * @type ReactThreeRendererDescriptor.TProps
   * The expected property types to be used for createInstance and property updates.
   */
  TProps = any,
  /**
   * @typedef {any} ReactThreeRendererDescriptor.TInstance
   * @type ReactThreeRendererDescriptor.TInstance
   * The instance type to be created and updated.
   */
  TInstance = any,
  /**
   * @typedef {any} ReactThreeRendererDescriptor.TParent
   * @type ReactThreeRendererDescriptor.TParent
   * The parent types that the host instances can be mounted into.
   */
  TParent = any,
  /**
   * @typedef {any} ReactThreeRendererDescriptor.TParent
   * @type ReactThreeRendererDescriptor.TParent
   * The types of objects the host instance will accept as children.
   */
  TChild = any>
  extends CustomDescriptor<TProps,
    TInstance,
    TParent,
    TChild,
    HTMLCanvasElement,
    ReactThreeRenderer> {
  constructor(public wantsRepaint: boolean = true) {
    super();

    // TODO define all mounting/unmounting properties as nonconfigurable
    // TODO and they should trigger render if necessary
    // TODO and also test
  }

  /**
   *
   * @param {TInstance} instance
   * @param {TUpdatePayload} updatePayload
   * @param {TProps} oldProps
   * @param {TProps} newProps
   * @return {boolean} Whether a repaint will be necessary
   */
  public commitUpdate(instance: TInstance,
                      updatePayload: TUpdatePayload,
                      oldProps: TProps,
                      newProps: TProps): boolean {
    const groupedUpdates: {
      [groupName: string]: {
        [propertyName: string]: any;
      },
    } = {};

    const groupNamesToUpdate: string[] = [];

    let wantsRepaint = false;

    for (let keyIndex = 0; keyIndex < updatePayload.length; keyIndex += 2) {
      const key: string = updatePayload[keyIndex];
      const value: any = updatePayload[keyIndex + 1];
      if (this.updateProperty(key, groupedUpdates, groupNamesToUpdate, value, instance, oldProps, newProps, false)) {
        wantsRepaint = true;
      }
    }

    for (const groupName of groupNamesToUpdate) {
      const newData = groupedUpdates[groupName];

      const propertyGroup = this.propertyGroups[groupName];
      propertyGroup.updateFunction(instance, newData, oldProps, newProps);
      if (propertyGroup.wantsRepaint) {
        wantsRepaint = true;
      }
    }

    return this.wantsRepaint && wantsRepaint;
  }

  /**
   * Allows you to define an update function for a single property.
   * @param {string} propName
   * The name of the property
   * @param {PropertyUpdater<TProps, TInstance, TProp>}updateFunction
   * Handle updating of the property here.
   * @param {boolean} updateInitial
   * Does this property need to be updated right after createInstance?
   * @param {boolean} wantsRepaint
   * Should the modification of this property trigger a re-render?
   */
  public hasProp< //
    /**
     * The property type to be updated.
     */
    TProp>(propName: string,
           updateFunction: PropertyUpdater<TProps, TInstance, TProp>,
           updateInitial: boolean = true,
           wantsRepaint: boolean = true): ReactThreeRendererPropertyDescriptor<TProps, TInstance, TProp> {
    if (this.propertyDescriptors[propName] !== undefined) {
      throw new Error(`Property type for ${this.constructor.name}#${propName} is already defined.`);
    }
    const propertyDescriptor = new ReactThreeRendererPropertyDescriptor<TProps, TInstance, TProp>(
      null,
      updateFunction,
      updateInitial,
      wantsRepaint,
      (validator: Validator<TProp>) => {
        this.propTypes[propName] = validator;
      },
    );

    this.propertyDescriptors[propName] = propertyDescriptor;

    return propertyDescriptor;
  }

  /**
   * Helps to update multiple properties at once.
   * @param {string[]} propNames
   * The names of the properties
   * @param {PropertyUpdater<TProps, TInstance, TPropMap>} updateFunction
   * Similar to `hasProp`s updateFunction, but it will expect a key-value pair of `propertyName` to `newValue`
   * @param {boolean} updateInitial
   * Handle updating of the property here.
   * @param {boolean} wantsRepaint
   * Does this property need to be updated right after createInstance?
   */
  public hasPropGroup<TPropMap>(propNames: string[],
                                updateFunction: PropertyUpdater<TProps, TInstance, TPropMap>,
                                updateInitial: boolean = true,
                                wantsRepaint: boolean = true): PropertyGroupDescriptor<TProps, TInstance, TPropMap> {
    const groupName = propNames.join(",");

    this.propertyGroups[groupName] = new PropertyGroupDescriptor(
      propNames,
      updateFunction,
      updateInitial,
      wantsRepaint,
      (validatorMap: IPropTypeMap) => {
        const missingKeys = propNames.concat().reduce((map, name) => {
          map[name] = true;
          return map;
        }, {} as { [index: string]: boolean });

        const errors: string[] = [];

        Object.keys(validatorMap).forEach((propName: string) => {
          if (missingKeys[propName] === true) {
            missingKeys[propName] = false;
          } else {
            errors.push(
              `Found property type for unknown property "${propName}"`);
          }
          this.propTypes[propName] = validatorMap[propName];
        });

        propNames.forEach((propName) => {
          if (missingKeys[propName]) {
            errors.push(`Missing type for property "${propName}"`);
          }
        });

        if (errors.length > 0) {
          throw new Error(`Property group for [${propNames
            .map((name) => `"${name}"`)
            .join(", ")}] has mismatching types:\n` + errors.join("\n"));
        }
      },
    );

    propNames.forEach((propName) => {
      if (typeof this.propertyDescriptors[propName] !== "undefined") {
        throw new Error(`Property type for ${propName} is already defined.`);
      }

      this.propertyDescriptors[propName] = new ReactThreeRendererPropertyDescriptor(
        groupName,
        null,
        false,
        false,
        null,
      );
    });

    return this.propertyGroups[groupName];
  }

  /**
   * Declares that this property can be updated with simple assignments.
   * @param {string} propName
   * The name of the property
   * @param {boolean} updateInitial
   * Does this property need to be updated right after createInstance?
   * @param {boolean} wantsRepaint
   * Should the modification of this property trigger a re-render?
   */
  protected hasSimpleProp(propName: string,
                          updateInitial: boolean = true,
                          wantsRepaint: boolean = true): ReactThreeRendererPropertyDescriptor<TProps, TInstance, any> {
    return this.hasProp(propName, (instance: any, newValue: any): void => {
      (instance as any)[propName] = newValue;
    }, updateInitial, wantsRepaint);
  }

  protected updateProperty(propName: string,
                           groupedUpdates: { [p: string]: { [p: string]: any } },
                           groupNamesToUpdate: null | (string[]),
                           value: any,
                           instance: TInstance,
                           oldProps: TProps,
                           newProps: TProps,
                           isInitialUpdate: boolean): boolean {
    super.updateProperty(propName,
      groupedUpdates,
      groupNamesToUpdate,
      value,
      instance,
      oldProps,
      newProps,
      isInitialUpdate);

    const propertyDescriptor: ReactThreeRendererPropertyDescriptor<TProps, TInstance, any> | undefined
      = this.propertyDescriptors[propName];
    if (propertyDescriptor === undefined) {
      throw new Error(`Cannot find property descriptor for ${this.constructor.name}#${propName}`);
    }

    return propertyDescriptor.wantsRepaint;
  }
}
