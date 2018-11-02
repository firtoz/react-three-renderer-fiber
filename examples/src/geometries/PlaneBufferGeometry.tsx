import {GUI} from "dat.gui";
import * as React from "react";
import {gui} from "../geometry-browser";

interface IState {
  height: number;
  heightSegments: number;
  width: number;
  widthSegments: number;
}

export class PlaneBufferGeometry extends React.Component<{}, IState> {
  public state = {
    height: 10,
    heightSegments: 1,
    width: 10,
    widthSegments: 1,
  };
  public folder: GUI;

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.PlaneBufferGeometry");

    const data = {
      height: this.state.height,
      heightSegments: this.state.heightSegments,
      width: this.state.width,
      widthSegments: this.state.widthSegments,
    };

    this.folder.add(data, "width", 1, 30).onChange(() => this.setState({ width: data.width }));
    this.folder.add(data, "height", 1, 30).onChange(() => this.setState({ height: data.height }));
    this.folder
      .add(data, "widthSegments", 1, 30)
      .step(1)
      .onChange(() => this.setState({ widthSegments: data.widthSegments }));
    this.folder
      .add(data, "heightSegments", 1, 30)
      .step(1)
      .onChange(() => this.setState({ heightSegments: data.heightSegments }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <planeBufferGeometry
        width={this.state.width}
        height={this.state.height}
        widthSegments={this.state.widthSegments}
        heightSegments={this.state.heightSegments}
      />
    );
  }
}
