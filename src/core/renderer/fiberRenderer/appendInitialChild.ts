import * as THREE from 'three';

import r3rFiberSymbol from '../utils/r3rFiberSymbol';

export default function appendInitialChildInternal(parentInstance: any, childInstance: any) {
  const parentInternalInstance = parentInstance[r3rFiberSymbol];
  const childInternalInstance = childInstance[r3rFiberSymbol];

  const parentType = parentInternalInstance.type;
  const childType = childInternalInstance.type;

  switch (parentType) {
    case 'mesh':
      if (childInstance instanceof THREE.Geometry) {
        parentInstance.geometry = childInstance;
      } else if (childInstance instanceof THREE.Material) {
        parentInstance.material = childInstance;
      } else {
        throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
      }
      break;
    case 'scene':
      if (childInstance instanceof THREE.Object3D) {
        parentInstance.add(childInstance);
      } else {
        throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
      }
      break;
    case 'webglRenderer':
      if (!parentInstance.userData) {
        parentInstance.userData = {};
      }

      if (childInstance instanceof THREE.Scene) {
        parentInstance.userData._scene = childInstance;
      } else {
        throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
      }

      break;
    default:
      throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
  }
}
