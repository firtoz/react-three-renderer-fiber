import {IResourcesProps} from "../../../tests/src/extensions/resourcerenderer";
import {IThreeElementPropsBase} from "../../core/renderer/hostDescriptors/common/IReactThreeRendererElement";
import ReactThreeRendererDescriptor from "../../core/renderer/hostDescriptors/common/ReactThreeRendererDescriptor";
import ResourceContainer from "./ResourcesContainer";

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
    // return undefined;
  }

  public appendChild(instance: ResourceContainer, child: any): void {
    console.log("appending: ", child);

    super.appendChild(instance, child);
  }

  public removeChild(instance: ResourceContainer, child: any): void {
    // console.log("removing: ", child);

    super.removeChild(instance, child);
  }

  public insertBefore(parentInstance: ResourceContainer, childInstance: any, before: any): void {
    console.log("insertBefore", parentInstance);
    super.insertBefore(parentInstance, childInstance, before);
  }

  public appendInitialChild(instance: ResourceContainer, child: any): void {
    // console.log("appendInitialChild", instance, child);

    super.appendInitialChild(instance, child);
  }

  public willBeRemovedFromParent(instance: ResourceContainer, parent: any): void {
    // console.log("willBeRemovedFromParent", instance);

    // debugger;

    super.willBeRemovedFromParent(instance, parent);
  }

// public insertInContainerBefore(instance: Resources, container: any, before: any): void {
  //   console.log("insertInContainerBefore", instance);
  //   super.insertInContainerBefore(instance, container, before);
  // }

  // public willBeRemovedFromContainer(instance: Resources, container: any): void {
  //   console.log("willBeRemovedFromContainer", instance);
  //   super.willBeRemovedFromContainer(instance, container);
  // }

  // public appendToContainer(instance: Resources, container: any): void {
  //   console.log("appendToContainer", instance);
  //   super.appendToContainer(instance, container);
  // }
}
