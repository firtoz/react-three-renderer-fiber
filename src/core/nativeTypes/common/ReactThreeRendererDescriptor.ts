import r3rFiberSymbol from "../../renderer/utils/r3rFiberSymbol";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";
import {NativeElement} from "../../customRenderer/customRenderer";

export abstract class ReactThreeRendererDescriptor<TProps = any,
  T = any,
  TParent = any,
  TChild = never>
  implements NativeElement<TProps,
    T,
    TParent,
    TChild,
    HTMLCanvasElement,
    ReactThreeRenderer> {

  abstract createInstance(props: TProps, rootContainerInstance: HTMLCanvasElement): T;

  willBeRemovedFromParent(instance: T, parent: TParent): void {
  }

  applyInitialPropUpdates(instance: T, props: TProps) {
  }

  appendInitialChild(instance: T, child: TChild): void {
    throw new Error('tried to append a child to ' + (instance as any)[r3rFiberSymbol].type);
  }

  removeChild(instance: T, child: TChild): void {
    throw new Error('tried to remove a child from ' + (instance as any)[r3rFiberSymbol].type);
  }
}
