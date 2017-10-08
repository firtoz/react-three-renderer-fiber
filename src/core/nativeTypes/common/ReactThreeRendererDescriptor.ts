import {INativeElement} from "../../customRenderer/customRenderer";
import {TUpdatePayload} from "../../renderer/fiberRenderer/prepareUpdate";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";
import getDescriptorForInstance from "../../renderer/utils/getDescriptorForInstance";
import r3rFiberSymbol from "../../renderer/utils/r3rFiberSymbol";

type IPropertyUpdater<TProps, TInstance, TPropType> = (instance: TInstance,
                                                       newValue: TPropType,
                                                       oldProps: TProps,
                                                       newProps: TProps) => void;

interface IPropertyUpdaterMap<TProps, TInstance> {
  [key: string]: {
    updateFunction?: IPropertyUpdater<TProps, TInstance, any>,
    updateInitial?: boolean,
    groupName?: string,
  } | undefined;
}

interface IPropertyGroupMap<TProps, TInstance> {
  [key: string]: {
    properties: string[],
    updateInitial: boolean,
    updateFunction: IPropertyUpdater<TProps, TInstance, any>,
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

  constructor() {
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

    const groupNamesToUpdate: string[] = [];

    for (let keyIndex = 0; keyIndex < updatePayload.length; keyIndex += 2) {
      const key: string = updatePayload[keyIndex];
      const value: any = updatePayload[keyIndex + 1];
      this.updateProperty(key, groupedUpdates, groupNamesToUpdate, value, instance, oldProps, newProps);
    }

    for (const groupName of groupNamesToUpdate) {
      const newData = groupedUpdates[groupName];

      this.propertyGroups[groupName].updateFunction(instance, newData, oldProps, newProps);
    }
  }

  public abstract createInstance(props: TProps, rootContainerInstance: HTMLCanvasElement): TInstance;

  public willBeRemovedFromParent(instance: TInstance, parent: TParent): void {
    /* noop by default */
  }

  public willBeRemovedFromContainer(instance: TInstance, container: TParent): void {
    this.willBeRemovedFromParent(instance, container);
  }

  public applyInitialPropUpdates(instance: TInstance, props: TProps) {
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

      this.propertyGroups[groupName].updateFunction(instance, newData, emptyObject, props);
    }
  }

  public appendInitialChild(instance: TInstance, child: TChild): void {
    (getDescriptorForInstance(child) as ReactThreeRendererDescriptor).addedToParent(child, instance);
    // throw new Error("tried to append a child initial to " + (instance as any)[r3rFiberSymbol].type);
  }

  public appendChild(instance: TInstance, child: TChild): void {
    (getDescriptorForInstance(child) as ReactThreeRendererDescriptor).addedToParent(child, instance);

    // throw new Error("tried to append a child to " + (instance as any)[r3rFiberSymbol].type);
  }

  public removeChild(instance: TInstance, child: TChild): void {
    getDescriptorForInstance(child).willBeRemovedFromParent(child, instance);

    // throw new Error("tried to remove a child from " + (instance as any)[r3rFiberSymbol].type);
  }

  public appendToContainer(instance: TInstance, container: TParent): void {
    this.addedToParent(instance, container);
  }

  protected abstract addedToParent(instance: TInstance, container: TParent): void;

  protected hasProp<TProp>(propName: string,
                           updateFunction: IPropertyUpdater<TProps, TInstance, TProp>,
                           updateInitial: boolean = true) {
    if (this.propertyDescriptors[propName] !== undefined) {
      throw new Error(`Property type for ${this.constructor.name}#${propName} is already defined.`);
    }
    this.propertyDescriptors[propName] = {
      updateFunction,
      updateInitial,
    };
  }

  protected hasPropGroup<TProp>(propNames: string[],
                                updateFunction: IPropertyUpdater<TProps, TInstance, TProp>,
                                updateInitial: boolean = true) {
    const groupName = propNames.join(",");

    this.propertyGroups[groupName] = {
      properties: propNames,
      updateFunction,
      updateInitial,
    };

    propNames.forEach((propName) => {
      if (typeof this.propertyDescriptors[propName] !== "undefined") {
        throw new Error(`Property type for ${propName} is already defined.`);
      }

      this.propertyDescriptors[propName] = {
        groupName,
      };
    });
  }

  protected hasSimpleProp<TProp>(propName: string, updateInitial: boolean = true) {
    this.hasProp(propName, (instance: any, newValue: TProp): void => {
      (instance as any)[propName] = newValue;
    }, updateInitial);
  }

  private updateProperty(propName: string,
                         groupedUpdates: { [p: string]: { [p: string]: any } },
                         groupNamesToUpdate: string[],
                         value: any,
                         instance: TInstance,
                         oldProps: TProps,
                         newProps: TProps,
                         updateInitial: boolean = false) {
    const propertyDescriptor = this.propertyDescriptors[propName];
    if (propertyDescriptor === undefined) {
      throw new Error(`Cannot find property descriptor for ${this.constructor.name}#${propName}`);
    }

    const groupName = propertyDescriptor.groupName;

    if (groupName !== undefined) {
      if (updateInitial && !this.propertyGroups[groupName].updateInitial) {
        return;
      }

      if (!groupedUpdates[groupName]) {
        groupNamesToUpdate.push(groupName);
        groupedUpdates[groupName] = {};
      }

      groupedUpdates[groupName][propName] = value;
    } else {
      if (updateInitial && !propertyDescriptor.updateInitial) {
        return;
      }

      const updateFunction = propertyDescriptor.updateFunction;

      if (updateFunction === undefined) {
        throw new Error("Property updateFunction for " +
          `${(instance as any)[r3rFiberSymbol].type}.${propName} is not defined.`);
      }

      updateFunction(instance, value, oldProps, newProps);
    }
  }
}
