import {BufferGeometry, Geometry, Line, Mesh, Points} from "three";
import final from "../../../customRenderer/decorators/final";
import {WrapperDetails} from "./ObjectWrapper";

export type GeometryContainerType = Mesh | Line | Points;

export abstract class GeometryWrapperBase<TProps, TInstance extends Geometry>
  extends WrapperDetails<TProps, TInstance> {
  protected container: GeometryContainerType | null = null;

  constructor(props: TProps) {
    super(props);

    this.wrapObject(this.constructGeometry(props));
  }

  public willBeAddedToParent(instance: TInstance, container: GeometryContainerType): boolean {
    if (this.container === container) {
      return false;
    }

    this.container = container;

    container.geometry = instance;

    return true;
  }

  public willBeRemovedFromParent(instance: TInstance, container: GeometryContainerType): void {
    if (this.container === container) {
      this.container = null;

      if (container.geometry === instance) {
        container.geometry = new BufferGeometry();
      }
    }

    // TODO check if dispose should happen here
    // TODO test this
    instance.dispose();
  }

  @final()
  protected recreateInstance(newProps: TProps): TInstance {
    const geometry = this.wrappedObject;

    if (geometry !== null) {
      const newGeometry = this.constructGeometry(newProps);

      if (this.container !== null) {
        this.container.geometry = newGeometry;
      }

      geometry.dispose();
      // TODO test disposal of old geometry!

      return newGeometry;
    }

    // it's not even mounted yet...
    throw new Error("props were modified before geometry could be mounted...\n" +
      "How did this happen?\n" +
      "Please create an issue with details!");
  }

  protected abstract constructGeometry(props: TProps): TInstance;
}

export abstract class BufferGeometryWrapperBase<TProps, TInstance extends BufferGeometry>
  extends WrapperDetails<TProps, TInstance> {
  protected container: GeometryContainerType | null = null;

  constructor(props: TProps) {
    super(props);

    this.wrapObject(this.constructGeometry(props));
  }

  public willBeAddedToParent(instance: TInstance, container: GeometryContainerType): boolean {
    if (this.container === container) {
      return false;
    }

    this.container = container;

    container.geometry = instance;

    return true;
  }

  public willBeRemovedFromParent(instance: TInstance, container: GeometryContainerType): void {
    if (this.container === container) {
      this.container = null;

      if (container.geometry === instance) {
        container.geometry = new BufferGeometry();
      }
    }

    // TODO check if dispose should happen here
    // TODO test this
    instance.dispose();
  }

  @final()
  protected recreateInstance(newProps: TProps): TInstance {
    const geometry = this.wrappedObject;

    if (geometry !== null) {
      const newGeometry = this.constructGeometry(newProps);

      if (this.container !== null) {
        this.container.geometry = newGeometry;
      }

      geometry.dispose();
      // TODO test disposal of old geometry!

      return newGeometry;
    }

    // it's not even mounted yet...
    throw new Error("props were modified before geometry could be mounted...\n" +
      "How did this happen?\n" +
      "Please create an issue with details!");
  }

  protected abstract constructGeometry(props: TProps): TInstance;
}
