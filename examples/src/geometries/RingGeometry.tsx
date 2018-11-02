import {GUI} from "dat.gui";
import * as React from "react";
import {gui} from "../geometry-browser";
import {twoPi} from "./twoPi";

interface IState {
  innerRadius: number;
  outerRadius: number;
  phiSegments: number;
  thetaLength: number;
  thetaSegments: number;
  thetaStart: number;
}

export class RingGeometry extends React.Component<{}, IState> {
  public state = {
    innerRadius: 5,
    outerRadius: 10,
    phiSegments: 8,
    thetaLength: twoPi,
    thetaSegments: 8,
    thetaStart: 0,
  };
  public folder: GUI;

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.RingGeometry");

    const data = {
      innerRadius: this.state.innerRadius,
      outerRadius: this.state.outerRadius,
      phiSegments: this.state.phiSegments,
      thetaLength: this.state.thetaLength,
      thetaSegments: this.state.thetaSegments,
      thetaStart: this.state.thetaStart,
    };

    this.folder.add(data, "innerRadius", 1, 30).onChange(() => this.setState({ innerRadius: data.innerRadius }));
    this.folder.add(data, "outerRadius", 1, 30).onChange(() => this.setState({ outerRadius: data.outerRadius }));
    this.folder
      .add(data, "thetaSegments", 1, 30)
      .step(1)
      .onChange(() => this.setState({ thetaSegments: data.thetaSegments }));
    this.folder
      .add(data, "phiSegments", 1, 30)
      .step(1)
      .onChange(() => this.setState({ phiSegments: data.phiSegments }));
    this.folder.add(data, "thetaStart", 0, twoPi).onChange(() => this.setState({ thetaStart: data.thetaStart }));
    this.folder.add(data, "thetaLength", 0, twoPi).onChange(() => this.setState({ thetaLength: data.thetaLength }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <ringGeometry
        innerRadius={this.state.innerRadius}
        outerRadius={this.state.outerRadius}
        thetaSegments={this.state.thetaSegments}
        phiSegments={this.state.phiSegments}
        thetaStart={this.state.thetaStart}
        thetaLength={this.state.thetaLength}
      />
    );
  }
}
