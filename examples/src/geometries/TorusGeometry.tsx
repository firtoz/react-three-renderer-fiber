import {GUI} from "dat.gui";
import * as React from "react";
import {DoubleSide, Euler} from "three";
import {gui} from "../geometry-browser";
import {twoPi} from "./twoPi";

interface IProps {
  rotation: Euler;
}

interface IState {
  radius: number;
  tube: number;
  radialSegments: number;
  tubularSegments: number;
  arc: number;
}

export class TorusGeometry extends React.Component<IProps, IState> {
  public state = {
    arc: twoPi,
    radialSegments: 16,
    radius: 10,
    tube: 3,
    tubularSegments: 100,
  };
  public folder: GUI;

  public componentDidMount() {
    this.folder = gui.addFolder("THREE.TorusGeometry");

    const data = {
      arc: this.state.arc,
      radialSegments: this.state.radialSegments,
      radius: this.state.radius,
      tube: this.state.tube,
      tubularSegments: this.state.tubularSegments,
    };

    this.folder.add(data, "radius", 1, 20).onChange(() => this.setState({ radius: data.radius }));
    this.folder.add(data, "tube", 0.1, 10).onChange(() => this.setState({ tube: data.tube }));
    this.folder
      .add(data, "radialSegments", 2, 30)
      .step(1)
      .onChange(() => this.setState({ radialSegments: data.radialSegments }));
    this.folder
      .add(data, "tubularSegments", 3, 200)
      .step(1)
      .onChange(() => this.setState({ tubularSegments: data.tubularSegments }));
    this.folder.add(data, "arc", 0.1, Math.PI * 2).onChange(() => this.setState({ arc: data.arc }));
  }

  public componentWillUnmount() {
    gui.removeFolder(this.folder);
  }

  public renderGeometry() {
    return (
      <torusGeometry
        radius={this.state.radius}
        tube={this.state.tube}
        radialSegments={this.state.radialSegments}
        tubularSegments={this.state.tubularSegments}
        arc={this.state.arc}
      />
    );
  }

  public render() {
    const torusGeometry = this.renderGeometry();

    return (
      <group
        rotation={this.props.rotation}
      >
        <lineSegments
          geometry={<wireframeGeometry>
            {torusGeometry}
          </wireframeGeometry>}
          material={<lineBasicMaterial
            color={0xffffff}
            opacity={0.5}
            transparent={true}
          />}
        />
        <mesh>
          {torusGeometry}
          <meshPhongMaterial
            color={0x156289}
            emissive={0x072534}
            flatShading={true}
            side={DoubleSide}
          />
        </mesh>
      </group>
    );
  }
}
