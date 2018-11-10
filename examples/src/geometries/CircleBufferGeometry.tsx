import {GUI} from "dat.gui";
import * as React from "react";
import {gui} from "../geometry-browser";
import {twoPi} from "./twoPi";

interface IState {
  radius: number;
  segments: number;
  thetaLength: number;
  thetaStart: number;
}

export class CircleBufferGeometry extends React.Component<{}, IState> {
  public state = {
    radius: 10,
    segments: 32,
    thetaLength: twoPi,
    thetaStart: 0,
  };
  public folder: GUI;

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.CircleBufferGeometry");

    const data = {
      radius: this.state.radius,
      segments: this.state.segments,
      thetaLength: this.state.thetaLength,
      thetaStart: this.state.thetaStart,
    };

    this.folder.add(data, "radius", 1, 20).onChange(() => this.setState({ radius: data.radius }));
    this.folder
      .add(data, "segments", 0, 128)
      .step(1)
      .onChange(() => this.setState({ segments: data.segments }));
    this.folder.add(data, "thetaStart", 0, twoPi).onChange(() => this.setState({ thetaStart: data.thetaStart }));
    this.folder.add(data, "thetaLength", 0, twoPi).onChange(() => this.setState({ thetaLength: data.thetaLength }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <circleBufferGeometry
        radius={this.state.radius}
        segments={this.state.segments}
        thetaStart={this.state.thetaStart}
        thetaLength={this.state.thetaLength}
      />
    );
  }
}
