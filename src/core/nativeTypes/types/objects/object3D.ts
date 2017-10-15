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

declare const process: {
  env: {
    NODE_ENV: string,
  };
};

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
    this.hasProp("position", (instance: Object3D,
                              newValue: Vector3 | null,
                              oldProps: IObject3DProps,
                              newProps: IObject3DProps): void => {
      if (newValue === null) {
        instance.position.set(0, 0, 0);
      } else {
        instance.position.copy(newValue);
      }

      if (newProps.lookAt !== undefined && newProps.lookAt !== null) {
        instance.lookAt(newProps.lookAt);
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
      if (lookAt !== undefined && lookAt !== null) {
        if (typeof process === "undefined" || process.env.NODE_ENV !== "production") {
          if (quaternion !== undefined && quaternion !== null) {
            console.warn("An object is being updated with both 'lookAt' and 'quaternion' properties.\n" +
              "Only 'lookAt' will be applied.");
          } else if (rotation !== undefined && rotation !== null) {
            console.warn("An object is being updated with both 'lookAt' and 'rotation' properties.\n" +
              "Only 'lookAt' will be applied.");
          }
        }
        instance.lookAt(lookAt);
      } else if (quaternion !== undefined && quaternion !== null) {
        instance.quaternion.copy(quaternion);
      } else if (rotation !== undefined && rotation !== null) {
        instance.rotation.copy(rotation);
      } else {
        // looks like everything is unset
        instance.quaternion.set(0, 0, 0, 0);
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

  public insertBefore(instance: T, child: TChild, before: any): void {
    if (child instanceof Object3D) {
      // instance.add(child);
    } else {
      throw new Error("cannot insert " +
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
      const indexInParent = parentInstance.children.indexOf(instance);
      if (indexInParent !== -1) {
        // need to move within the parent to the last index
        const spliced = parentInstance.children.splice(indexInParent, 1)[0];

        parentInstance.children.push(spliced);
      } else {
        parentInstance.add(instance);
      }
    } else {
      throw new Error("Trying to add a child into a non-object parent...");
    }
  }

  public addedToParentBefore(instance: T, parentInstance: TParent, before: any): void {
    if (parentInstance instanceof Object3D) {
      let instanceIndex = parentInstance.children.indexOf(instance);

      if (instanceIndex === -1) {
        parentInstance.add(instance);

        instanceIndex = parentInstance.children.length - 1;
      }

      const spliced = parentInstance.children.splice(instanceIndex, 1)[0];

      const otherIndex = parentInstance.children.indexOf(before);

      parentInstance.children.splice(otherIndex, 0, spliced);
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
