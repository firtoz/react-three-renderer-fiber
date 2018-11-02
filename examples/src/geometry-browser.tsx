import { GUI } from "dat.gui";
import * as React from "react";
import {DoubleSide, Euler, Vector3} from "three";
import {ReactThreeRenderer} from "../../src";
import {BoxBufferGeometry} from "./geometries/BoxBufferGeometry";
import {TorusGeometry} from "./geometries/TorusGeometry";

(document.getElementById("newWindow") as HTMLAnchorElement).href +=
  window.location.hash;

const container = document.createElement("div");

document.body.appendChild(container);

export const gui = new GUI();

interface IState {
  rotation: Euler;
}

const getSelectedGeometry = () => {
  return window.location.hash.substring(1) || "TorusGeometry";
};

const getGeometryComponent = (selectedGeometry: string) => {
  switch (selectedGeometry) {
    case "BoxBufferGeometry": return <BoxBufferGeometry />;
    default: return <TorusGeometry />;
  }
};

class GeometryBrowser extends React.Component<{}, IState> {
  public state = {
    rotation: new Euler(),
    selectedGeometry: getSelectedGeometry(),
  };

  public render() {
    return (
      <webGLRenderer
        antialias={true}
        devicePixelRatio={window.devicePixelRatio}
        width={window.innerWidth}
        height={window.innerHeight}
        clearColor={0x000000}
        clearAlpha={1}
      >
        <render
          camera={<perspectiveCamera
            fov={75}
            aspect={window.innerWidth / window.innerHeight}
            near={0.1}
            far={50}
            position={new Vector3(0, 0, 30)}
          />}
          scene={<scene>
            <pointLight
              color={0xffffff}
              intensity={1}
              distance={0}
              position={new Vector3(0, 200, 0)}
            />
            <pointLight
              color={0xffffff}
              intensity={1}
              distance={0}
              position={new Vector3(100, 200, 100)}
            />
            <pointLight
              color={0xffffff}
              intensity={1}
              distance={0}
              position={new Vector3(-100, -200, -100)}
            />
            <group
              rotation={this.state.rotation}
            >
              <mesh>
                {getGeometryComponent(this.state.selectedGeometry)}
                <meshPhongMaterial
                  color={0x156289}
                  emissive={0x072534}
                  flatShading={true}
                  side={DoubleSide}
                />
              </mesh>
            </group>
          </scene>}
          onBeforeRender={this.onAnimationFrame}
          autoRender={true}
        />
      </webGLRenderer>
    );
  }

  public onAnimationFrame = () => {
    if (this.state.selectedGeometry === "TextGeometry" || this.state.selectedGeometry === "TextBufferGeometry") {
      return;
    }
    this.setState((prevState) => {
      const newRotation = prevState.rotation.clone();
      newRotation.x += 0.005;
      newRotation.y += 0.005;
      return { rotation: newRotation };
    });
  }
}

ReactThreeRenderer.render(<GeometryBrowser />, container);

// TODO: Add orbit controls
// const orbit = new THREE.OrbitControls(camera, renderer.domElement);
// orbit.enableZoom = false;
