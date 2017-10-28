import getDescriptorForInstance from "../utils/getDescriptorForInstance";

export default function insertInContainerBefore(container: any, childInstance: any, before: any): any {
  getDescriptorForInstance(childInstance).insertInContainerBefore(childInstance, container, before);
}
