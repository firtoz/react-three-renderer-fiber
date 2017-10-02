import nativeTypes from "../../nativeTypes/index";
import fiberSymbol from "../utils/r3rFiberSymbol";

export default function removeChild(parent: any, child: any): any {
  const childType = child[fiberSymbol].type;

  const childDescriptor = nativeTypes[childType];

  if (!childDescriptor) {
    throw new Error("cannot remove this type yet: " + childType);
  }

  childDescriptor.willBeRemovedFromParent(child, parent);

  const parentInstance = parent[fiberSymbol];
  const type = parentInstance.type;

  const descriptor = nativeTypes[type];

  if (!descriptor) {
    throw new Error("cannot remove children from this type yet: " + type);
  }

  descriptor.removeChild(parent, child);
}
