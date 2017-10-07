import getDescriptorForInstance from "../utils/getDescriptorForInstance";

export default function appendChild(parentInstance: any, childInstance: any): void {
  getDescriptorForInstance(parentInstance).appendChild(parentInstance, childInstance);
}
