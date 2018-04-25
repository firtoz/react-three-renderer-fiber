import {TUpdatePayload} from "../../../customRenderer/createReconciler";
import {CustomDescriptor} from "../../../customRenderer/descriptors/CustomDescriptor";
import {PropertyUpdater} from "../../../customRenderer/descriptors/properties/PropertyUpdater";
import {ReactThreeRenderer} from "../../reactThreeRenderer";
import R3RPropertyGroupDescriptor from "./properties/R3RPropertyGroupDescriptor";
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
    ReactThreeRendererPropertyDescriptor<TProps, TInstance, any>,
    R3RPropertyGroupDescriptor<TProps, TInstance, any>,
    HTMLCanvasElement,
    ReactThreeRenderer> {
  constructor(public wantsRepaint: boolean = true) {
    super(ReactThreeRendererPropertyDescriptor, R3RPropertyGroupDescriptor);

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
      if (key === "children") {
        continue;
      }

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
    return super.hasProp(propName, updateFunction, updateInitial)
      .withWantsRepaint(wantsRepaint);
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
                                wantsRepaint: boolean = true): R3RPropertyGroupDescriptor<TProps, TInstance, TPropMap> {
    return super.hasPropGroup(propNames, updateFunction, updateInitial)
      .withWantsRepaint(wantsRepaint);
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
    return super.hasSimpleProp(propName, updateInitial)
      .withWantsRepaint(wantsRepaint);
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
      throw new Error(`Cannot find property descriptor for ${(this as any).__proto__.constructor.name}#${propName}`);
    }

    return propertyDescriptor.wantsRepaint;
  }
}
