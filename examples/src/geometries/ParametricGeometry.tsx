import {GUI} from "dat.gui";
import * as React from "react";
import {Vector3} from "three";
import {gui} from "../geometry-browser";

interface IState {
  slices: number;
  stacks: number;
}

// TODO: Reference klein from three instead of copy-pasting it
const klein = (v: number, u: number, target: Vector3) => {
  u *= Math.PI;
  v *= 2 * Math.PI;

  u = u * 2;
  let x;
  let y;
  let z;
  if (u < Math.PI) {
    x = 3 * Math.cos( u ) * ( 1 + Math.sin( u ) ) + ( 2 * ( 1 - Math.cos( u ) / 2 ) ) * Math.cos( u ) * Math.cos( v );
    z = - 8 * Math.sin( u ) - 2 * ( 1 - Math.cos( u ) / 2 ) * Math.sin( u ) * Math.cos( v );
  } else {
    x = 3 * Math.cos( u ) * ( 1 + Math.sin( u ) ) + ( 2 * ( 1 - Math.cos( u ) / 2 ) ) * Math.cos( v + Math.PI );
    z = - 8 * Math.sin( u );
  }

  y = - 2 * ( 1 - Math.cos( u ) / 2 ) * Math.sin( v );

  target.set( x, y, z );
};

export class ParametricGeometry extends React.Component<{}, IState> {
  public state = {
    slices: 25,
    stacks: 25,
  };
  public folder: GUI;
  public func = klein;

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.ParametricGeometry");

    const data = {
      slices: this.state.slices,
      stacks: this.state.stacks,
    };

    this.folder
      .add(data, "slices", 1, 100)
      .step(1)
      .onChange(() => this.setState({ slices: data.slices }));
    this.folder
      .add(data, "stacks", 1, 100)
      .step(1)
      .onChange(() => this.setState({ stacks: data.stacks }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <parametricGeometry
        func={this.func}
        slices={this.state.slices}
        stacks={this.state.stacks}
      />
    );
  }
}
