import { GUI } from "dat.gui";
import * as React from "react";
import {DoubleSide, Euler, Vector3} from "three";
import {ReactThreeRenderer} from "../../src";
import {BoxBufferGeometry} from "./geometries/BoxBufferGeometry";
import {BoxGeometry} from "./geometries/BoxGeometry";
import {CircleBufferGeometry} from "./geometries/CircleBufferGeometry";
import {CircleGeometry} from "./geometries/CircleGeometry";
import {ConeBufferGeometry} from "./geometries/ConeBufferGeometry";
import {ConeGeometry} from "./geometries/ConeGeometry";
import {CylinderBufferGeometry} from "./geometries/CylinderBufferGeometry";
import {CylinderGeometry} from "./geometries/CylinderGeometry";
import {DodecahedronBufferGeometry} from "./geometries/DodecahedronBufferGeometry";
import {DodecahedronGeometry} from "./geometries/DodecahedronGeometry";
import {ExtrudeBufferGeometry} from "./geometries/ExtrudeBufferGeometry";
import {ExtrudeGeometry} from "./geometries/ExtrudeGeometry";
import {IcosahedronBufferGeometry} from "./geometries/IcosahedronBufferGeometry";
import {IcosahedronGeometry} from "./geometries/IcosahedronGeometry";
import {LatheBufferGeometry} from "./geometries/LatheBufferGeometry";
import {LatheGeometry} from "./geometries/LatheGeometry";
import {OctahedronBufferGeometry} from "./geometries/OctahedronBufferGeometry";
import {OctahedronGeometry} from "./geometries/OctahedronGeometry";
import {ParametricBufferGeometry} from "./geometries/ParametricBufferGeometry";
import {ParametricGeometry} from "./geometries/ParametricGeometry";
import {PlaneBufferGeometry} from "./geometries/PlaneBufferGeometry";
import {PlaneGeometry} from "./geometries/PlaneGeometry";
import {RingBufferGeometry} from "./geometries/RingBufferGeometry";
import {RingGeometry} from "./geometries/RingGeometry";
import {ShapeBufferGeometry} from "./geometries/ShapeBufferGeometry";
import {ShapeGeometry} from "./geometries/ShapeGeometry";
import {SphereBufferGeometry} from "./geometries/SphereBufferGeometry";
import {SphereGeometry} from "./geometries/SphereGeometry";
import {TetrahedronBufferGeometry} from "./geometries/TetrahedronBufferGeometry";
import {TetrahedronGeometry} from "./geometries/TetrahedronGeometry";
import {TextBufferGeometry} from "./geometries/TextBufferGeometry";
import {TextGeometry} from "./geometries/TextGeometry";
import {TorusBufferGeometry} from "./geometries/TorusBufferGeometry";
import {TorusGeometry} from "./geometries/TorusGeometry";
import {TorusKnotBufferGeometry} from "./geometries/TorusKnotBufferGeometry";
import {TorusKnotGeometry} from "./geometries/TorusKnotGeometry";
import {TubeBufferGeometry} from "./geometries/TubeBufferGeometry";
import {TubeGeometry} from "./geometries/TubeGeometry";

(document.getElementById("newWindow") as HTMLAnchorElement).href +=
  window.location.hash;

const container = document.createElement("div");

document.body.appendChild(container);

export const gui = new GUI();

interface IState {
  rotation: Euler;
}

const getSelectedGeometry = () => {
  return window.location.hash.substring(1);
};

const getGeometryComponent = (selectedGeometry: string) => {
  switch (selectedGeometry) {
    case "BoxBufferGeometry": return <BoxBufferGeometry />;
    case "BoxGeometry": return <BoxGeometry />;
    case "CircleBufferGeometry": return <CircleBufferGeometry />;
    case "CircleGeometry": return <CircleGeometry />;
    case "ConeBufferGeometry": return <ConeBufferGeometry />;
    case "ConeGeometry": return <ConeGeometry />;
    case "CylinderBufferGeometry": return <CylinderBufferGeometry />;
    case "CylinderGeometry": return <CylinderGeometry />;
    case "DodecahedronBufferGeometry": return <DodecahedronBufferGeometry />;
    case "DodecahedronGeometry": return <DodecahedronGeometry />;
    case "ExtrudeBufferGeometry": return <ExtrudeBufferGeometry />;
    case "ExtrudeGeometry": return <ExtrudeGeometry />;
    case "IcosahedronBufferGeometry": return <IcosahedronBufferGeometry />;
    case "IcosahedronGeometry": return <IcosahedronGeometry />;
    case "LatheBufferGeometry": return <LatheBufferGeometry />;
    case "LatheGeometry": return <LatheGeometry />;
    case "OctahedronBufferGeometry": return <OctahedronBufferGeometry />;
    case "OctahedronGeometry": return <OctahedronGeometry />;
    case "ParametricBufferGeometry": return <ParametricBufferGeometry />;
    case "ParametricGeometry": return <ParametricGeometry />;
    case "PlaneBufferGeometry": return <PlaneBufferGeometry />;
    case "PlaneGeometry": return <PlaneGeometry />;
    case "RingBufferGeometry": return <RingBufferGeometry />;
    case "RingGeometry": return <RingGeometry />;
    case "ShapeBufferGeometry": return <ShapeBufferGeometry />;
    case "ShapeGeometry": return <ShapeGeometry />;
    case "SphereBufferGeometry": return <SphereBufferGeometry />;
    case "SphereGeometry": return <SphereGeometry />;
    case "TetrahedronBufferGeometry": return <TetrahedronBufferGeometry />;
    case "TetrahedronGeometry": return <TetrahedronGeometry />;
    case "TextBufferGeometry": return <TextBufferGeometry />;
    case "TextGeometry": return <TextGeometry />;
    case "TorusBufferGeometry": return <TorusBufferGeometry />;
    case "TorusGeometry": return <TorusGeometry />;
    case "TorusKnotBufferGeometry": return <TorusKnotBufferGeometry />;
    case "TorusKnotGeometry": return <TorusKnotGeometry />;
    case "TubeBufferGeometry": return <TubeBufferGeometry />;
    case "TubeGeometry": return <TubeGeometry />;
    default: return <TorusGeometry />;
  }
};

class GeometryBrowser extends React.Component<{}, IState> {
  public state = {
    rotation: new Euler(),
    selectedGeometry: getSelectedGeometry(),
  };

  public render() {
    // TODO: Add wireframe geometry based on geometry (wireframe visibility should be false for text geometries)
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
  };
}

ReactThreeRenderer.render(<GeometryBrowser />, container);

// TODO: Add orbit controls
// const orbit = new THREE.OrbitControls(camera, renderer.domElement);
// orbit.enableZoom = false;
