import * as React from "react";
import {Component} from "react";
import * as ReactDOM from "react-dom";
import * as THREE from "three";
import React3 from "../../../src";

import ColorCube from "./ColorCube";

// A modification of the 'Simple' example of ReactThreeRenderer
class Experiment extends Component {
  public state: {
    cubeRotation: any,
    wantsResult: boolean,
  };

  private readonly cameraPosition: any;
  private readonly onAnimate: (callback: any) => any;
  private rafRequest: number;
  private renderer: any;
  private scene: any;
  private camera: any;
  private animateInterval: number;

  constructor(props: any, context: any) {
    super(props, context);

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.rafRequest = 0;

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this.state = {
      cubeRotation: new THREE.Euler(),
      wantsResult: false,
    };

    this.onAnimate = (callback) => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0,
        ),
      }, callback);
    };
  }

  public componentDidMount() {
    console.log("mounted");

    this.renderer.render(this.scene, this.camera);

    this.animateInterval = window.setInterval(() => {
      this.onAnimate(() => {
        if (this.rafRequest === 0) {
          this.rafRequest = requestAnimationFrame(renderFunction);
        }
      });
    }, 20);

    const renderFunction = () => {
      this.renderer.render(this.scene, this.camera);

      this.rafRequest = 0;
    };
  }

  public render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    let testResult = null;
    let react3 = null;

    const cube: any = <ColorCube rotation={this.state.cubeRotation}/>;

    if (this.state.wantsResult) {
      testResult = <div key="result">Yay</div>;
    } else {
      react3 = <React3>
        <webGLRenderer
          ref={this.rendererRef}

          width={width}
          height={height}
        >
          <scene
            ref={this.sceneRef}
          >
            <perspectiveCamera
              fov={75}
              aspect={width / height}
              near={0.1}
              far={1000}

              position={this.cameraPosition}

              ref={this.cameraRef}
            />
            {cube}
          </scene>
        </webGLRenderer>
      </React3>;
    }

    return (<div>
      <div key="test">
        <button onClick={this.onClick}>Yay?</button>
        {testResult}
      </div>
      <div key="renderer">
        {react3}
      </div>
    </div>);
  }

  private rendererRef = (renderer: any) => {
    console.log("got renderer", renderer);
    this.renderer = renderer;
  };

  private sceneRef = (scene: any) => {
    this.scene = scene;
  };

  private cameraRef = (camera: any) => {
    this.camera = camera;
  };

  private onClick = () => {
    if (!this.state.wantsResult) {
      clearInterval(this.animateInterval);

      if (this.rafRequest !== 0) {
        console.log("about to go!");
        cancelAnimationFrame(this.rafRequest);

        this.rafRequest = 0;
      }
    } else {
      const renderFunction = () => {
        this.renderer.render(this.scene, this.camera);

        this.rafRequest = 0;
      };

      this.animateInterval = window.setInterval(() => {
        this.onAnimate(() => {
          if (this.rafRequest === 0) {
            this.rafRequest = requestAnimationFrame(renderFunction);
          }
        });
      }, 20);
    }

    this.setState({
      wantsResult: !this.state.wantsResult,
    });
  };
}

ReactDOM.render(<Experiment/>, document.getElementById("example"));
