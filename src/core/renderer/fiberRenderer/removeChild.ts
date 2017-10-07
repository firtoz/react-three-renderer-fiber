import getDescriptorForInstance from "../utils/getDescriptorForInstance";

export default function removeChild(parent: any, child: any): any {
  getDescriptorForInstance(child).willBeRemovedFromParent(child, parent);
  getDescriptorForInstance(parent).removeChild(parent, child);
}
