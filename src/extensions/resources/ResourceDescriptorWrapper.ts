import ReactThreeRendererDescriptor from "../../core/renderer/hostDescriptors/common/ReactThreeRendererDescriptor";
import ResourceContainer from "./ResourcesContainer";

export type TReactThreeRendererDescriptorInstance = ReactThreeRendererDescriptor & {
  createInstance(props: any, rootContainerInstance: any): any,
};

export interface IReactThreeRendererDescriptorClass {
  new(): TReactThreeRendererDescriptorInstance;
}

export function GetResourceID(instance: any): string {
  return instance[ResourceIDSymbol];
}

function SetResourceId(instance: any, key: string) {
  instance[ResourceIDSymbol] = key;
}

export const ResourceIDSymbol = Symbol("resource-id");

export default function ResourceDescriptorWrapper(classType: IReactThreeRendererDescriptorClass):
  IReactThreeRendererDescriptorClass {
  return class extends classType {
    constructor() {
      super();

      // TODO check if the parent is a 'ResourceContainer', if so, change the resource key.
      // Otherwise, complain
      this.hasProp<string>("resource-id", (instance, newResourceId) => {
        const resourceContainer = ResourceContainer.GetContainerForResource(instance);

        if (resourceContainer === undefined) {
          SetResourceId(instance, newResourceId);
          return;
        }

        const previousValue = GetResourceID(instance);
        if (previousValue !== undefined) {
          resourceContainer.removeResource(newResourceId);
        }

        if (previousValue === instance) {
          throw new Error("The resource property is somehow being overwritten.");
        }
        // TODO handle repainting upon rerender?!
        // TODO somehow get context?!

        resourceContainer.setResource(newResourceId, instance);

        SetResourceId(instance, newResourceId);
      }, true, false);
    }

    public willBeRemovedFromParent(instance: any, parent: any): void {
      // console.log("BAAAAAH - willBeRemovedFromParent");
      if (parent instanceof ResourceContainer) {
        ResourceContainer.UnmountResourceFromContainer(instance);

        return;
      }

      // TODO check parent's resource container and hook onto that??

      super.willBeRemovedFromParent(instance, parent);
    }

    public insertBefore(parentInstance: any, childInstance: any, before: any): void {
      if (parentInstance instanceof ResourceContainer) {
        parentInstance.MountResourceToContainer(childInstance);

        console.log("BAAAAAH - insertBefore");

        return;
      }

      super.insertBefore(parentInstance, childInstance, before);
    }

    public willBeAddedToParentBefore(instance: any, parentInstance: any, before: any): void {
      // TODO if the parent is not a Resources then it should complain if the resource id property is set
      // otherwise, set the parent's resource id to this instance
      // also complain if the parent already has this resource

      if (parentInstance instanceof ResourceContainer) {
        // console.log("BAAAAAH - willBeAddedToParentBefore");
        parentInstance.MountResourceToContainer(instance);

        return;
      }

      super.willBeAddedToParentBefore(instance, parentInstance, before);
    }

    public willBeAddedToParent(instance: any, parent: any): void {
      if (parent instanceof ResourceContainer) {
        // console.log("BAAAAAH - willBeAddedToParent");
        parent.MountResourceToContainer(instance);

        return;
      }

      super.willBeAddedToParent(instance, parent);
    }

    public applyInitialPropUpdates(instance: any, props: any) {
      if (props.hasOwnProperty("resource-id")) {
        const propsClone = Object.assign({}, props);

        delete propsClone["resource-id"];

        super.applyInitialPropUpdates(instance, propsClone);

        this.updateProperty("resource-id", {}, [], props["resource-id"], instance, {}, props, true);
      } else {
        super.applyInitialPropUpdates(instance, props);
      }
    }

    public commitUpdate(instance: any,
                        updatePayload: any,
                        oldProps: any,
                        newProps: any): boolean {
      let wantsRepaint = false;

      for (let keyIndex = 0; keyIndex < updatePayload.length; keyIndex += 2) {
        const key: string = updatePayload[keyIndex];

        if (key === "resource-id") {
          const value: any = updatePayload[keyIndex + 1];
          if (this.updateProperty(key, {}, [], value, instance, oldProps, newProps, false)) {
            wantsRepaint = true;
          }

          // tslint:disable-next-line
          debugger;

          updatePayload.splice(keyIndex, 2);
          keyIndex -= 2;
        }
      }

      if (super.commitUpdate(instance, updatePayload, oldProps, newProps)) {
        wantsRepaint = true;
      }

      return this.wantsRepaint && wantsRepaint;
    }

    public createInstance(props: any, rootContainerInstance: any) {
      let instance: any;
      if (props.hasOwnProperty("resource-id")) {
        const propsClone = Object.assign({}, props);

        delete propsClone["resource-id"];

        instance = super.createInstance(propsClone, rootContainerInstance);
      } else {
        instance = super.createInstance(props, rootContainerInstance);
      }

      return instance;
    }
  };
}
