import * as React from 'react';
import {Component} from 'react';
import * as THREE from 'three';
import React3 from './React3';

import ColorCube from './ColorCube';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "react-three-renderer-proxy": any,
            webglRenderer: {
                width: number,
                ref: any,
                height: number,
            };
            scene: any,
            perspectiveCamera: any,
            mesh: any,
            boxGeometry: any,
            meshBasicMaterial: any,
        }
    }
}

// A modification of the 'Simple' example of ReactThreeRenderer
class Experiment extends Component {
    private renderer: any;
    private scene: any;
    private camera: any;
    private cameraPosition: any;
    private _onAnimate: (callback: any) => any;

    public state: {
        cubeRotation: any
    };

    constructor(props: any, context: any) {
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

    rendererRef = (renderer: any) => {
        console.log('got renderer', renderer);
        this.renderer = renderer;
    };

    sceneRef = (scene: any) => {
        this.scene = scene;
    };

    cameraRef = (camera: any) => {
        this.camera = camera;
    };

    componentDidMount() {
        console.log('mounted');

        this.renderer.render(this.scene, this.camera);

        let frameRequested = false;

        setInterval(() => {
            this._onAnimate(() => {
                if (!frameRequested) {
                    frameRequested = true;
                    requestAnimationFrame(renderFunction);
                }
            });
        }, 20);

        const renderFunction = () => {
            this.renderer.render(this.scene, this.camera);

            frameRequested = false;
        };
    }

    render() {
        const width = window.innerWidth; // canvas width
        const height = window.innerHeight; // canvas height

        return (<React3>
            <webglRenderer
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
                    <ColorCube rotation={this.state.cubeRotation} />
                </scene>
            </webglRenderer>
        </React3>);
    }
}

export default Experiment;
