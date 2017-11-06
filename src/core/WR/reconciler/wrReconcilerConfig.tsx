import * as PropTypes from "prop-types";
import {Component} from "react";
import * as React from "react";
import {CustomReconcilerConfig} from "../../customRenderer/createReconciler";
import ReactThreeRendererDescriptor from "../../renderer/hostDescriptors/common/ReactThreeRendererDescriptor";
import ContainerUnawareReconcilerConfig from "../../customRenderer/ContainerUnawareReconcilerConfig";

export abstract class TestDescriptor extends ReactThreeRendererDescriptor<any, any> {
  constructor() {
    super();

  }

}

abstract class PathInstruction {
  public abstract perform(ctx: CanvasRenderingContext2D): void;
}

class Path {
  private instructions: PathInstruction[];
  private fill: boolean = false;
  private stroke: boolean = false;

  constructor() {
    this.instructions = [];
  }

  public render(ctx: CanvasRenderingContext2D) {
    if (this.instructions.length === 0) {
      return;
    }

    ctx.beginPath();

    this.instructions.forEach((instruction) => {
      instruction.perform(ctx);
    });

    if (this.fill) {
      ctx.fill();
    }

    if (this.stroke) {
      ctx.stroke();
    }

    ctx.closePath();
  }
}

export class PathDescriptor extends TestDescriptor {
  constructor() {
    super();
  }

  public createInstance(props: any, rootContainerInstance: any): any {
    return new Path();
  }
}

class MoveToInstruction extends PathInstruction {
  constructor(public x: number, public y: number) {
    super();
  }

  public perform(ctx: CanvasRenderingContext2D): void {
    ctx.moveTo(0, 0);
  }
}

class LineToInstruction extends PathInstruction {
  constructor(public x: number, public y: number) {
    super();
  }

  public perform(ctx: CanvasRenderingContext2D): void {
    ctx.lineTo(0, 0);
  }
}

export abstract class DescriptiorWithPosition extends TestDescriptor {
  constructor() {
    super();

    this.hasSimpleProp("x").withType(PropTypes.number.isRequired);
    this.hasSimpleProp("y").withType(PropTypes.number.isRequired);
  }

  public willBeAddedToParent(instance: any, parent: any): void {
    super.willBeAddedToParent(instance, parent);
  }

  public willBeAddedToParentBefore(instance: any, parentInstance: any, before: any): void {
    // super.willBeAddedToParentBefore(instance, parentInstance, before);
  }
}

export class MoveToDescriptor extends DescriptiorWithPosition {
  constructor() {
    super();
  }

  public createInstance(props: any, rootContainerInstance: any): any {
    return new MoveToInstruction(props.x, props.y);
  }
}

export class LineToDescriptor extends DescriptiorWithPosition {
  constructor() {
    super();
  }

  public createInstance(props: any, rootContainerInstance: any): any {
    return new LineToInstruction(props.x, props.y);
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      net: any;
    }
  }
}

export class WRConfig extends ContainerUnawareReconcilerConfig<TestDescriptor> {
  constructor() {
    super();

    this.defineHostDescriptor("wr_path", new PathDescriptor());
    this.defineHostDescriptor("wr_moveTo", new MoveToDescriptor());
    this.defineHostDescriptor("wr_lineTo", new LineToDescriptor());
  }
}

export default new WRConfig();
