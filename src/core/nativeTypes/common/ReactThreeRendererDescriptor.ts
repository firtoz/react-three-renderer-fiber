import {INativeElement} from "../../customRenderer/customRenderer";
import {IHostContext} from "../../renderer/fiberRenderer/createInstance";
import {TUpdatePayload} from "../../renderer/fiberRenderer/prepareUpdate";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";
import getDescriptorForInstance from "../../renderer/utils/getDescriptorForInstance";
import r3rContextSymbol from "../../renderer/utils/r3rContextSymbol";
import r3rFiberSymbol from "../../renderer/utils/r3rFiberSymbol";

type IPropertyUpdater<TProps, TInstance, TPropType> = (instance: TInstance,
                                                       newValue: TPropType,
                                                       oldProps: TProps,
                                                       newProps: TProps) => void;

interface IPropertyUpdaterMap<TProps, TInstance> {
  [key: string]: {
    updateFunction?: IPropertyUpdater<TProps, TInstance, any>,
    groupName: string | null,
    updateInitial: boolean,
    wantsRepaint: boolean;
  } | undefined;
}

interface IPropertyGroupMap<TProps, TInstance> {
  [key: string]: {
    properties: string[],
    updateInitial: boolean,
    updateFunction: IPropertyUpdater<TProps, TInstance, any>,
    wantsRepaint: boolean,
  };
}

const emptyObject: any = {};

export abstract class ReactThreeRendererDescriptor<TProps = any,
  TInstance = any,
  TParent = any,
  TChild = never>
  implements INativeElement<TProps,
    TInstance,
    TParent,
    TChild,
    HTMLCanvasElement,
    ReactThreeRenderer> {
  protected propertyDescriptors: IPropertyUpdaterMap<TProps, TInstance>;
  protected propertyGroups: IPropertyGroupMap<TProps, TInstance>;

  constructor(private wantsRepaint: boolean = true) {
    this.propertyDescriptors = {};
    this.propertyGroups = {};
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

    /*
    * TODO get and pass context / trigger render function here
    * Also perhaps once render trigger has been activated, go for the "non-context-checking" updater function?
    * TODO check perf of alternate functions vs. if conditions
    */

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

  public abstract createInstance(props: TProps, rootContainerInstance: HTMLCanvasElement): TInstance;

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

  protected internalApplyInitialPropUpdates(instance: TInstance, props: TProps) {
    const groupedUpdates: {
      [groupName: string]: {
        [propertyName: string]: any;
      },
    } = {};

    const groupNamesToUpdate: string[] = [];

    const keys = Object.keys(props);
    for (const key of keys) {
      if (key === "children") {
        continue;
      }

      const value = (props as any)[key];

      this.updateProperty(key, groupedUpdates, groupNamesToUpdate, value, instance, emptyObject, props, true);
    }

    for (const groupName of groupNamesToUpdate) {
      const newData = groupedUpdates[groupName];

      if (this.propertyGroups[groupName].updateInitial) {
        this.propertyGroups[groupName].updateFunction(instance, newData, emptyObject, props);
      }
    }
  }

  protected abstract addedToParentBefore(instance: TInstance, parentInstance: TParent, before: any): void;

  protected abstract addedToParent(instance: TInstance, container: TParent): void;

  protected hasProp<TProp>(propName: string,
                           updateFunction: IPropertyUpdater<TProps, TInstance, TProp>,
                           updateInitial: boolean = true,
                           wantsRepaint: boolean = true) {
    if (this.propertyDescriptors[propName] !== undefined) {
      throw new Error(`Property type for ${this.constructor.name}#${propName} is already defined.`);
    }
    this.propertyDescriptors[propName] = {
      groupName: null,
      updateFunction,
      updateInitial,
      wantsRepaint,
    };
  }

  protected hasPropGroup<TProp>(propNames: string[],
                                updateFunction: IPropertyUpdater<TProps, TInstance, TProp>,
                                updateInitial: boolean = true,
                                wantsRepaint: boolean = true) {
    const groupName = propNames.join(",");

    this.propertyGroups[groupName] = {
      properties: propNames,
      updateFunction,
      updateInitial,
      wantsRepaint,
    };

    propNames.forEach((propName) => {
      if (typeof this.propertyDescriptors[propName] !== "undefined") {
        throw new Error(`Property type for ${propName} is already defined.`);
      }

      this.propertyDescriptors[propName] = {
        groupName,
        updateInitial: false,
        wantsRepaint: false,
      };
    });
  }

  protected hasSimpleProp(propName: string, updateInitial: boolean = true, wantsRepaint: boolean = true) {
    this.hasProp(propName, (instance: any, newValue: any): void => {
      (instance as any)[propName] = newValue;
    }, updateInitial, wantsRepaint);
  }

  private updateProperty(propName: string,
                         groupedUpdates: { [p: string]: { [p: string]: any } },
                         groupNamesToUpdate: string[],
                         value: any,
                         instance: TInstance,
                         oldProps: TProps,
                         newProps: TProps,
                         isInitialUpdate: boolean): boolean {
    const propertyDescriptor = this.propertyDescriptors[propName];
    if (propertyDescriptor === undefined) {
      throw new Error(`Cannot find property descriptor for ${this.constructor.name}#${propName}`);
    }

    const groupName = propertyDescriptor.groupName;

    if (groupName !== null) {
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

      if (updateFunction === undefined) {
        throw new Error("Property updateFunction for " +
          `${(instance as any)[r3rFiberSymbol].type}.${propName} is not defined.`);
      }

      updateFunction(instance, value, oldProps, newProps);

      return propertyDescriptor.wantsRepaint;
    }
  }
}
