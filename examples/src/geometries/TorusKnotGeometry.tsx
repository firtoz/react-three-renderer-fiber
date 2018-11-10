import {GUI} from "dat.gui";
import * as React from "react";
import {gui} from "../geometry-browser";

interface IState {
  p: number;
  q: number;
  radialSegments: number;
  radius: number;
  tube: number;
  tubularSegments: number;
}

export class TorusKnotGeometry extends React.Component<{}, IState> {
  public state = {
    p: 2,
    q: 3,
    radialSegments: 8,
    radius: 10,
    tube: 3,
    tubularSegments: 64,
  };
  public folder: GUI;

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.TorusKnotGeometry");

    const data = {
      p: this.state.p,
      q: this.state.q,
      radialSegments: this.state.radialSegments,
      radius: this.state.radius,
      tube: this.state.tube,
      tubularSegments: this.state.tubularSegments,
    };

    this.folder.add(data, "radius", 1, 20).onChange(() => this.setState({ radius: data.radius }));
    this.folder.add(data, "tube", 0.1, 10).onChange(() => this.setState({ tube: data.tube }));
    this.folder
      .add(data, "tubularSegments", 3, 300)
      .step(1)
      .onChange(() => this.setState({ tubularSegments: data.tubularSegments }));
    this.folder
      .add(data, "radialSegments", 3, 20)
      .step(1)
      .onChange(() => this.setState({ radialSegments: data.radialSegments }));
    this.folder
      .add(data, "p", 1, 20)
      .step(1)
      .onChange(() => this.setState({ p: data.p }));
    this.folder
      .add(data, "q", 1, 20)
      .step(1)
      .onChange(() => this.setState({ q: data.q }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <torusKnotGeometry
        radius={this.state.radius}
        tube={this.state.tube}
        tubularSegments={this.state.tubularSegments}
        radialSegments={this.state.radialSegments}
        p={this.state.p}
        q={this.state.q}
      />
    );
  }
}
