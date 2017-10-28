import getDescriptorForInstance from "../utils/getDescriptorForInstance";

export default function appendChildToContainer(container: any, child: any): any {
  getDescriptorForInstance(child).appendToContainer(child, container);
}
