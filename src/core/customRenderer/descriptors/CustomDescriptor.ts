import {Validator} from "prop-types";
import PropertyGroupDescriptor from "../../renderer/hostDescriptors/common/properties/PropertyGroupDescriptor";
import {PropertyUpdater} from "../../renderer/hostDescriptors/common/properties/PropertyUpdater";
// tslint:disable-next-line
import ReactThreeRendererPropertyDescriptor from "../../renderer/hostDescriptors/common/properties/ReactThreeRendererPropertyDescriptor";
import {TUpdatePayload} from "../createReconciler";
import {INativeElement, IPropTypeMap} from "../customRenderer";
import isNonProduction from "../utils/isNonProduction";

// TODO remove more "three" references

export interface IPropertyUpdaterMap<TProps, TInstance> {
  [key: string]: ReactThreeRendererPropertyDescriptor<TProps, TInstance, any> | undefined;
}

export interface IPropertyGroupMap<TProps, TInstance> {
  [key: string]: PropertyGroupDescriptor<TProps, TInstance, any>;
}

function final(instanceParameterIndex: number = 0): any {
  return (target: any,
          propertyKey: string,
          descriptor: PropertyDescriptor): void => {
    descriptor.writable = false;
    descriptor.configurable = false;
  };
}

const emptyObject: any = {};

export abstract class CustomDescriptor< //
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
  TChild = any,
  TPropertyDescriptor = any,
  TRoot = any,
  TRenderer = any>
  implements INativeElement<TProps,
    TInstance,
    TParent,
    TChild,
    TRoot,
    TRenderer> {

  public propTypes: IPropTypeMap;

  protected propertyDescriptors: IPropertyUpdaterMap<TProps, TInstance>;
  protected propertyGroups: IPropertyGroupMap<TProps, TInstance>;

  constructor() {
    this.propertyDescriptors = {};
    this.propertyGroups = {};
    this.propTypes = {};
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
                      newProps: TProps): void {
    const groupedUpdates: {
      [groupName: string]: {
        [propertyName: string]: any;
      },
    } = {};

    const groupNamesToUpdate: string[] = [];

    for (let keyIndex = 0; keyIndex < updatePayload.length; keyIndex += 2) {
      const key: string = updatePayload[keyIndex];
      const value: any = updatePayload[keyIndex + 1];
      this.updateProperty(key, groupedUpdates, groupNamesToUpdate, value, instance, oldProps, newProps, false);
    }

    for (const groupName of groupNamesToUpdate) {
      const newData = groupedUpdates[groupName];

      const propertyGroup = this.propertyGroups[groupName];
      propertyGroup.updateFunction(instance, newData, oldProps, newProps);
    }
  }

  /**
   * This function should create a host instance using the properties.
   * @param {TProps} props
   * The properties of the element
   * @param {any} rootContainerInstance
   * The object that `ReactTHREERenderer.render` was called upon.
   * @return {TInstance} The new host instance
   */
  public abstract createInstance(props: TProps, rootContainerInstance: any): TInstance;

  public willBeRemovedFromParent(instance: TInstance, parent: TParent): void {
    // NO-OP
  }

  // Use "parent" behaviour for containers to keep things simple.
  @final()
  public willBeRemovedFromContainer(instance: TInstance, container: TParent): void {
    if (isNonProduction) {
      throw new Error("Containers are treated as parents for ReactThreeRenderer");
    }
  }

  @final()
  public insertInContainerBefore(instance: TInstance, container: TParent, before: any): void {
    if (isNonProduction) {
      throw new Error("Containers are treated as parents for ReactThreeRenderer");
    }
  }

  @final()
  public appendToContainer(instance: TInstance, container: TParent): void {
    if (isNonProduction) {
      throw new Error("Containers are treated as parents for ReactThreeRenderer");
    }
  }

  public applyInitialPropUpdates(instance: TInstance, props: TProps): void {
    const groupedUpdates: {
      [groupName: string]: {
        [propertyName: string]: any;
      },
    } = {};

    const allDescriptorNamesWithDefaultValuesMissingFromProps = Object.keys(this.propertyDescriptors)
      .filter((key: string) => {
        const descriptor = (this.propertyDescriptors[key] as any);

        return (props as any)[key] === undefined &&
          descriptor.updateInitial &&
          descriptor.defaultValue !== undefined;
      });

    const groupNamesToUpdate: string[] = [];

    const keys = Object.keys(props);
    for (const key of keys) {
      if (key === "children") {
        continue;
      }

      const value = (props as any)[key];

      this.updateProperty(key, groupedUpdates, groupNamesToUpdate, value, instance, emptyObject, props, true);
    }

    const updatedGroupsMap: {
      [idx: string]: boolean,
    } = {};

    for (const groupName of groupNamesToUpdate) {
      updatedGroupsMap[groupName] = true;

      const newData = groupedUpdates[groupName];

      if (this.propertyGroups[groupName].updateInitial) {
        this.propertyGroups[groupName].updateFunction(instance, newData, emptyObject, props);
      }
    }

    allDescriptorNamesWithDefaultValuesMissingFromProps.forEach((name) => {
      const value = (this.propertyDescriptors[name] as any).defaultValue;

      this.updateProperty(name, groupedUpdates, null, value, instance, emptyObject, props, true);
    });

    const allGroupNamesWithDefaultValuesMissingFromProps = Object.keys(this.propertyGroups)
      .filter((key: string) => {
        const groupDescriptor = (this.propertyGroups[key] as any);

        return updatedGroupsMap[key] !== true &&
          groupDescriptor.updateInitial &&
          groupDescriptor.defaultValue !== undefined;
      });

    for (const groupName of allGroupNamesWithDefaultValuesMissingFromProps) {
      const newData = (this.propertyGroups[groupName] as any).defaultValue;

      this.propertyGroups[groupName].updateFunction(instance, newData, emptyObject, props);
    }
  }

  public appendInitialChild(instance: TInstance, child: TChild): void {
    /* */
  }

  public appendChild(instance: TInstance, child: TChild): void {
    /* */
  }

  public insertBefore(parentInstance: TInstance, childInstance: TChild, before: TChild): void {
    /* */
  }

  public willBeAddedToParentBefore(instance: TInstance, parentInstance: TParent, before: any): void {
    this.willBeAddedToParent(instance, parentInstance);
  }

  // What does it mean for this object to be added into a parent, (as a last sibling)?
  // For example, geometries and materials can set parent.material = instance
  //              and object types can ensure they are added as children
  // TODO ensure somehow that this does not get overwritten...
  // TODO google: "typescript (or javascript) final method or function"
  public willBeAddedToParent(instance: TInstance, parent: TParent): void {
    // NO-OP
  }

  public removeChild(instance: TInstance, child: TChild): void {
    // throw new Error("tried to remove a child from " + (instance as any)[r3rFiberSymbol].type);
  }

  /**
   * Allows you to define an update function for a single property.
   * @param {string} propName
   * The name of the property
   * @param {PropertyUpdater<TProps, TInstance, TProp>}updateFunction
   * Handle updating of the property here.
   * @param {boolean} updateInitial
   * Does this property need to be updated right after createInstance?
   */
  public hasProp< //
    /**
     * The property type to be updated.
     */
    TProp>(propName: string,
           updateFunction: PropertyUpdater<TProps, TInstance, TProp>,
           updateInitial: boolean = true): ReactThreeRendererPropertyDescriptor<TProps, TInstance, TProp> {
    if (this.propertyDescriptors[propName] !== undefined) {
      throw new Error(`Property type for ${this.constructor.name}#${propName} is already defined.`);
    }

    const propertyDescriptor = new ReactThreeRendererPropertyDescriptor<TProps, TInstance, TProp>(
      null,
      updateFunction,
      updateInitial,
      false, // TODO remove wantsRepaint
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
   */
  public hasPropGroup<TPropMap>(propNames: string[],
                                updateFunction: PropertyUpdater<TProps, TInstance, TPropMap>,
                                updateInitial: boolean = true): PropertyGroupDescriptor<TProps, TInstance, TPropMap> {
    const groupName = propNames.join(",");

    this.propertyGroups[groupName] = new PropertyGroupDescriptor(
      propNames,
      updateFunction,
      updateInitial,
      false,
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

  protected removeProp(propName: string) {
    const propertyDescriptor: ReactThreeRendererPropertyDescriptor<TProps, TInstance, any> | undefined
      = this.propertyDescriptors[propName];

    if (propertyDescriptor === undefined) {
      throw new Error(`Property type for ${this.constructor.name}#${propName} is not defined.`);
    }

    if (propertyDescriptor.groupName !== null) {
      // TODO GH-27
      throw new Error("Cannot remove properties in groups yet.");
    }

    delete this.propertyDescriptors[propName];
  }

  /**
   * Declares that this property can be updated with simple assignments.
   * @param {string} propName
   * The name of the property
   * @param {boolean} updateInitial
   * Does this property need to be updated right after createInstance?
   */
  protected hasSimpleProp(propName: string,
                          updateInitial: boolean = true): ReactThreeRendererPropertyDescriptor<TProps, TInstance, any> {
    return this.hasProp(propName, (instance: any, newValue: any): void => {
      (instance as any)[propName] = newValue;
    }, updateInitial);
  }

  protected updateProperty(propName: string,
                           groupedUpdates: { [p: string]: { [p: string]: any } },
                           groupNamesToUpdate: null | (string[]),
                           value: any,
                           instance: TInstance,
                           oldProps: TProps,
                           newProps: TProps,
                           isInitialUpdate: boolean): void {
    const propertyDescriptor: ReactThreeRendererPropertyDescriptor<TProps, TInstance, any> | undefined
      = this.propertyDescriptors[propName];
    if (propertyDescriptor === undefined) {
      throw new Error(`Cannot find property descriptor for ${this.constructor.name}#${propName}`);
    }

    const groupName = propertyDescriptor.groupName;

    if (groupNamesToUpdate !== null && groupName !== null) {
      if (isInitialUpdate && !this.propertyGroups[groupName].updateInitial) {
        return;
      }

      if (groupedUpdates[groupName] === undefined) {
        groupNamesToUpdate.push(groupName);
        groupedUpdates[groupName] = {};
      }

      groupedUpdates[groupName][propName] = value;
    } else {
      if (isInitialUpdate && propertyDescriptor.updateInitial !== true) {
        return;
      }

      const updateFunction = propertyDescriptor.updateFunction;

      if (updateFunction === null) {
        // TODO
        throw new Error("yarrg test this btw");
        // throw new Error("Property updateFunction for " +
        //   `${(instance as any)[r3rFiberSymbol].type}.${propName} is not defined.`);
      }

      updateFunction(instance, value, oldProps, newProps);
    }
  }
}
