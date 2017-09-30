import fiberSymbol from "../../r3rFiberSymbol";

export default function removeChild(currentParent: any, child: any): any {
  const parentInstance = currentParent[fiberSymbol];
  switch (parentInstance.type) {
    case 'scene':
      currentParent.remove(child);

      break;
    default:
      console.log('removeChild', parentInstance.type, child);
      throw new Error('removeChild');
  }

  // debugger;
  //
  // console.log('removeChild', arguments);
  // throw new Error('removeChild');
  // return false;
}
