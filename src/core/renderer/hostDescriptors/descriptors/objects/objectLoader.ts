import {Object3D, ObjectLoader, WebGLRenderer} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase, IObject3DProps} from "../../common/object3DBase";
import {IElement} from "../../common/RefWrapper";

export type ObjectLoaderParents = Object3D | WebGLRenderer;

export interface IObjectLoaderProps extends IObject3DProps {
  load?: string;
}

export type ObjectLoaderElementProps = IThreeElementPropsBase<ObjectLoader> & IObjectLoaderProps;

export type ObjectLoaderElement = IElement<ObjectLoader, ObjectLoaderElementProps>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      objectLoader: ObjectLoaderElementProps;
    }
  }
}

const objectLoaderSymbol = Symbol("ObjectLoader");

class ObjectLoaderDescriptor extends Object3DDescriptorBase<IObject3DProps, Object3D, ObjectLoaderParents> {
  constructor() {
    super();

    this.hasProp("url", (instance, newValue: string) => {
      const userData: any = instance.userData;

      const objectLoader: ObjectLoader = userData[objectLoaderSymbol];

      objectLoader.load(newValue, (object) => {
        console.log("object loaded", object);

        // TODO replace the object here
      });
    });
  }

  public createInstance(props: IObject3DProps) {
    const object3D = new Object3D();

    const userData: any = object3D.userData;

    userData[objectLoaderSymbol] = new ObjectLoader();

    return object3D;
  }
}

export default ObjectLoaderDescriptor;
