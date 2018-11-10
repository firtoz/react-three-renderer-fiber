import {GUI} from "dat.gui";
import * as React from "react";
import {Shape} from "three";
import {gui} from "../geometry-browser";

interface IState {
  bevelEnabled: boolean;
  bevelSegments: number;
  bevelSize: number;
  bevelThickness: number;
  depth: number;
  steps: number;
}

const getShape = () => {
  const length = 12;
  const width = 8;

  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, width);
  shape.lineTo(length, width);
  shape.lineTo(length, 0);
  shape.lineTo(0, 0);

  return shape;
};

export class ExtrudeGeometry extends React.Component<{}, IState> {
  public state = {
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: 1,
    bevelThickness: 1,
    depth: 16,
    steps: 2,
  };
  public folder: GUI;
  public shape = getShape();

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.ExtrudeGeometry");

    const data = {
      bevelEnabled: this.state.bevelEnabled,
      bevelSegments: this.state.bevelSegments,
      bevelSize: this.state.bevelSize,
      bevelThickness: this.state.bevelThickness,
      depth: this.state.depth,
      steps: this.state.steps,
    };

    this.folder
      .add(data, "steps", 1, 10)
      .step(1)
      .onChange(() => this.setState({ steps: data.steps }));
    this.folder.add(data, "depth", 1, 20).onChange(() => this.setState({ depth: data.depth }));
    this.folder
      .add(data, "bevelThickness", 1, 5)
      .step(1)
      .onChange(() => this.setState({ bevelThickness: data.bevelThickness }));
    this.folder
      .add(data, "bevelSize", 1, 5)
      .step(1)
      .onChange(() => this.setState({ bevelSize: data.bevelSize }));
    this.folder
      .add(data, "bevelSegments", 1, 5)
      .step(1)
      .onChange(() => this.setState({ bevelSegments: data.bevelSegments }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    // TODO: Add center prop to geometry
    return (
      <extrudeGeometry
        shapes={this.shape}
        options={{
          bevelEnabled: this.state.bevelEnabled,
          bevelSegments: this.state.bevelSegments,
          bevelSize: this.state.bevelSize,
          bevelThickness: this.state.bevelThickness,
          depth: this.state.depth,
          steps: this.state.steps,
        }}
      />
    );
  }
}
