import {Validator} from "prop-types";
import {INativeElement, IPropTypeMap} from "../../customRenderer/customRenderer";
import {IHostContext} from "../../renderer/fiberRenderer/createInstance";
import {TUpdatePayload} from "../../renderer/fiberRenderer/prepareUpdate";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";
import getDescriptorForInstance from "../../renderer/utils/getDescriptorForInstance";
import isNonProduction from "../../renderer/utils/isNonProduction";
import r3rContextSymbol from "../../renderer/utils/r3rContextSymbol";
import r3rFiberSymbol from "../../renderer/utils/r3rFiberSymbol";

/**
 * A property updater function.
 * @param {TInstance} instance The host instance.
 * @param {TPropType} newValue A value to set for the property.
 * @param {PropertyUpdater.TProps} oldProps What the properties of the element were before the update.
 * @param {TProps} newProps What the current properties of the element are.
 *
 * @type {function (instance: TInstance,
 *               newValue: TPropType,
 *               oldProps: TProps,
 *               newProps: TProps): number}
 */
type PropertyUpdater< //
  /**
   * The property types for the host instance.
   * @type ReactThreeRendererDescriptor.TProps
   */
  TProps,
  /**
   * The instance type to be created and updated
   * @type ReactThreeRendererDescriptor.TInstance
   */
  TInstance,
  /**
   * @typedef {any} TPropType
   * @type TPropType
   * The property type to update.
   */
  TPropType> = (instance: TInstance,
                newValue: TPropType,
                oldProps: TProps,
                newProps: TProps) => void;

export class ReactThreeRendererPropertyDescriptor<TProps, TInstance, TProp> {
  public defaultValue?: TProp = undefined;

  constructor(public groupName: string | null,
              public updateFunction: PropertyUpdater<TProps, TInstance, TProp> | null,
              public updateInitial: boolean,
              public wantsRepaint: boolean,
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

export class PropertyGroupDescriptor<TProps, TInstance, TProp> {
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
    // TODO in non prod check if defaultvalue has keys to match properties

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

interface IPropertyUpdaterMap<TProps, TInstance> {
  [key: string]: ReactThreeRendererPropertyDescriptor<TProps, TInstance, any> | undefined;
}

interface IPropertyGroupMap<TProps, TInstance> {
  [key: string]: PropertyGroupDescriptor<TProps, TInstance, any>;
}

const emptyObject: any = {};

/**
 * A base type for all ReactThreeRenderer element descriptors.
 */
export abstract class ReactThreeRendererDescriptor< //
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
  implements INativeElement<TProps,
    TInstance,
    TParent,
    TChild,
    HTMLCanvasElement,
    ReactThreeRenderer> {
  public propTypes: IPropTypeMap;

  protected propertyDescriptors: IPropertyUpdaterMap<TProps, TInstance>;
  protected propertyGroups: IPropertyGroupMap<TProps, TInstance>;

  constructor(private wantsRepaint: boolean = true) {
    this.propertyDescriptors = {};
    this.propertyGroups = {};
    this.propTypes = {};
  }

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

    if (this.wantsRepaint && wantsRepaint) {
      const context: IHostContext = (instance as any)[r3rContextSymbol];

      if (context !== undefined) {
        context.triggerRender();
      }
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
    this.willBeRemovedFromParentInternal(instance, parent);

    if (this.wantsRepaint) {
      const context: IHostContext = (instance as any)[r3rContextSymbol];

      if (context !== undefined) {
        context.triggerRender();
      }
    }
  }

  public willBeRemovedFromParentInternal(instance: TInstance, parent: TParent): void {
    /* noop by default */
  }

  public willBeRemovedFromContainer(instance: TInstance, container: TParent): void {
    this.willBeRemovedFromParentInternal(instance, container);
  }

  public applyInitialPropUpdates(instance: TInstance, props: TProps): void {
    this.internalApplyInitialPropUpdates(instance, props);

    if (this.wantsRepaint) {
      const context: IHostContext = (instance as any)[r3rContextSymbol];

      if (context !== undefined) {
        context.triggerRender();
      }
    }
  }

  public appendInitialChild(instance: TInstance, child: TChild): void {
    (getDescriptorForInstance(child) as ReactThreeRendererDescriptor).addedToParent(child, instance);
  }

  public appendChild(instance: TInstance, child: TChild): void {
    (getDescriptorForInstance(child) as ReactThreeRendererDescriptor).addedToParent(child, instance);
  }

  public insertBefore(parentInstance: TInstance, childInstance: TChild, before: TChild): void {
    (getDescriptorForInstance(childInstance) as ReactThreeRendererDescriptor)
      .addedToParentBefore(childInstance, parentInstance, before);
  }

  public insertInContainerBefore(instance: TInstance, container: TParent, before: any): void {
    this.addedToParentBefore(instance, container, before);
  }

  public removeChild(instance: TInstance, child: TChild): void {
    getDescriptorForInstance(child).willBeRemovedFromParent(child, instance);

    // throw new Error("tried to remove a child from " + (instance as any)[r3rFiberSymbol].type);
  }

  public appendToContainer(instance: TInstance, container: TParent): void {
    this.addedToParent(instance, container);
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
        Object.keys(validatorMap).forEach((propName: string) => {
          this.propTypes[propName] = validatorMap[propName];
        });
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

  protected internalApplyInitialPropUpdates(instance: TInstance, props: TProps) {
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

  protected addedToParentBefore(instance: TInstance, parentInstance: TParent, before: any): void {
    this.addedToParent(instance, parentInstance);
  }

  // What does it mean for this object to be added into a container, (as a last sibling)?
  // For example, geometries and materials can set container.material = instance
  //              and object types can ensure they are added as children
  protected addedToParent(instance: TInstance, container: TParent): void {
    /* NO-OP by default */
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

  private updateProperty(propName: string,
                         groupedUpdates: { [p: string]: { [p: string]: any } },
                         groupNamesToUpdate: null | (string[]),
                         value: any,
                         instance: TInstance,
                         oldProps: TProps,
                         newProps: TProps,
                         isInitialUpdate: boolean): boolean {
    const propertyDescriptor: ReactThreeRendererPropertyDescriptor<TProps, TInstance, any> | undefined
      = this.propertyDescriptors[propName];
    if (propertyDescriptor === undefined) {
      throw new Error(`Cannot find property descriptor for ${this.constructor.name}#${propName}`);
    }

    const groupName = propertyDescriptor.groupName;

    if (groupNamesToUpdate !== null && groupName !== null) {
      if (isInitialUpdate && !this.propertyGroups[groupName].updateInitial) {
        return false;
      }

      if (groupedUpdates[groupName] === undefined) {
        groupNamesToUpdate.push(groupName);
        groupedUpdates[groupName] = {};
      }

      groupedUpdates[groupName][propName] = value;

      return false;
    } else {
      if (isInitialUpdate && propertyDescriptor.updateInitial !== true) {
        return false;
      }

      const updateFunction = propertyDescriptor.updateFunction;

      if (updateFunction === null) {
        throw new Error("Property updateFunction for " +
          `${(instance as any)[r3rFiberSymbol].type}.${propName} is not defined.`);
      }

      updateFunction(instance, value, oldProps, newProps);

      return propertyDescriptor.wantsRepaint;
    }
  }
}
