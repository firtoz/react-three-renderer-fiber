import React, { Component } from 'react';
import * as THREE from 'three';
import React3 from './React3';

class Simple extends Component {
  constructor(props, context) {
    super(props, context);

    this.renderer = null;
    this.scene = null;
    this.camera = null;

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this.state = {
      cubeRotation: new THREE.Euler(),
    };

    this._onAnimate = (callback) => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0
        ),
      }, callback);
    };
  }

  rendererRef = (renderer) => {
    this.renderer = renderer;
  };

  sceneRef = (scene) => {
    this.scene = scene;
  };

  cameraRef = (camera) => {
    this.camera = camera;
  };

  componentDidMount() {
    this.renderer.render(this.scene, this.camera);

    setInterval(() => {
      this._onAnimate(() => {
        requestAnimationFrame(renderFunction);
      });
    }, 20);

    const renderFunction = () => {
      this.renderer.render(this.scene, this.camera);

      // requestAnimationFrame(renderFunction);
    };

    // this._onAnimate(() => {
    //   requestAnimationFrame(() => {
    //     this.renderer.render(this.scene, this.camera);
    //   });
    // });

  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    return (<React3>
      <webglRenderer
        mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below

        width={width}
        height={height}

        ref={this.rendererRef}
      >
        <scene
          ref={this.sceneRef}
        >
          <perspectiveCamera
            name="camera"
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
              width={1}
              height={1}
              depth={1}
            />
            <meshBasicMaterial
              color={0x00ff00}
            />
          </mesh>
        </scene>
      </webglRenderer>
    </React3>);
  }
}

export default Simple;
