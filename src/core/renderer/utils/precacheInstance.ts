import fiberSymbol from "../../r3rFiberSymbol";

export default function precacheInstance(fiber: ReactFiber.Fiber, threeElement: any) {
  threeElement[fiberSymbol] = fiber;
}
