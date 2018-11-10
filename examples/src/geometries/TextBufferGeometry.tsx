import {GUI} from "dat.gui";
import * as React from "react";
import {Font, FontLoader} from "three";
import "../../fonts/droid/droid_serif_bold.typeface.json";
import "../../fonts/droid/droid_serif_regular.typeface.json";
import "../../fonts/gentilis_bold.typeface.json";
import "../../fonts/gentilis_regular.typeface.json";
import "../../fonts/helvetiker_bold.typeface.json";
import "../../fonts/helvetiker_regular.typeface.json";
import "../../fonts/optimer_bold.typeface.json";
import "../../fonts/optimer_regular.typeface.json";
import {gui} from "../geometry-browser";

interface IState {
  bevelEnabled: boolean;
  bevelSegments: number;
  bevelSize: number;
  bevelThickness: number;
  curveSegments: number;
  font: string;
  height: number;
  loadedFont: Font | undefined;
  size: number;
  text: string;
  weight: string;
}

const fonts = ["helvetiker", "optimer", "gentilis", "droid/droid_serif"];

const weights = ["regular", "bold"];

export class TextBufferGeometry extends React.Component<{}, IState> {
  public state = {
    bevelEnabled: false,
    bevelSegments: 3,
    bevelSize: 0.5,
    bevelThickness: 1,
    curveSegments: 12,
    font: "helvetiker",
    height: 2,
    loadedFont: undefined,
    size: 5,
    text: "TextBufferGeometry",
    weight: "regular",
  };
  public folder: GUI;

  public componentDidMount() {
    this.loadFont();

    this.folder = gui.addFolder("THREE.TextBufferGeometry");

    const data = {
      bevelEnabled: this.state.bevelEnabled,
      bevelSegments: this.state.bevelSegments,
      bevelSize: this.state.bevelSize,
      bevelThickness: this.state.bevelThickness,
      curveSegments: this.state.curveSegments,
      font: this.state.font,
      height: this.state.height,
      size: this.state.size,
      text: this.state.text,
      weight: this.state.weight,
    };

    this.folder.add(data, "text").onChange(() => this.setState({ text: data.text }));
    this.folder.add(data, "size", 1, 30).onChange(() => this.setState({ size: data.size }));
    this.folder.add(data, "height", 1, 20).onChange(() => this.setState({ height: data.height }));
    this.folder
      .add(data, "curveSegments", 1, 20)
      .step(1)
      .onChange(() => this.setState({ curveSegments: data.curveSegments }));
    this.folder.add(data, "font", fonts).onChange(() => {
      this.setState({ font: data.font });
      this.loadFont();
    });
    this.folder.add(data, "weight", weights).onChange(() => {
      this.setState({ weight: data.weight });
      this.loadFont();
    });
    this.folder.add(data, "bevelEnabled").onChange(() => this.setState({ bevelEnabled: data.bevelEnabled }));
    this.folder
      .add(data, "bevelThickness", 0.1, 3)
      .onChange(() => this.setState({ bevelThickness: data.bevelThickness }));
    this.folder.add(data, "bevelSize", 0.1, 3).onChange(() => this.setState({ bevelSize: data.bevelSize }));
    this.folder
      .add(data, "bevelSegments", 0, 8)
      .step(1)
      .onChange(() => this.setState({ bevelSegments: data.bevelSegments }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public loadFont() {
    const loader = new FontLoader();
    loader.load(
      "../../fonts/" +
      this.state.font +
      "_" +
      this.state.weight +
      ".typeface.json",
      (font) => {
        this.setState({ loadedFont: font });
      },
    );
  }

  public render() {
    // TODO: Add center prop to geometry to center the text
    if (this.state.loadedFont === undefined) {
      return <geometry />;
    }
    return (
      <textBufferGeometry
        text={this.state.text}
        parameters={{
          bevelEnabled: this.state.bevelEnabled,
          bevelSegments: this.state.bevelSegments,
          bevelSize: this.state.bevelSize,
          bevelThickness: this.state.bevelThickness,
          curveSegments: this.state.curveSegments,
          font: this.state.loadedFont,
          height: this.state.height,
          size: this.state.size,
        }}
      />
    );
  }
}
