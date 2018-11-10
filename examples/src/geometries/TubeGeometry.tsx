import {GUI} from "dat.gui";
import * as React from "react";
import {Curve, Vector3} from "three";
import {gui} from "../geometry-browser";

interface IState {
  radialSegments: number;
  radius: number;
  segments: number;
}

function CustomSinCurve(scale: number) {
  Curve.call(this);

  this.scale = scale === undefined ? 1 : scale;
}

CustomSinCurve.prototype = Object.create(Curve.prototype);
CustomSinCurve.prototype.constructor = CustomSinCurve;

CustomSinCurve.prototype.getPoint = function(t: number) {
  const tx = t * 3 - 1.5;
  const ty = Math.sin(2 * Math.PI * t);
  const tz = 0;

  return new Vector3(tx, ty, tz).multiplyScalar(this.scale);
};

export class TubeGeometry extends React.Component<{}, IState> {
  public state = {
    radialSegments: 8,
    radius: 2,
    segments: 20,
  };
  public folder: GUI;
  // TODO: Fix type
  public path = new (CustomSinCurve as any)(10);

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.TubeGeometry");

    const data = {
      radialSegments: this.state.radialSegments,
      radius: this.state.radius,
      segments: this.state.segments,
    };

    this.folder
      .add(data, "segments", 1, 100)
      .step(1)
      .onChange(() => this.setState({ segments: data.segments }));
    this.folder.add(data, "radius", 1, 10).onChange(() => this.setState({ radius: data.radius }));
    this.folder
      .add(data, "radialSegments", 1, 20)
      .step(1)
      .onChange(() => this.setState({ radialSegments: data.radialSegments }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    return (
      <tubeGeometry
        path={this.path}
        tubularSegments={this.state.segments}
        radius={this.state.radius}
        radialSegments={this.state.radialSegments}
        closed={false}
      />
    );
  }
}
