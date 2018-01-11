import {Group, Object3D, WebGLRenderer} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase, IObject3DProps} from "../../common/object3DBase";
import {IElement} from "../../common/RefWrapper";

export type GroupParents = Object3D | WebGLRenderer;

export type GroupElementProps = IThreeElementPropsBase<Group> & IObject3DProps;

export type GroupElement = IElement<Group, GroupElementProps>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: GroupElementProps;
    }
  }
}

class GroupDescriptor extends Object3DDescriptorBase<IObject3DProps, Group, GroupParents> {
  public createInstance(props: IObject3DProps) {
    return new Group();
  }
}

export default GroupDescriptor;
