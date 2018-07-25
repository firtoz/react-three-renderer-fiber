import {PCFShadowMap, WebGLRenderer, WebGLShadowMap} from "three";
import {ShadowMapType} from "three/three-core";
import ReactThreeRendererDescriptor from "../common/ReactThreeRendererDescriptor";

interface IShadowMapProps {
  enabled: boolean;
  autoUpdate: boolean;
  needsUpdate: boolean;
  type: ShadowMapType;
}

export class WebGLShadowMapWrapper {
  private enabled: boolean;
  private autoUpdate: boolean;
  private needsUpdate: boolean;
  private type: ShadowMapType;

  private wrappedInstance: WebGLShadowMap | null = null;

  public setEnabled(value: boolean) {
    this.enabled = value;
    if (this.wrappedInstance != null) {
      this.wrappedInstance.enabled = value;
    }
  }

  public setAutoUpdate(value: boolean) {
    this.autoUpdate = value;
    if (this.wrappedInstance != null) {
      this.wrappedInstance.autoUpdate = value;
    }
  }

  public setNeedsUpdate(value: boolean) {
    this.needsUpdate = value;
    if (this.wrappedInstance != null) {
      this.wrappedInstance.needsUpdate = value;
    }
  }

  public setType(value: ShadowMapType) {
    this.type = value;
    if (this.wrappedInstance != null) {
      this.wrappedInstance.type = value;
    }
  }

  public setWrappedInstance(instance: WebGLShadowMap | null) {
    this.wrappedInstance = instance;

    if (instance != null) {
      instance.enabled = this.enabled;
      instance.autoUpdate = this.autoUpdate;
      instance.needsUpdate = this.needsUpdate;
      instance.type = this.type;
    }
  }
}

export default class WebGLShadowMapDescriptor extends ReactThreeRendererDescriptor<IShadowMapProps,
  WebGLShadowMapWrapper,
  WebGLRenderer> {
  constructor() {
    super();
    this.hasProp<boolean>("enabled", (instance, newValue) => {
      instance.setEnabled(newValue);
    }).withDefault(false);

    this.hasProp<boolean>("autoUpdate", (instance, newValue) => {
      instance.setAutoUpdate(newValue);
    }).withDefault(true);

    this.hasProp<boolean>("needsUpdate", (instance, newValue) => {
      instance.setNeedsUpdate(newValue);
    }).withDefault(false);

    this.hasProp<ShadowMapType>("type", (instance, newValue) => {
      instance.setType(newValue);
    }).withDefault(PCFShadowMap);
  }

  public createInstance(props: IShadowMapProps): WebGLShadowMapWrapper {
    return new WebGLShadowMapWrapper();
  }

  public willBeRemovedFromParent(instance: WebGLShadowMapWrapper, parent: WebGLRenderer): void {
    super.willBeRemovedFromParent(instance, parent);

    instance.setWrappedInstance(null);
  }

  public willBeAddedToParentBefore(instance: WebGLShadowMapWrapper, parentInstance: WebGLRenderer, before: any): void {
    super.willBeAddedToParentBefore(instance, parentInstance, before);

    instance.setWrappedInstance(parentInstance.shadowMap);
  }

  public willBeAddedToParent(instance: WebGLShadowMapWrapper, parent: WebGLRenderer): void {
    super.willBeAddedToParent(instance, parent);

    instance.setWrappedInstance(parent.shadowMap);
  }
}
