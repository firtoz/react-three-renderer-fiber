import * as PropTypes from "prop-types";
import {CustomReconcilerConfig} from "../../customRenderer/createReconciler";
import {hookDevtools} from "../../customRenderer/utils/DevtoolsHelpers";
import ReactThreeRendererDescriptor from "../../renderer/hostDescriptors/common/ReactThreeRendererDescriptor";

export class TestDescriptor extends ReactThreeRendererDescriptor<any, any> {
  constructor() {
    super();

    this.hasSimpleProp("hey").withType(PropTypes.number);
  }

  public createInstance(props: any, rootContainerInstance: any): any {
    return {};
  }
}

export class WRConfig extends CustomReconcilerConfig<TestDescriptor> {
  constructor() {
    super();

    this.defineHostDescriptor("test", new TestDescriptor());
  }

  public finalizeInitialChildren(r3rElement: any, type: any, props: any, rootContainerInstance: any): boolean {
    // console.log("finalizeInitialChildren", r3rElement, type, props, rootContainerInstance);
    // this.getDescriptorForInstance();

    return false;
  }

  public appendChildToContainer(parent: any, childInstance: any): void {
    const descriptor = this.getDescriptorForInstance(childInstance) as ReactThreeRendererDescriptor;

    descriptor.willBeAddedToParent(childInstance, parent);
  }

  public insertInContainerBefore(container: any, childInstance: any, before: any): void {
    const descriptor = this.getDescriptorForInstance(childInstance) as ReactThreeRendererDescriptor;

    descriptor.willBeAddedToParentBefore(childInstance, container, before);
  }

  public removeChildFromContainer(container: any, childInstance: any): void {
    const descriptor = this.getDescriptorForInstance(childInstance) as ReactThreeRendererDescriptor;

    descriptor.willBeRemovedFromParent(childInstance, container);
  }
}

const wrConfig: WRConfig = new WRConfig();

hookDevtools(wrConfig);

export default wrConfig;
