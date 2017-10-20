import * as THREE from "three";
import {BoxGeometry, BufferGeometry, Mesh} from "three";
import {WrappedEntityDescriptor, WrapperDetails} from "../../common/ObjectWrapper";

interface IBoxGeometryProps {
  width: number;
  height: number;
  depth: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      boxGeometry: IThreeElementPropsBase<THREE.BoxGeometry> & IBoxGeometryProps;
    }
  }
}

class BoxGeometryWrapper extends WrapperDetails<IBoxGeometryProps, BoxGeometry> {
  private container: Mesh | null;

  constructor(props: IBoxGeometryProps) {
    super(props);

    this.container = null;

    this.wrapObject(new BoxGeometry(props.width,
      props.height,
      props.depth,
      props.widthSegments,
      props.heightSegments,
      props.depthSegments));
  }

  public addedToParent(instance: BoxGeometry, container: Mesh): boolean {
    if (this.container === container) {
      return false;
    }

    this.container = container;

    return true;
  }

  public addedToParentBefore(instance: BoxGeometry, container: Mesh, before: any): boolean {
    return this.addedToParent(instance, container);
  }

  public willBeRemovedFromParent(instance: BoxGeometry, container: Mesh): void {
    if (this.container === container) {
      this.container = null;
    }
    /* */
  }

  protected recreateInstance(newProps: IBoxGeometryProps): BoxGeometry {
    const boxGeometry = this.wrappedObject;

    if (boxGeometry !== null) {
      const newBoxGeometry = new BoxGeometry(newProps.width,
        newProps.height,
        newProps.depth,
        newProps.widthSegments,
        newProps.heightSegments,
        newProps.depthSegments);

      if (this.container !== null) {
        this.container.geometry = newBoxGeometry;
      }

      return newBoxGeometry;
    }

    // it's not even mounted yet...
    throw new Error("props were modified before boxGeometry could be mounted...\n" +
      "How did this happen?\n" +
      "Please create an issue with details!");
  }
}

class BoxGeometryDescriptor extends WrappedEntityDescriptor<IBoxGeometryProps,
  BoxGeometry,
  Mesh,
  BoxGeometryWrapper> {
  constructor() {
    super(BoxGeometryWrapper, BoxGeometry);

    this.hasRemountProps("width",
      "height",
      "depth",
      "widthSegments",
      "heightSegments");
  }

  public insertInContainerBefore(instance: BoxGeometry, container: Mesh, before: any): void {
    container.geometry = instance;
  }

  public appendToContainer(instance: BoxGeometry, container: Mesh): void {
    container.geometry = instance;
  }

  public willBeRemovedFromContainer(instance: BoxGeometry, container: Mesh): void {
    if (container.geometry === instance) {
      (container as any).geometry = new BufferGeometry();
    }
  }
}

export default BoxGeometryDescriptor;
