import {GUI} from "dat.gui";
import * as React from "react";
import {Vector2} from "three";
import {gui} from "../geometry-browser";
import {twoPi} from "./twoPi";

interface IState {
  phiLength: number;
  phiStart: number;
  segments: number;
}

const getPoints = () => {
  const points: Vector2[] = [];
  for (let i = 0; i < 10; i++) {
    points.push(new Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
  }
  return points;
};

export class LatheBufferGeometry extends React.Component<{}, IState> {
  public state = {
    phiLength: twoPi,
    phiStart: 0,
    segments: 12,
  };
  public folder: GUI;
  public points = getPoints();

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.LatheBufferGeometry");

    const data = {
      phiLength: this.state.phiLength,
      phiStart: this.state.phiStart,
      segments: this.state.segments,
    };

    this.folder
      .add(data, "segments", 1, 30)
      .step(1)
      .onChange(() => this.setState({ segments: data.segments }));
    this.folder.add(data, "phiStart", 0, twoPi).onChange(() => this.setState({ phiStart: data.phiStart }));
    this.folder.add(data, "phiLength", 0, twoPi).onChange(() => this.setState({ phiLength: data.phiLength }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <latheBufferGeometry
        points={this.points}
        segments={this.state.segments}
        phiStart={this.state.phiStart}
        phiLength={this.state.phiLength}
      />
    );
  }
}
