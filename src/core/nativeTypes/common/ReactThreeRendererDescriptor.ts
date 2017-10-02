import {INativeElement} from "../../customRenderer/customRenderer";
import ReactThreeRenderer from "../../renderer/reactThreeRenderer";
import r3rFiberSymbol from "../../renderer/utils/r3rFiberSymbol";

export abstract class ReactThreeRendererDescriptor<TProps = any,
  T = any,
  TParent = any,
  TChild = never>
  implements INativeElement<TProps,
    T,
    TParent,
    TChild,
    HTMLCanvasElement,
    ReactThreeRenderer> {

  public abstract createInstance(props: TProps, rootContainerInstance: HTMLCanvasElement): T;

  public willBeRemovedFromParent(instance: T, parent: TParent): void {
    /* noop by default */
  }

  public applyInitialPropUpdates(instance: T, props: TProps) {
    /* noop by default */
  }

  public appendInitialChild(instance: T, child: TChild): void {
    throw new Error("tried to append a child to " + (instance as any)[r3rFiberSymbol].type);
  }

  public appendChild(instance: T, child: TChild): void {
    throw new Error("tried to append a child to " + (instance as any)[r3rFiberSymbol].type);
  }

  public removeChild(instance: T, child: TChild): void {
    throw new Error("tried to remove a child from " + (instance as any)[r3rFiberSymbol].type);
  }

  public abstract appendToContainer(instance: T, container: TParent): void;
}
