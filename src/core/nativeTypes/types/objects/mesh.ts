import {Geometry, Material, Mesh} from "three";
import {IObject3DProps, Object3DDescriptorBase} from "./object3D";

interface IMeshProps extends IObject3DProps {
  geometry?: Geometry;
  material?: Material;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: IReactThreeRendererElement<Mesh> & IMeshProps;
    }
  }
}

type MeshChildType = Geometry | Material;

class MeshCreator extends Object3DDescriptorBase<IMeshProps, Mesh, MeshChildType> {
  public createInstance(props: any) {
    return new Mesh(props.geometry, props.material);
  }

  public appendInitialChild(instance: Mesh, child: MeshChildType): void {
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
    super.removeChild(instance, child);
    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (child instanceof Material) {
      instance.material = child;
    } else {
      super.removeChild(instance, child);
      // throw new Error('cannot remove ' + (child as any)[r3rFiberSymbol].type + ' as a childInstance from mesh');
    }
  }
}

export default new MeshCreator();
