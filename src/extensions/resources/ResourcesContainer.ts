import {ResourceContainerSymbol} from "./ResourceDescriptorWrapper";

export default class ResourceContainer {
  public static GetContainerForResource(instance: any): ResourceContainer | undefined {
    return instance[ResourceContainerSymbol];
  }

  private readonly resources: {
    [key: string]: any,
  };

  public constructor() {
    this.resources = {};
  }

  public setResource(key: string, resource: any) {
    if (this.resources[key] !== undefined) {
      console.error(`The resource with the resource ID '${key}' is already defined.`);
    }

    this.resources[key] = resource;
  }

  public removeResource(key: string) {
    this.resources[key] = undefined;
  }

  public get(key: string) {
    return this.resources[key];
  }
}
