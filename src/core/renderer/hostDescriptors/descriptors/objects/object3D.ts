import * as THREE from "three";
import {Object3D} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import Object3DDescriptorBase, {IObject3DProps} from "../../common/object3DBase";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      object3D: IThreeElementPropsBase<THREE.Object3D> & IObject3DProps;
    }
  }
}

class Object3DDescriptor extends Object3DDescriptorBase<IObject3DProps, Object3D> {
  public createInstance(props: IObject3DProps) {
    return new Object3D();
  }
}

export default Object3DDescriptor;
