import fiberSymbol from "../utils/r3rFiberSymbol";
import nativeTypes from "../../nativeTypes/index";

export default function removeChild(currentParent: any, child: any): any {
  const childType = child[fiberSymbol].type;

  const childDescriptor = nativeTypes[childType];

  if (!childDescriptor) {
    throw new Error('cannot remove this type yet: ' + childType);
  }

  childDescriptor.willBeRemovedFromParent(child, parent);

  const parentInstance = currentParent[fiberSymbol];
  const type = parentInstance.type;

  const descriptor = nativeTypes[type];

  if (!descriptor) {
    throw new Error('cannot remove children from this type yet: ' + type);
  }

  descriptor.removeChild(currentParent, child);

  // switch (parentInstance.type) {
  //   case 'scene':
  //     currentParent.remove(child);
  //
  //     break;
  //   default:
  //     console.log('removeChild', parentInstance.type, child);
  //     throw new Error('removeChild');
  // }

  // debugger;
  //
  // console.log('removeChild', arguments);
  // throw new Error('removeChild');
  // return false;
}
