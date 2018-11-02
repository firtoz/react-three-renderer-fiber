import {GUI} from "dat.gui";
import * as React from "react";
import {gui} from "../geometry-browser";

interface IState {
  detail: number;
  radius: number;
}

export class OctahedronGeometry extends React.Component<{}, IState> {
  public state = {
    detail: 0,
    radius: 10,
  };
  public folder: GUI;

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.OctahedronGeometry");

    const data = {
      detail: this.state.detail,
      radius: this.state.radius,
    };

    this.folder.add(data, "radius", 1, 20).onChange(() => this.setState({ radius: data.radius }));
    this.folder
      .add(data, "detail", 0, 5)
      .step(1)
      .onChange(() => this.setState({ detail: data.detail }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <octahedronGeometry
        radius={this.state.radius}
        detail={this.state.detail}
      />
    );
  }
}
