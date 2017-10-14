import getDescriptorForInstance from "../utils/getDescriptorForInstance";

export default function insertBefore(parentInstance: any, childInstance: any, before: any): any {
  getDescriptorForInstance(parentInstance).insertBefore(parentInstance, childInstance, before);
}
