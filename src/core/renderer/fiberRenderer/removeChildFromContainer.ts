import nativeTypes from "../../nativeTypes/index";
import fiberSymbol from "../utils/r3rFiberSymbol";

export default function removeChildFromContainer(container: any, child: any): void {
  const childType = child[fiberSymbol].type;

  const childDescriptor = nativeTypes[childType];

  childDescriptor.willBeRemovedFromParent(child, parent);
}
