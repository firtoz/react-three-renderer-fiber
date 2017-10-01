import {IFiber} from "react-fiber-export";
import fiberSymbol from "../utils/r3rFiberSymbol";

export default function appendChild(parentInstance: any, childInstance: any): void {
  const parentFiber = parentInstance[fiberSymbol] as IFiber;
  const childFiber = childInstance[fiberSymbol] as IFiber;

  const parentType = parentFiber.type;
  const childType = childFiber.type;

  if (parentInstance instanceof HTMLCanvasElement) {
    // party time!
    return;
  }

  switch (parentType) {
    case "scene":
      console.log(parentInstance, childInstance);
      parentInstance.add(childInstance);
      break;
    default:
      throw new Error("cannot add " + childType + " as a childInstance to " + parentType);
    // break;
  }
}
