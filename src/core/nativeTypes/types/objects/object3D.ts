import {Euler, Object3D, Vector3} from "three";
import r3rFiberSymbol from "../../../renderer/utils/r3rFiberSymbol";
import {ReactThreeRendererDescriptor} from "../../common/ReactThreeRendererDescriptor";

export interface IObject3DProps {
  name?: string;
  position?: Vector3;
  rotation?: Euler;
}

export abstract class Object3DDescriptorBase<TProps extends IObject3DProps,
  T extends Object3D,
  TChild = Object3D,
  TParent = Object3D>

  extends ReactThreeRendererDescriptor<TProps,
    T,
    TParent,
    TChild> {

  public applyInitialPropUpdates(instance: T, props: TProps): void {
    const {
      name,
      position,
      rotation,
    } = props;

    if (position != null) {
      instance.position.copy(position);
    }

    if (name != null) {
      instance.name = name;
    }

    if (rotation != null) {
      instance.rotation.copy(rotation);
    }
  }

  public appendInitialChild(instance: T, child: TChild): void {
    if (child instanceof Object3D) {
      instance.add(child);
    } else {
      throw new Error("cannot add " +
        (child as any)[r3rFiberSymbol].type +
        " as a childInstance to " +
        (instance as any)[r3rFiberSymbol].type);
    }
  }

  public removeChild(instance: T, child: TChild): void {
    super.removeChild(instance, child);

    if (child instanceof Object3D) {
      instance.remove(child);
    } else {
      throw new Error("cannot remove " +
        (child as any)[r3rFiberSymbol].type +
        " as a childInstance from " +
        (instance as any)[r3rFiberSymbol].type);
    }
  }
}

class Object3DDescriptor extends Object3DDescriptorBase<IObject3DProps, Object3D> {
  public createInstance(props: IObject3DProps) {
    return new Object3D();
  }

  public appendToContainer(instance: Object3D, container: Object3D): void {
    console.log("gotta append myself to the parent now?!");
    container.add(instance);
  }
}

export default new Object3DDescriptor();
