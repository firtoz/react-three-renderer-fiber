import {GUI} from "dat.gui";
import * as React from "react";
import {gui} from "../geometry-browser";

interface IState {
  depth: number;
  depthSegments: number;
  height: number;
  heightSegments: number;
  width: number;
  widthSegments: number;
}

export class BoxGeometry extends React.Component<{}, IState> {
  public state = {
    depth: 15,
    depthSegments: 1,
    height: 15,
    heightSegments: 1,
    width: 15,
    widthSegments: 1,
  };
  public folder: GUI;

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.BoxGeometry");

    const data = {
      depth: this.state.depth,
      depthSegments: this.state.depthSegments,
      height: this.state.height,
      heightSegments: this.state.heightSegments,
      width: this.state.width,
      widthSegments: this.state.widthSegments,
    };

    this.folder.add(data, "width", 1, 30).onChange(() => this.setState({ width: data.width }));
    this.folder.add(data, "height", 1, 30).onChange(() => this.setState({ height: data.height }));
    this.folder.add(data, "depth", 1, 30).onChange(() => this.setState({ depth: data.depth }));
    this.folder
      .add(data, "widthSegments", 1, 10)
      .step(1)
      .onChange(() => this.setState({ widthSegments: data.widthSegments }));
    this.folder
      .add(data, "heightSegments", 1, 10)
      .step(1)
      .onChange(() => this.setState({ heightSegments: data.heightSegments }));
    this.folder
      .add(data, "depthSegments", 1, 10)
      .step(1)
      .onChange(() => this.setState({ depthSegments: data.depthSegments }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <boxGeometry
        width={this.state.width}
        height={this.state.height}
        depth={this.state.depth}
        widthSegments={this.state.widthSegments}
        heightSegments={this.state.heightSegments}
        depthSegments={this.state.depthSegments}
      />
    );
  }
}
