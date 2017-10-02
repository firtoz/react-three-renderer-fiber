import {IFiber} from "react-fiber-export";
import nativeTypes from "../../nativeTypes/index";
import r3rFiberSymbol from "../utils/r3rFiberSymbol";

export default function appendChildToContainer(container: any, child: any): any {
  const childFiber = child[r3rFiberSymbol] as IFiber;

  const childType = childFiber.type;

  const descriptor = nativeTypes[childType];

  if (!descriptor) {
    throw new Error("cannot create this type yet: " + childType);
  }

  descriptor.appendToContainer(child, container);
}
