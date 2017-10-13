import {Object3D, Scene, WebGLRenderer} from "three";
import {IObject3DProps, Object3DDescriptorBase} from "./object3D";

type SceneParents = Object3D | WebGLRenderer;

export type SceneElementProps = IThreeElementPropsBase<Scene> & IObject3DProps;

export type SceneElement = JSX.IElement<Scene, "scene", SceneElementProps>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      scene: SceneElementProps;
    }
  }
}

class SceneDescriptor extends Object3DDescriptorBase<IObject3DProps, Scene, SceneParents> {
  public createInstance(props: IObject3DProps) {
    return new Scene();
  }

  public addedToParent(instance: Scene, container: SceneParents): void {
    if (container instanceof WebGLRenderer) {
      // no-op
    } else {
      super.addedToParent(instance, container);
    }
  }
}

export default new SceneDescriptor();
