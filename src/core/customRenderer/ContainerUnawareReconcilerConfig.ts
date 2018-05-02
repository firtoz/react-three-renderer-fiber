import {CustomReconcilerConfig} from "./createReconciler";
import {IHostDescriptor} from "./descriptors/IHostDescriptor";

declare function require(filename: string): any;

export class ContainerUnawareReconcilerConfig<TDescriptor extends IHostDescriptor<any,
  any,
  any,
  any,
  any>> extends CustomReconcilerConfig<TDescriptor> {
  public appendChildToContainer(parent: any, childInstance: any): void {
    const descriptor = this.getDescriptorForInstance(childInstance);

    descriptor.willBeAddedToParent(childInstance, parent);
  }

  public insertInContainerBefore(container: any, childInstance: any, before: any): void {
    const descriptor = this.getDescriptorForInstance(childInstance);

    descriptor.willBeAddedToParentBefore(childInstance, container, before);
  }

  public removeChildFromContainer(container: any, childInstance: any): void {
    const descriptor = this.getDescriptorForInstance(childInstance);

    descriptor.willBeRemovedFromParent(childInstance, container);
  }
}

export default ContainerUnawareReconcilerConfig;
