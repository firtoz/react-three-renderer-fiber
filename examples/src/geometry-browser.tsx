import { GUI } from "dat.gui";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DoubleSide, Vector3 } from "three";
import {ReactThreeRenderer} from "../../src";

(document.getElementById("newWindow") as HTMLAnchorElement).href +=
  window.location.hash;

const container = document.createElement("div");

document.body.appendChild(container);

export const gui = new GUI();

class GeometryBrowser extends React.Component {
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
            <group>
              <lineSegments
                geometry={<wireframeGeometry
                  geometry={<torusGeometry
                    radius={10}
                    tube={3}
                    radialSegments={16}
                    tubularSegments={100}
                    arc={Math.PI * 2}
                  />}
                />}
                material={<lineBasicMaterial
                  color={0xffffff}
                  opacity={0.5}
                  transparent={true}
                />}
              />
              <mesh
                geometry={<torusGeometry
                  radius={10}
                  tube={3}
                  radialSegments={16}
                  tubularSegments={100}
                  arc={Math.PI * 2}
                />}
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
        />
      </webGLRenderer>
    );
  }

  private onAnimationFrame = () => {
    // group.rotation.x += 0.005;
    // group.rotation.y += 0.005;
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
