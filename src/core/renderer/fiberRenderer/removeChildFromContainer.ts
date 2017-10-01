import fiberSymbol from "../utils/r3rFiberSymbol";
import nativeTypes from "../../nativeTypes/index";

export default function removeChildFromContainer(container: any, child: any): void {
  const childType = child[fiberSymbol].type;

  const childDescriptor = nativeTypes[childType];

  childDescriptor.willBeRemovedFromParent(child, parent);
}
