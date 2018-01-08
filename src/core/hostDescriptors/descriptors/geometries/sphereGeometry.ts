import * as THREE from "three";
import {BufferGeometry, Mesh, SphereGeometry} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {WrappedEntityDescriptor, WrapperDetails} from "../../common/ObjectWrapper";

export interface ISphereGeometryProps {
  radius: number;
  widthSegments?: number;
  heightSegments?: number;
  phiStart?: number;
  phiLength?: number;
  thetaStart?: number;
  thetaLength?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      sphereGeometry: IThreeElementPropsBase<THREE.SphereGeometry> & ISphereGeometryProps;
    }
  }
}

export class SphereGeometryWrapper extends WrapperDetails<ISphereGeometryProps, SphereGeometry> {
  private container: Mesh | null;

  constructor(props: ISphereGeometryProps) {
    super(props);

    this.container = null;

    this.wrapObject(new SphereGeometry(props.radius,
      props.widthSegments,
      props.heightSegments,
      props.phiStart,
      props.phiLength,
      props.thetaStart,
      props.thetaLength,
    ));
  }

  public addedToParent(instance: SphereGeometry, container: Mesh): boolean {
    if (this.container === container) {
      return false;
    }

    this.container = container;

    return true;
  }

  public addedToParentBefore(instance: SphereGeometry, container: Mesh, before: any): boolean {
    return this.addedToParent(instance, container);
  }

  public willBeRemovedFromParent(instance: SphereGeometry, container: Mesh): void {
    if (this.container === container) {
      this.container = null;
    }
    /* */
  }

  protected recreateInstance(newProps: ISphereGeometryProps): SphereGeometry {
    const sphereGeometry = this.wrappedObject;

    if (sphereGeometry !== null) {
      const newSphereGeometry = new SphereGeometry(newProps.radius,
        newProps.widthSegments,
        newProps.heightSegments,
        newProps.phiStart,
        newProps.phiLength,
        newProps.thetaStart,
        newProps.thetaLength,
      );

      if (this.container !== null) {
        this.container.geometry = newSphereGeometry;
      }

      return newSphereGeometry;
    }

    // it's not even mounted yet...
    throw new Error("props were modified before sphereGeometry could be mounted...\n" +
      "How did this happen?\n" +
      "Please create an issue with details!");
  }
}

class SphereGeometryDescriptor extends WrappedEntityDescriptor<ISphereGeometryProps,
  SphereGeometry,
  Mesh,
  SphereGeometryWrapper> {
  constructor() {
    super(SphereGeometryWrapper, SphereGeometry);

    this.hasRemountProps("radius",
      "widthSegments",
      "heightSegments",
      "phiStart",
      "phiLength",
      "thetaStart",
      "thetaLength",
    );
  }

  public insertInContainerBefore(instance: SphereGeometry, container: Mesh, before: any): void {
    container.geometry = instance;
  }

  public appendToContainer(instance: SphereGeometry, container: Mesh): void {
    container.geometry = instance;
  }

  public willBeRemovedFromContainer(instance: SphereGeometry, container: Mesh): void {
    if (container.geometry === instance) {
      (container as any).geometry = new BufferGeometry();
    }
  }
}

export default SphereGeometryDescriptor;
