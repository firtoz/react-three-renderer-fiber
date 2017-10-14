import * as THREE from "three";
import {Euler, Object3D, Quaternion, Vector3} from "three";
import r3rFiberSymbol from "../../../renderer/utils/r3rFiberSymbol";
import {IPropsWithChildren} from "../../common/IPropsWithChildren";
import {ReactThreeRendererDescriptor} from "../../common/ReactThreeRendererDescriptor";

export interface IObject3DProps extends IPropsWithChildren {
  name?: string;
  position?: Vector3;
  rotation?: Euler;
  quaternion?: Quaternion;
  lookAt?: Vector3;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      object3D: IThreeElementPropsBase<THREE.Object3D> & IObject3DProps;
    }
  }
}

const lookAtSymbol = Symbol("r3rLookAtCallback");

export abstract class Object3DDescriptorBase<TProps extends IObject3DProps,
  T extends Object3D,
  TChild = Object3D,
  TParent = Object3D>

  extends ReactThreeRendererDescriptor<TProps,
    T,
    TParent,
    TChild> {

  public constructor() {
    super();

    this.hasSimpleProp("name", true, false);

    // this.hasSimpleProp("name", true, true);
    this.hasProp("position", (instance: Object3D, newValue: Vector3 | null): void => {
      if (newValue === null) {
        instance.position.set(0, 0, 0);
      } else {
        instance.position.copy(newValue);
      }

      const lookingAt = (instance as any)[lookAtSymbol];

      if (typeof lookingAt !== "undefined") {
        instance.lookAt(lookingAt);
      }
    });

    this.hasPropGroup([
      "rotation",
      "quaternion",
      "lookAt",
    ], (instance: Object3D,
        {rotation, quaternion, lookAt}: {
          rotation?: Euler,
          quaternion?: Quaternion,
          lookAt?: Vector3,
        }) => {
      if (rotation === undefined && quaternion === undefined && lookAt === undefined) {
        instance.quaternion.set(0, 0, 0, 0);
      }

      if (lookAt !== undefined) {
        instance.lookAt(lookAt);
        return;
      }

      if (quaternion !== undefined) {
        instance.quaternion.copy(quaternion);
        return;
      }

      if (rotation !== undefined) {
        instance.rotation.copy(rotation);
      }
    });
  }

  public appendInitialChild(instance: T, child: TChild): void {
    super.appendInitialChild(instance, child);
    this.appendChild(instance, child);
  }

  public appendChild(instance: T, child: TChild): void {
    if (child instanceof Object3D) {
      // instance.add(child);
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

  public addedToParent(instance: T, parentInstance: TParent): void {
    if (parentInstance instanceof Object3D) {
      // console.log("well the parent should contain us: ", parentInstance.children.indexOf(instance));
      parentInstance.add(instance);
    } else {
      throw new Error("Trying to add a child into a non-object parent...");
    }
  }

  public willBeRemovedFromParent(instance: T, parent: TParent): void {
    if (parent instanceof Object3D) {
      parent.remove(instance);
    } else {
      throw new Error("Trying to remove a child from a non-object parent...");
    }
  }
}

class Object3DDescriptor extends Object3DDescriptorBase<IObject3DProps, Object3D> {
  public createInstance(props: IObject3DProps) {
    return new Object3D();
  }
}

export default new Object3DDescriptor();
