import {Geometry, Material, Mesh} from "three";
import getDescriptorForInstance from "../../../renderer/utils/getDescriptorForInstance";
import {IObject3DProps, Object3DDescriptorBase} from "./object3D";

interface IMeshProps extends IObject3DProps {
  geometry?: Geometry;
  material?: Material;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: IThreeElementPropsBase<Mesh> & IMeshProps;
    }
  }
}

type MeshChildType = Geometry | Material;

class MeshCreator extends Object3DDescriptorBase<IMeshProps, Mesh, MeshChildType> {
  public createInstance(props: any) {
    return new Mesh(props.geometry, props.material);
  }

  public appendInitialChild(instance: Mesh, child: MeshChildType): void {
    (getDescriptorForInstance(child) as any).addedToParent(child, instance);

    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (child instanceof Material) {
      instance.material = child;
    } else {
      super.appendInitialChild(instance, child);
      // throw new Error('cannot add ' + (child as any)[r3rFiberSymbol].type + ' as a childInstance to mesh');
    }
  }

  public removeChild(instance: Mesh, child: MeshChildType): void {
    getDescriptorForInstance(child).willBeRemovedFromParent(child, instance);

    if (child instanceof Geometry) {
      instance.geometry = null as any;
    } else if (child instanceof Material) {
      instance.material = null as any;
    } else {
      super.removeChild(instance, child);
      // throw new Error('cannot remove ' + (child as any)[r3rFiberSymbol].type + ' as a childInstance from mesh');
    }
  }
}

export default new MeshCreator();
