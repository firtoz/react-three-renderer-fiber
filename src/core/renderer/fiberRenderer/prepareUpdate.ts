import diffProperties from "../../diffProperties";

export default function prepareUpdate(instance: any, type: any, oldProps: any, newProps: any, rootContainerInstance: any, hostContext: any) {
  return diffProperties(
    oldProps,
    newProps,
  );
}
