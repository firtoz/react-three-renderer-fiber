import * as THREE from "three";
import {Euler, Object3D, Quaternion, Vector3} from "three";
import r3rFiberSymbol from "../../../renderer/utils/r3rFiberSymbol";
import {PropertyDescriptorBase} from "../../common/IPropertyDescriptor";
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
      object3D: IReactThreeRendererElement<THREE.Object3D> & IObject3DProps;
    }
  }
}

abstract class Object3DPropertyDescriptor<TProp> extends PropertyDescriptorBase<IObject3DProps,
  Object3D,
  TProp> {
  public abstract update(instance: Object3D,
                         newValue: TProp,
                         oldProps: IObject3DProps,
                         newProps: IObject3DProps): void;
}

const lookAtSymbol = Symbol("r3rLookAtCallback");

const incompatiblePropsForLookAt = [
  "rotation",
  "quaternion",
];

class IncompatiblePropError extends Error {
  constructor(firstProp: string, secondProp: string) {
    super("An object has been detected"
      + `with both "${firstProp}" and "${secondProp}" properties.`
      + "Please remove either property.");
  }
}

function resetRotation(instance: Object3D, props: IObject3DProps) {
  // if any of the below are set, then other prop updates should deal with it
  if (typeof props.lookAt !== "undefined"
    && typeof props.rotation !== "undefined"
    && typeof props.quaternion !== "undefined") {
    instance.quaternion.set(0, 0, 0, 0);
  }
}

function updateLookAt(instance: Object3D, value: Vector3 | null, props: IObject3DProps) {
  if (value === null) {
    (instance as any)[lookAtSymbol] = undefined;

    resetRotation(instance, props);
  } else {
    for (let i = 0; i < 2; ++i) {
      if (typeof (props as any)[incompatiblePropsForLookAt[i]] !== "undefined") {
        throw new IncompatiblePropError("lookAt", incompatiblePropsForLookAt[i]);
      }
    }

    (instance as any)[lookAtSymbol] = value;

    instance.lookAt(value);
  }
}

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

    this.hasSimpleProp("name");
    this.hasProp<Vector3>("position", (instance: Object3D, newValue: Vector3 | null): void => {
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

    this.hasProp<Euler>("rotation", (instance: Object3D,
                                     newValue: Euler | null,
                                     oldProps: IObject3DProps,
                                     newProps: IObject3DProps): void => {
      if (newValue === null) {
        resetRotation(instance, newProps);
      } else {
        instance.rotation.copy(newValue);
      }
    });

    this.hasProp<Quaternion>("quaternion", (instance: Object3D,
                                            newValue: Quaternion | null,
                                            oldProps: IObject3DProps,
                                            newProps: IObject3DProps): void => {
      if (newValue === null) {
        resetRotation(instance, newProps);
      } else {
        instance.quaternion.copy(newValue);
      }
    });

    this.hasProp<Vector3>("lookAt", (instance: Object3D,
                                     newValue: Vector3 | null,
                                     oldProps: IObject3DProps,
                                     newProps: IObject3DProps): void => {
      updateLookAt(instance, newValue, newProps);
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
