import getDescriptorForInstance from "../utils/getDescriptorForInstance";

export default function appendInitialChildInternal(parentInstance: any, childInstance: any) {
  getDescriptorForInstance(parentInstance).appendInitialChild(parentInstance, childInstance);
}
