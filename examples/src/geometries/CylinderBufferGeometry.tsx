import {GUI} from "dat.gui";
import * as React from "react";
import {gui} from "../geometry-browser";
import {twoPi} from "./twoPi";

interface IState {
  height: number;
  heightSegments: number;
  openEnded: boolean;
  radialSegments: number;
  radiusBottom: number;
  radiusTop: number;
  thetaLength: number;
  thetaStart: number;
}

export class CylinderBufferGeometry extends React.Component<{}, IState> {
  public state = {
    height: 10,
    heightSegments: 1,
    openEnded: false,
    radialSegments: 8,
    radiusBottom: 5,
    radiusTop: 5,
    thetaLength: twoPi,
    thetaStart: 0,
  };
  public folder: GUI;

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.CylinderBufferGeometry");

    const data = {
      height: this.state.height,
      heightSegments: this.state.heightSegments,
      openEnded: this.state.openEnded,
      radialSegments: this.state.radialSegments,
      radiusBottom: this.state.radiusBottom,
      radiusTop: this.state.radiusTop,
      thetaLength: this.state.thetaLength,
      thetaStart: this.state.thetaStart,
    };

    this.folder.add(data, "radiusTop", 0, 30).onChange(() => this.setState({ radiusTop: data.radiusTop }));
    this.folder.add(data, "radiusBottom", 0, 30).onChange(() => this.setState({ radiusBottom: data.radiusBottom }));
    this.folder.add(data, "height", 1, 50).onChange(() => this.setState({ height: data.height }));
    this.folder
      .add(data, "radialSegments", 3, 64)
      .step(1)
      .onChange(() => this.setState({ radialSegments: data.radialSegments }));
    this.folder
      .add(data, "heightSegments", 1, 64)
      .step(1)
      .onChange(() => this.setState({ heightSegments: data.heightSegments }));
    this.folder.add(data, "openEnded").onChange(() => this.setState({ openEnded: data.openEnded }));
    this.folder.add(data, "thetaStart", 0, twoPi).onChange(() => this.setState({ thetaStart: data.thetaStart }));
    this.folder.add(data, "thetaLength", 0, twoPi).onChange(() => this.setState({ thetaLength: data.thetaLength }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <cylinderBufferGeometry
        radiusTop={this.state.radiusTop}
        radiusBottom={this.state.radiusBottom}
        height={this.state.height}
        radialSegments={this.state.radialSegments}
        heightSegments={this.state.heightSegments}
        openEnded={this.state.openEnded}
        thetaStart={this.state.thetaStart}
        thetaLength={this.state.thetaLength}
      />
    );
  }
}
