// Following https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene

import * as React from "react";
import * as THREE from "three";
import ReactThreeRenderer from "../src/core/renderer/reactThreeRenderer";

const container = document.createElement("div");

document.body.appendChild(container);

ReactThreeRenderer.render(<webGLRenderer
  width={window.innerWidth}
  height={window.innerHeight}

  clearColor={0xdddddd}
  clearAlpha={1}
>
  <render
    camera={<perspectiveCamera
      fov={75}
      aspect={window.innerWidth / window.innerHeight}
      near={0.1}
      far={1000}
      position={new THREE.Vector3(-15, 10, 10)}
      lookAt={new THREE.Vector3(0, 0, 0)}
    />}
    scene={<scene>
      <mesh
        geometry={<boxGeometry width={1} height={1} depth={1} />}
        material={<meshBasicMaterial
          color={0x00ff00}
        />}
      />
      <pointLight
        position={new THREE.Vector3(10, 0, 10)}
        color={0xFFFF00}
      />
    </scene>}
  />
</webGLRenderer>, container);
