import {Validator} from "prop-types";
import {TUpdatePayload} from "../createReconciler";
import final from "../decorators/final";
import isNonProduction from "../utils/isNonProduction";
import {IHostDescriptor, IPropTypeMap} from "./IHostDescriptor";
import CustomPropertyDescriptor from "./properties/CustomPropertyDescriptor";
import CustomPropertyGroupDescriptor from "./properties/CustomPropertyGroupDescriptor";
import {PropertyUpdater} from "./properties/PropertyUpdater";

export interface IPropertyUpdaterMap<TProps,
  TInstance,
  TDescriptor extends CustomPropertyDescriptor<TProps, TInstance, any>> {
  [key: string]: TDescriptor | undefined;
}

export interface IPropertyGroupMap<TProps,
  TInstance,
  TGroupDescriptor extends CustomPropertyGroupDescriptor<TProps, TInstance, any>> {
  [key: string]: TGroupDescriptor;
}

const emptyObject: any = {};

export type TPropertyDescriptorConstructor<TProps,
  TInstance,
  TPropertyDescriptor extends CustomPropertyDescriptor<TProps, TInstance, any>>
  = new(groupName: string | null,
        updateFunction: PropertyUpdater<TProps, TInstance, any> | null,
        updateInitial: boolean,
        validatorAcceptor: ((validator: Validator<any>) => void) | null) => TPropertyDescriptor;

export type TPropertyGroupDescriptorConstructor<TProps,
  TInstance,
  TPropertyGroupDescriptor extends CustomPropertyGroupDescriptor<TProps, TInstance, any>>
  = new(properties: string[],
        updateFunction: PropertyUpdater<TProps, TInstance, any>,
        updateInitial: boolean,
        validatorAcceptor: ((validator: IPropTypeMap) => void) | null) => TPropertyGroupDescriptor;

export abstract class CustomDescriptor< //
  /**
   * @typedef {any} CustomDescriptor.TProps
   * @type CustomDescriptor.TProps
   * The expected property types to be used for createInstance and property updates.
   */
  TProps = any,
  /**
   * @typedef {any} CustomDescriptor.TInstance
   * @type CustomDescriptor.TInstance
   * The instance type to be created and updated.
   */
  TInstance = any,
  /**
   * @typedef {any} CustomDescriptor.TParent
   * @type CustomDescriptor.TParent
   * The parent types that the host instances can be mounted into.
   */
  TParent = any,
  /**
   * @typedef {any} CustomDescriptor.TParent
   * @type CustomDescriptor.TParent
   * The types of objects the host instance will accept as children.
   */
  TChild = any,
  TPropertyDescriptor extends CustomPropertyDescriptor<TProps, TInstance, any> = any,
  TPropertyGroupDescriptor extends CustomPropertyGroupDescriptor<TProps, TInstance, any> = any,
  TRoot = any>
  implements IHostDescriptor<TProps,
    TInstance,
    TParent,
    TChild,
    TRoot> {

  public propTypes: IPropTypeMap;

  protected propertyDescriptors: IPropertyUpdaterMap<TProps, TInstance, TPropertyDescriptor>;
  protected propertyGroups: IPropertyGroupMap<TProps, TInstance, TPropertyGroupDescriptor>;

  constructor(private propertyDescriptorConstructor: TPropertyDescriptorConstructor<TProps,
                TInstance,
                TPropertyDescriptor> = CustomPropertyDescriptor as any,
              private propertyGroupDescriptorConstructor: TPropertyGroupDescriptorConstructor<TProps,
                TInstance,
                TPropertyGroupDescriptor> = CustomPropertyGroupDescriptor as any) {
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
   * The object that `MyRenderer.render` was called upon.
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
      throw new Error("Containers are treated as parents for " + (this as any).__proto__.constructor.name);
    }
  }

  @final()
  public insertInContainerBefore(instance: TInstance, container: TParent, before: any): void {
    if (isNonProduction) {
      throw new Error("Containers are treated as parents for " + (this as any).__proto__.constructor.name);
    }
  }

  @final()
  public appendToContainer(instance: TInstance, container: TParent): void {
    if (isNonProduction) {
      throw new Error("Containers are treated as parents for " + (this as any).__proto__.constructor.name);
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

      const propertyGroup = this.propertyGroups[groupName];
      if (propertyGroup.updateInitial) {
        let newData;

        // fill in default values partially
        // TODO test this
        if (propertyGroup.defaultValue !== undefined) {
          newData = Object.assign({}, propertyGroup.defaultValue, groupedUpdates[groupName]);
        } else {
          newData = groupedUpdates[groupName];
        }

        propertyGroup.updateFunction(instance, newData, emptyObject, props);
      }
    }

    allDescriptorNamesWithDefaultValuesMissingFromProps.forEach((name) => {
      const value = (this.propertyDescriptors[name] as any).defaultValue;

      this.updateProperty(name, groupedUpdates, null, value, instance, emptyObject, props, true);
    });

    const allGroupNamesWithDefaultValuesMissingFromProps = Object.keys(this.propertyGroups)
      .filter((key: string) => {
        const groupDescriptor = (this.propertyGroups[key] as any);

        return !updatedGroupsMap[key] &&
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
           updateInitial: boolean = true): TPropertyDescriptor {
    if (this.propertyDescriptors[propName] !== undefined) {
      throw new Error(`Property type for ${(this as any).__proto__.constructor.name}#${propName} is already defined.`);
    }

    const propertyDescriptor = new this.propertyDescriptorConstructor(
      null,
      updateFunction,
      updateInitial,
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
                                updateInitial: boolean = true): TPropertyGroupDescriptor {
    const groupName = propNames.join(",");

    this.propertyGroups[groupName] = new this.propertyGroupDescriptorConstructor(
      propNames,
      updateFunction,
      updateInitial,
      (validatorMap: IPropTypeMap) => {
        const missingKeys = propNames.concat().reduce((map, name) => {
          map[name] = true;
          return map;
        }, {} as { [index: string]: boolean });

        const errors: string[] = [];

        Object.keys(validatorMap).forEach((propName: string) => {
          if (missingKeys[propName]) {
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

    if (isNonProduction) {
      this.propertyGroups[groupName]
        .withErrorName((this as any).__proto__.constructor.name);
    }

    propNames.forEach((propName) => {
      if (typeof this.propertyDescriptors[propName] !== "undefined") {
        throw new Error(`Property type for ${propName} is already defined.`);
      }

      // wantsRepaint is false so that's OK?
      this.propertyDescriptors[propName] = new this.propertyDescriptorConstructor(
        groupName,
        null,
        false,
        null,
      );
    });

    return this.propertyGroups[groupName];
  }

  protected removeProp(propName: string) {
    const propertyDescriptor: TPropertyDescriptor | undefined
      = this.propertyDescriptors[propName];

    if (propertyDescriptor === undefined) {
      throw new Error(`Property type for ${(this as any).__proto__.constructor.name}#${propName} is not defined.`);
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
                          updateInitial: boolean = true): TPropertyDescriptor {
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
    const propertyDescriptor: TPropertyDescriptor | undefined
      = this.propertyDescriptors[propName];
    if (propertyDescriptor === undefined) {
      throw new Error(`Cannot find property descriptor for ${(this as any).__proto__.constructor.name}#${propName}`);
    }

    const groupName = propertyDescriptor.groupName;

    if (groupNamesToUpdate !== null && groupName !== null) {
      const propertyGroup: TPropertyGroupDescriptor = this.propertyGroups[groupName];

      if (isInitialUpdate && !propertyGroup.updateInitial) {
        return;
      }

      if (groupedUpdates[groupName] === undefined) {
        groupNamesToUpdate.push(groupName);
        groupedUpdates[groupName] = {};
      }

      if (value === null && propertyGroup.defaultValue !== undefined) {
        // TODO test partial default values
        value = propertyGroup.defaultValue[propName];
      }

      groupedUpdates[groupName][propName] = value;
    } else {
      if (isInitialUpdate && !propertyDescriptor.updateInitial) {
        return;
      }

      const updateFunction = propertyDescriptor.updateFunction;

      if (updateFunction === null) {
        // TODO
        throw new Error("yarrg test this btw");
        // throw new Error("Property updateFunction for " +
        //   `${(instance as any)[r3rFiberSymbol].type}.${propName} is not defined.`);
      }

      if (value === null && propertyDescriptor.defaultValue !== undefined) {
        // TODO test restoring default values for individual property descriptors
        value = propertyDescriptor.defaultValue;
      }

      updateFunction(instance, value, oldProps, newProps);
    }
  }
}
