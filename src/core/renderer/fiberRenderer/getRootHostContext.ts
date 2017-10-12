import r3rContextSymbol from "../utils/r3rContextSymbol";

const emptyObject = {};

export default function getRootHostContext(rootContainerInstance: any) {
  // console.log("getRootHostContext", this);
  if (rootContainerInstance && rootContainerInstance[r3rContextSymbol] !== undefined) {
    return rootContainerInstance[r3rContextSymbol];
  }

  return emptyObject;
}
