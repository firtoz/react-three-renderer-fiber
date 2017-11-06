import * as React from "react";
import ContainerUnawareReconcilerConfig from "../../customRenderer/ContainerUnawareReconcilerConfig";
import {CustomDescriptor} from "../../customRenderer/descriptors/CustomDescriptor";

export class TestDescriptor extends CustomDescriptor<any, any> {
  constructor() {
    super();
  }

  public createInstance(props: any, rootContainerInstance: any): any {
    return {};
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      test: any;
    }
  }
}

export class WRConfig extends ContainerUnawareReconcilerConfig<TestDescriptor> {
  constructor() {
    super();

    this.defineHostDescriptor("test", new TestDescriptor());
  }
}

export default new WRConfig();
