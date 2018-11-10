import {GUI} from "dat.gui";
import * as React from "react";
import {Shape} from "three";
import {gui} from "../geometry-browser";

interface IState {
  segments: number;
}

const getHeartShape = () => {
  const x = 0;
  const y = 0;

  const heartShape = new Shape();

  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
  heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
  heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
  heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

  return heartShape;
};

export class ShapeBufferGeometry extends React.Component<{}, IState> {
  public state = {
    segments: 12,
  };
  public folder: GUI;
  public heartShape = getHeartShape();

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.ShapeBufferGeometry");

    const data = {
      segments: this.state.segments,
    };

    this.folder
      .add(data, "segments", 1, 100)
      .step(1)
      .onChange(() => this.setState({ segments: data.segments }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public render() {
    // TODO: Add center prop to geometry
    return (
      <shapeBufferGeometry
        shapes={this.heartShape}
        curveSegments={this.state.segments}
      />
    );
  }
}
