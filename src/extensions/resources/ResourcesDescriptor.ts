import {IPropsWithChildren} from "../../core/renderer/hostDescriptors/common/IPropsWithChildren";
import {IThreeElementPropsBase} from "../../core/renderer/hostDescriptors/common/IReactThreeRendererElement";
import ReactThreeRendererDescriptor from "../../core/renderer/hostDescriptors/common/ReactThreeRendererDescriptor";
import ResourceContainer from "./ResourceContainer";

// tslint:disable-next-line no-empty-interface
export interface IResourcesProps extends IPropsWithChildren {

}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      resources: IThreeElementPropsBase<ResourceContainer> & IResourcesProps;
    }
  }
}

export class ResourcesDescriptor extends ReactThreeRendererDescriptor<{},
  ResourceContainer,
  any,
  any> {
  public createInstance(props: {}, rootContainerInstance: any): ResourceContainer {
    return new ResourceContainer();
  }

  public insertBefore(parentInstance: ResourceContainer, childInstance: any, before: any): void {
    console.log("insertBefore", parentInstance);
    super.insertBefore(parentInstance, childInstance, before);
  }

  public willBeRemovedFromParent(instance: ResourceContainer, parentInstance: any): void {
    if (parentInstance instanceof ResourceContainer) {
      ResourceContainer.UnmountResourceFromContainer(instance);
    }
    // console.log("willBeRemovedFromParent", instance);

    // debugger;

    super.willBeRemovedFromParent(instance, parentInstance);
  }

  public willBeAddedToParentBefore(instance: ResourceContainer, parentInstance: any, before: any): void {
    if (parentInstance instanceof ResourceContainer) {
      parentInstance.MountResourceToContainer(instance);
    }

    super.willBeAddedToParentBefore(instance, parentInstance, before);
  }

  public willBeAddedToParent(instance: ResourceContainer, parentInstance: any): void {
    if (parentInstance instanceof ResourceContainer) {
      parentInstance.MountResourceToContainer(instance);
    }

    super.willBeAddedToParent(instance, parentInstance);
  }
}
