import * as PropTypes from "prop-types";
import * as React from "react";

import {Euler, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";

import React3 from "../../src";

interface ISimpleProps {
  width: number;
  height: number;
}

interface ISimpleState {
  cubeRotation: Euler;
  antialias: boolean;
  rotate: boolean;
  scale: boolean;
  frameNumber: number;
}

class Simple extends React.Component<ISimpleProps, ISimpleState> {
  public static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
  };

  private cameraPosition: Vector3;
  private renderer: WebGLRenderer;
  private animationRequest: number;
  private camera: PerspectiveCamera;
  private scene: Scene;

  constructor(props: ISimpleProps, context: never) {
    super(props, context);

    this.cameraPosition = new Vector3(0, 0, 5);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.

    this.state = {
      antialias: true,
      cubeRotation: new Euler(
        5,
        10,
        15,
      ),
      frameNumber: 0,
      rotate: false,
      scale: true,
    };
  }

  public componentDidMount() {
    this.animationRequest = requestAnimationFrame(this.onAnimate);
  }

  public onAnimate = () => {
    // we will get this callback every frame

    // pretend cubeRotation is immutable.
    // this helps with updates and pure rendering.
    // React will be sure that the rotation has now updated.
    if (this.state.rotate) {
      this.setState({
        cubeRotation: new Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0,
        ),
        frameNumber: this.state.frameNumber + 1,
      }, () => {
        this.renderer.render(this.scene, this.camera);

        this.animationRequest = requestAnimationFrame(this.onAnimate);
      });
    } else {
      this.setState({
        frameNumber: this.state.frameNumber + 1,
      }, () => {
        this.renderer.render(this.scene, this.camera);

        this.animationRequest = requestAnimationFrame(this.onAnimate);
      });
    }
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.animationRequest);
  }

  public render() {
    const {
      width,
      height,
    } = this.props;

    // or you can use:
    // width = window.innerWidth
    // height = window.innerHeight

    return <React3>
      <webGLRenderer
        width={width}
        height={height}
        ref={this.rendererRef}

        antialias={this.state.antialias}
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
          <mesh
            rotation={this.state.cubeRotation}
          >
            <boxGeometry
              width={!this.state.scale ? 1 : Math.abs(Math.cos(this.state.frameNumber / 100.0)) * 2}
              height={!this.state.scale ? 1 : Math.abs(Math.cos((this.state.frameNumber + 200) / 100.0)) * 2}
              depth={!this.state.scale ? 1 : Math.abs(Math.sin((this.state.frameNumber - 200) / 100.0)) * 2}
            />
            <meshBasicMaterial
              color={0x00ff00}
            />
          </mesh>
        </scene>
      </webGLRenderer>
    </React3>;
  }

  private rendererRef = (renderer: WebGLRenderer) => {
    this.renderer = renderer;
  }

  private cameraRef = (camera: PerspectiveCamera) => {
    this.camera = camera;
  }

  private sceneRef = (scene: Scene) => {
    this.scene = scene;
  }
}

export default Simple;
