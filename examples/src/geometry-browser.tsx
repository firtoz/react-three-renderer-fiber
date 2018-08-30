import { GUI } from "dat.gui";
import * as React from "react";
import {DoubleSide, Euler, Vector3} from "three";
import {ReactThreeRenderer} from "../../src";

(document.getElementById("newWindow") as HTMLAnchorElement).href +=
  window.location.hash;

const container = document.createElement("div");

document.body.appendChild(container);

export const gui = new GUI();

interface IState {
  rotation: Euler;
  radius: number;
  tube: number;
  radialSegments: number;
  tubularSegments: number;
  arc: number;
}

class GeometryBrowser extends React.Component<{}, IState> {
  public state = {
    arc: Math.PI * 2,
    radialSegments: 16,
    radius: 10,
    rotation: new Euler(),
    tube: 3,
    tubularSegments: 100,
  };

  constructor(props: {}) {
    super(props);

    const folder = gui.addFolder("THREE.TorusGeometry");

    const data = {
      arc: this.state.arc,
      radialSegments: this.state.radialSegments,
      radius: this.state.radius,
      tube: this.state.tube,
      tubularSegments: this.state.tubularSegments,
    };

    folder.add(data, "radius", 1, 20).onChange(() => this.setState({ radius: data.radius }));
    folder.add(data, "tube", 0.1, 10).onChange(() => this.setState({ tube: data.tube }));
    folder
      .add(data, "radialSegments", 2, 30)
      .step(1)
      .onChange(() => this.setState({ radialSegments: data.radialSegments }));
    folder
      .add(data, "tubularSegments", 3, 200)
      .step(1)
      .onChange(() => this.setState({ tubularSegments: data.tubularSegments }));
    folder.add(data, "arc", 0.1, Math.PI * 2).onChange(() => this.setState({ arc: data.arc }));
  }

  public render() {
    const torusGeometry = (
      <torusGeometry
        radius={this.state.radius}
        tube={this.state.tube}
        radialSegments={this.state.radialSegments}
        tubularSegments={this.state.tubularSegments}
        arc={this.state.arc}
      />
    );

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
              <lineSegments
                geometry={<wireframeGeometry
                  geometry={torusGeometry}
                />}
                material={<lineBasicMaterial
                  color={0xffffff}
                  opacity={0.5}
                  transparent={true}
                />}
              />
              <mesh
                geometry={torusGeometry}
                material={<meshPhongMaterial
                  color={0x156289}
                  emissive={0x072534}
                  flatShading={true}
                  side={DoubleSide}
                />}
              />
            </group>
          </scene>}
          onAnimationFrame={this.onAnimationFrame}
          autoRender={true}
        />
      </webGLRenderer>
    );
  }

  public onAnimationFrame = () => {
    const newRotation = this.state.rotation.clone();
    newRotation.x += 0.005;
    newRotation.y += 0.005;
    this.setState({ rotation: newRotation });
  }
}

ReactThreeRenderer.render(<GeometryBrowser />, container);

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   50,
// );
// camera.position.z = 30;

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor(0x000000, 1);
// document.body.appendChild(renderer.domElement);

// TODO: Add orbit controls
// const orbit = new THREE.OrbitControls(camera, renderer.domElement);
// orbit.enableZoom = false;

// const lights = [];
// lights[0] = new THREE.PointLight(0xffffff, 1, 0);
// lights[1] = new THREE.PointLight(0xffffff, 1, 0);
// lights[2] = new THREE.PointLight(0xffffff, 1, 0);
//
// lights[0].position.set(0, 200, 0);
// lights[1].position.set(100, 200, 100);
// lights[2].position.set(-100, -200, -100);
//
// scene.add(lights[0]);
// scene.add(lights[1]);
// scene.add(lights[2]);

// const group = new THREE.Group();

// const geometry = new THREE.BufferGeometry();
// geometry.addAttribute("position", new THREE.Float32BufferAttribute([], 3));

// const lineMaterial = new THREE.LineBasicMaterial({
//   color: 0xffffff,
//   opacity: 0.5,
//   transparent: true,
// });
// const meshMaterial = new THREE.MeshPhongMaterial({
//   color: 0x156289,
//   emissive: 0x072534,
//   flatShading: true,
//   side: THREE.DoubleSide,
// });

// group.add(new THREE.LineSegments(geometry, lineMaterial));
// group.add(new THREE.Mesh(geometry, meshMaterial));

// const options = chooseFromHash(group);
//
// scene.add(group);
//
// const prevFog = false;
//
// const render = () => {
//   requestAnimationFrame(render);
//
//   if (!options.fixed) {
//     group.rotation.x += 0.005;
//     group.rotation.y += 0.005;
//   }
//
//   renderer.render(scene, camera);
// };
//
// window.addEventListener(
//   "resize",
//   () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   },
//   false,
// );
//
// render();
