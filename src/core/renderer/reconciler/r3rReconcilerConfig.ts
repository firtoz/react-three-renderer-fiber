import {IReactThreeRendererDescriptorClass} from "../../../extensions/resources/ResourceDescriptorWrapper";
import ContainerUnawareReconcilerConfig from "../../customRenderer/ContainerUnawareReconcilerConfig";
import {CustomReconcilerConfig, IPropMap} from "../../customRenderer/createReconciler";
import {CustomRendererElementInstance} from "../hostDescriptors/common/object3DBase";
import {IReactThreeRendererDescriptor} from "../hostDescriptors/common/ReactThreeRendererDescriptor";
import descriptorMap from "../hostDescriptors/generated-descriptor-map";
import {IHostContext} from "../reactThreeRenderer";

export class ReactThreeReconcilerConfig extends ContainerUnawareReconcilerConfig<IReactThreeRendererDescriptor,
  IHostContext> {
  public static getHostDescriptorClass(key: string): IReactThreeRendererDescriptorClass | undefined {
    return descriptorMap.get(key);
  }

  constructor() {
    super();

    descriptorMap.forEach((value, key) => {
      if (name !== null) {
        this.defineHostDescriptor(key, new (value)());
      }
    });
  }

  public appendChildToContainer(parent: any, childInstance: CustomRendererElementInstance): void {
    super.appendChildToContainer(parent, childInstance);

    const descriptor = this.getDescriptorForInstance(childInstance);

    if (descriptor.wantsRepaint) {
      const context = childInstance[CustomReconcilerConfig.contextSymbol];

      if (context !== undefined) {
        context.triggerRender();
      }
    }
  }

  public insertInContainerBefore(container: any,
                                 childInstance: CustomRendererElementInstance,
                                 before: CustomRendererElementInstance): void {
    super.insertInContainerBefore(container, childInstance, before);

    const descriptor = this.getDescriptorForInstance(childInstance);

    if (descriptor.wantsRepaint) {
      const context = childInstance[CustomReconcilerConfig.contextSymbol];

      if (context !== undefined) {
        context.triggerRender();
      }
    }
  }

  public removeChildFromContainer(container: any, childInstance: CustomRendererElementInstance): void {
    super.removeChildFromContainer(container, childInstance);

    const descriptor = this.getDescriptorForInstance(childInstance);

    if (descriptor.wantsRepaint) {
      const context: IHostContext = childInstance[CustomReconcilerConfig.contextSymbol];

      if (context !== undefined) {
        context.triggerRender();
      }
    }
  }

  public removeChild(parentInstance: CustomRendererElementInstance,
                     childInstance: CustomRendererElementInstance): void {
    super.removeChild(parentInstance, childInstance);

    for (const instance of [parentInstance, childInstance]) {
      const descriptor = this.getDescriptorForInstance(instance);

      if (descriptor.wantsRepaint) {
        const context = instance[CustomReconcilerConfig.contextSymbol];

        if (context !== undefined) {
          context.triggerRender();
          break;
        }
      }
    }
  }

  public insertBefore(parentInstance: CustomRendererElementInstance,
                      childInstance: CustomRendererElementInstance, before: any): void {
    super.insertBefore(parentInstance, childInstance, before);

    for (const instance of [parentInstance, childInstance]) {
      const descriptor = this.getDescriptorForInstance(instance);

      if (descriptor.wantsRepaint) {
        const context: IHostContext = instance[CustomReconcilerConfig.contextSymbol];

        if (context !== undefined) {
          context.triggerRender();
          break;
        }
      }
    }
  }

  public appendChild(parentInstance: CustomRendererElementInstance,
                     childInstance: CustomRendererElementInstance): void {
    super.appendChild(parentInstance, childInstance);

    for (const instance of [parentInstance, childInstance]) {
      const descriptor = this.getDescriptorForInstance(instance);

      if (descriptor.wantsRepaint) {
        const context: IHostContext = instance[CustomReconcilerConfig.contextSymbol];

        if (context !== undefined) {
          context.triggerRender();
          break;
        }
      }
    }
  }

  public appendInitialChild(parentInstance: CustomRendererElementInstance,
                            childInstance: CustomRendererElementInstance): void {
    super.appendInitialChild(parentInstance, childInstance);

    for (const instance of [parentInstance, childInstance]) {
      const descriptor = this.getDescriptorForInstance(instance);

      if (descriptor.wantsRepaint) {
        const context = instance[CustomReconcilerConfig.contextSymbol];

        if (context !== undefined) {
          context.triggerRender();
          break;
        }
      }
    }
  }

  public commitUpdate(instance: CustomRendererElementInstance,
                      updatePayload: any[],
                      type: string,
                      oldProps: IPropMap,
                      newProps: IPropMap): void {
    if (this.getDescriptorForInstance(instance).commitUpdate(instance, updatePayload, oldProps, newProps)) {
      const descriptor = this.getDescriptorForInstance(instance);

      if (descriptor.wantsRepaint) {
        const context = instance[CustomReconcilerConfig.contextSymbol];

        if (context !== undefined) {
          context.triggerRender();
        }
      }
    }
  }
}

export default new ReactThreeReconcilerConfig();
