import {IFiber} from "react-fiber-export";
import nativeTypes from "../../nativeTypes/index";
import r3rFiberSymbol from "../utils/r3rFiberSymbol";

export default function appendChildToContainer(container: any, child: any): any {
  console.log("appendChildToContainer");

  if (container instanceof HTMLCanvasElement) {
    // party time!
    return;
  }

  console.log("appending", child, "to", container);

  // throw new Error("appendChildToContainer");
  // return false;

  const childFiber = child[r3rFiberSymbol] as IFiber;

  const childType = childFiber.type;

  const descriptor = nativeTypes[childType];

  if (!descriptor) {
    throw new Error("cannot create this type yet: " + childType);
  }

  descriptor.appendToContainer(child, container);
}
