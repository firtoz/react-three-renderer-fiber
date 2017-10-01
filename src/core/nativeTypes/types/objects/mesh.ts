import * as THREE from "three";
import {IObject3DProps, Object3DDescriptorBase} from "./object3d";

interface IMeshProps extends IObject3DProps {
  geometry?: THREE.Geometry;
  material?: THREE.Material;
}

type MeshChildType = THREE.Geometry | THREE.Material;

class MeshCreator extends Object3DDescriptorBase<IMeshProps, THREE.Mesh, MeshChildType> {
  public createInstance(props: any) {
    return new THREE.Mesh(props.geometry, props.material);
  }

  public appendInitialChild(instance: THREE.Mesh, child: MeshChildType): void {
    if (child instanceof THREE.Geometry) {
      instance.geometry = child;
    } else if (child instanceof THREE.Material) {
      instance.material = child;
    } else {
      super.appendInitialChild(instance, child);
      // throw new Error('cannot add ' + (child as any)[r3rFiberSymbol].type + ' as a childInstance to mesh');
    }
  }

  public removeChild(instance: THREE.Mesh, child: MeshChildType): void {
    if (child instanceof THREE.Geometry) {
      instance.geometry = child;
    } else if (child instanceof THREE.Material) {
      instance.material = child;
    } else {
      super.removeChild(instance, child);
      // throw new Error('cannot remove ' + (child as any)[r3rFiberSymbol].type + ' as a childInstance from mesh');
    }
  }
}

export default new MeshCreator();
