import {GetResourceID} from "./ResourceDescriptorWrapper";

function SetResourceContainer(instance: any, container: ResourceContainer | undefined): void {
  instance[ResourceContainerSymbol] = container;
}

export const ResourceContainerSymbol = Symbol("resource-container");

export default class ResourceContainer {
  public static GetContainerForResource(instance: any): ResourceContainer | undefined {
    return instance[ResourceContainerSymbol];
  }

  public static UnmountResourceFromContainer(instance: any) {
    const resourceContainer = ResourceContainer.GetContainerForResource(instance);
    if (resourceContainer !== undefined) {
      const resourceId = GetResourceID(instance);

      if (resourceId !== undefined) {
        resourceContainer.removeResource(resourceId);
      }
    }

    if (instance instanceof ResourceContainer) {
      instance.ClearPropagation();
    }

    SetResourceContainer(instance, undefined);
  }

  private readonly resources: {
    [key: string]: any,
  };

  public constructor() {
    this.resources = {};
  }

  public MountResourceToContainer(instance: any) {
    // SetResourceContainer(instance, this);
    instance[ResourceContainerSymbol] = this;

    const resourceId = GetResourceID(instance);

    if (resourceId !== undefined) {
      this.setResource(resourceId, instance);
    }

    if (instance instanceof ResourceContainer) {
      instance.PropagateResources();
    }
  }

  public setResource(key: string, resource: any) {
    if (this.resources[key] !== undefined) {
      console.error(`The resource with the resource ID '${key}' is already defined.`);
    }

    this.resources[key] = resource;

    const parent = ResourceContainer.GetContainerForResource(this);

    if (parent === undefined) {
      return;
    }

    parent.setResource(key, resource);
  }

  public removeResource(key: string) {
    this.resources[key] = undefined;

    const parent = ResourceContainer.GetContainerForResource(this);

    if (parent === undefined) {
      return;
    }

    parent.removeResource(key);
  }

  public get(key: string) {
    return this.resources[key];
  }

  public PropagateResources() {
    const parent = ResourceContainer.GetContainerForResource(this);

    if (parent === undefined) {
      return;
    }

    Object.keys(this.resources).forEach((resourceKey) => {
      parent.setResource(resourceKey, this.resources[resourceKey]);
    });
  }

  public ClearPropagation() {
    const parent = ResourceContainer.GetContainerForResource(this);

    if (parent === undefined) {
      return;
    }

    Object.keys(this.resources).forEach((resourceKey) => {
      parent.removeResource(resourceKey);
    });
  }
}
