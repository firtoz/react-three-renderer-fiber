import ContainerUnawareReconcilerConfig from "../../customRenderer/ContainerUnawareReconcilerConfig";
import {IPropMap} from "../../customRenderer/createReconciler";
import {IHostContext} from "../../customRenderer/customReactRenderer";
import ReactThreeRendererDescriptor from "../hostDescriptors/common/ReactThreeRendererDescriptor";

declare function require(filename: string): any;

const descriptorsRequireContext = (require as any).context("../hostDescriptors/descriptors/", true, /\.ts$/);

export class ReactThreeReconcilerConfig extends ContainerUnawareReconcilerConfig<ReactThreeRendererDescriptor> {
  constructor() {
    super();

    descriptorsRequireContext
      .keys()
      .forEach((key: string) => {
        const name = key.match(/(\w+)\.ts$/);
        if (name !== null) {
          this.defineHostDescriptor(name[1], new (descriptorsRequireContext(key).default)());
        }
      });
  }

  public appendChildToContainer(parent: any, childInstance: any): void {
    super.appendChildToContainer(parent, childInstance);

    const descriptor = this.getDescriptorForInstance(childInstance) as ReactThreeRendererDescriptor;

    if (descriptor.wantsRepaint) {
      const context: IHostContext = (childInstance as any)[this.getContextSymbol()];

      if (context !== undefined) {
        context.triggerRender();
      }
    }
  }

  public insertInContainerBefore(container: any, childInstance: any, before: any): void {
    super.insertInContainerBefore(container, childInstance, before);

    const descriptor = this.getDescriptorForInstance(childInstance) as ReactThreeRendererDescriptor;

    if (descriptor.wantsRepaint) {
      const context: IHostContext = (childInstance as any)[this.getContextSymbol()];

      if (context !== undefined) {
        context.triggerRender();
      }
    }
  }

  public removeChildFromContainer(container: any, childInstance: any): void {
    super.removeChildFromContainer(container, childInstance);

    const descriptor = this.getDescriptorForInstance(childInstance) as ReactThreeRendererDescriptor;

    if (descriptor.wantsRepaint) {
      const context: IHostContext = (childInstance as any)[this.getContextSymbol()];

      if (context !== undefined) {
        context.triggerRender();
      }
    }
  }

  public removeChild(parentInstance: any, childInstance: any): void {
    super.removeChild(parentInstance, childInstance);

    for (const instance of [parentInstance, childInstance]) {
      const descriptor = this.getDescriptorForInstance(instance) as ReactThreeRendererDescriptor;

      if (descriptor.wantsRepaint) {
        const context: IHostContext = (instance as any)[this.getContextSymbol()];

        if (context !== undefined) {
          context.triggerRender();
          break;
        }
      }
    }
  }

  public insertBefore(parentInstance: any, childInstance: any, before: any): void {
    super.insertBefore(parentInstance, childInstance, before);

    for (const instance of [parentInstance, childInstance]) {
      const descriptor = this.getDescriptorForInstance(instance) as ReactThreeRendererDescriptor;

      if (descriptor.wantsRepaint) {
        const context: IHostContext = (instance as any)[this.getContextSymbol()];

        if (context !== undefined) {
          context.triggerRender();
          break;
        }
      }
    }
  }

  public appendChild(parentInstance: any, childInstance: any): void {
    super.appendChild(parentInstance, childInstance);

    for (const instance of [parentInstance, childInstance]) {
      const descriptor = this.getDescriptorForInstance(instance) as ReactThreeRendererDescriptor;

      if (descriptor.wantsRepaint) {
        const context: IHostContext = (instance as any)[this.getContextSymbol()];

        if (context !== undefined) {
          context.triggerRender();
          break;
        }
      }
    }
  }

  public appendInitialChild(parentInstance: any, childInstance: any): void {
    super.appendInitialChild(parentInstance, childInstance);

    for (const instance of [parentInstance, childInstance]) {
      const descriptor = this.getDescriptorForInstance(instance) as ReactThreeRendererDescriptor;

      if (descriptor.wantsRepaint) {
        const context: IHostContext = (instance as any)[this.getContextSymbol()];

        if (context !== undefined) {
          context.triggerRender();
          break;
        }
      }
    }
  }

  public commitUpdate(instance: any,
                      updatePayload: any[],
                      type: string,
                      oldProps: IPropMap,
                      newProps: IPropMap): void {
    if (this.getDescriptorForInstance(instance).commitUpdate(instance, updatePayload, oldProps, newProps)) {
      const descriptor = this.getDescriptorForInstance(instance) as ReactThreeRendererDescriptor;

      if (descriptor.wantsRepaint) {
        const context: IHostContext = (instance as any)[this.getContextSymbol()];

        if (context !== undefined) {
          context.triggerRender();
        }
      }
    }
  }
}

export default new ReactThreeReconcilerConfig();
