import {GUI} from "dat.gui";
import * as React from "react";
import {gui} from "../geometry-browser";
import {twoPi} from "./twoPi";

interface IState {
  heightSegments: number;
  phiLength: number;
  phiStart: number;
  radius: number;
  thetaLength: number;
  thetaStart: number;
  widthSegments: number;
}

export class SphereBufferGeometry extends React.Component<{}, IState> {
  public state = {
    heightSegments: 6,
    phiLength: twoPi,
    phiStart: 0,
    radius: 15,
    thetaLength: Math.PI,
    thetaStart: 0,
    widthSegments: 8,
  };
  public folder: GUI;

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.SphereBufferGeometry");

    const data = {
      heightSegments: this.state.heightSegments,
      phiLength: this.state.phiLength,
      phiStart: this.state.phiStart,
      radius: this.state.radius,
      thetaLength: this.state.thetaLength,
      thetaStart: this.state.thetaStart,
      widthSegments: this.state.widthSegments,
    };

    this.folder.add(data, "radius", 1, 30).onChange(() => this.setState({ radius: data.radius }));
    this.folder
      .add(data, "widthSegments", 3, 32)
      .step(1)
      .onChange(() => this.setState({ widthSegments: data.widthSegments }));
    this.folder
      .add(data, "heightSegments", 2, 32)
      .step(1)
      .onChange(() => this.setState({ heightSegments: data.heightSegments }));
    this.folder.add(data, "phiStart", 0, twoPi).onChange(() => this.setState({ phiStart: data.phiStart }));
    this.folder.add(data, "phiLength", 0, twoPi).onChange(() => this.setState({ phiLength: data.phiLength }));
    this.folder.add(data, "thetaStart", 0, twoPi).onChange(() => this.setState({ thetaStart: data.thetaStart }));
    this.folder.add(data, "thetaLength", 0, twoPi).onChange(() => this.setState({ thetaLength: data.thetaLength }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <sphereBufferGeometry
        radius={this.state.radius}
        widthSegments={this.state.widthSegments}
        heightSegments={this.state.heightSegments}
        phiStart={this.state.phiStart}
        phiLength={this.state.phiLength}
        thetaStart={this.state.thetaStart}
        thetaLength={this.state.thetaLength}
      />
    );
  }
}
