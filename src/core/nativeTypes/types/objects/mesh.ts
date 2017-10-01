import * as THREE from "three";
import {Object3DDescriptorBase, Object3DProps} from "./object3d";

interface MeshProps extends Object3DProps {
  geometry?: THREE.Geometry,
  material?: THREE.Material,
}

type MeshChildType = THREE.Geometry | THREE.Material;

class MeshCreator extends Object3DDescriptorBase<MeshProps, THREE.Mesh, MeshChildType> {
  createInstance(props: any) {
    return new THREE.Mesh(props.geometry, props.material);
  }

  appendInitialChild(instance: THREE.Mesh, child: MeshChildType): void {
    if (child instanceof THREE.Geometry) {
      instance.geometry = child;
    } else if (child instanceof THREE.Material) {
      instance.material = child;
    } else {
      super.appendInitialChild(instance, child);
      // throw new Error('cannot add ' + (child as any)[r3rFiberSymbol].type + ' as a childInstance to mesh');
    }
  }

  removeChild(instance: THREE.Mesh, child: MeshChildType): void {
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
