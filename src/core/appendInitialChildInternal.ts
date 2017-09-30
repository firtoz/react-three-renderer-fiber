import * as THREE from 'three';
// import * as React from 'react';

import r3rFiberSymbol from './r3rFiberSymbol';
//
// const abc: symbol = Symbol('asdf');
//
// interface THREEElement extends React.ReactElement<any> {
// }
//
// interface InternalInstance {
//   // [index: string]: THREEElement;
//
//   // geometry: THREE.Geometry;
// }

export default function appendInitialChildInternal(parentInstance: any, child: any) {
  const parentInternalInstance = parentInstance[r3rFiberSymbol];
  const childInternalInstance = child[r3rFiberSymbol];

  const parentType = parentInternalInstance.type;
  const childType = childInternalInstance.type;

  switch (parentType) {
    case 'mesh':
      if (child instanceof THREE.Geometry) {
        parentInstance.geometry = child;
      } else if (child instanceof THREE.Material) {
        parentInstance.material = child;
      } else {
        throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
      }
      break;
    case 'scene':
      if (child instanceof THREE.Object3D) {
        parentInstance.add(child);
      } else {
        throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
      }
      break;
    case 'webglRenderer':
      if (!parentInstance.userData) {
        parentInstance.userData = {};
      }

      if (child instanceof THREE.Scene) {
        parentInstance.userData._scene = child;
      } else {
        throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
      }

      break;
    default:
      throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
  }
}
