// Following https://github.com/mrdoob/three.js/wiki/Getting-Started

import * as React from "react";
import * as THREE from "three";
import ReactThreeRenderer from "../src/core/renderer/reactThreeRenderer";

ReactThreeRenderer.render(<webGLRenderer
  width={800}
  height={600}

  clearColor={0xdddddd}
  clearAlpha={1}
>
  <render
    camera={<perspectiveCamera
      fov={35}
      aspect={800 / 600}
      near={0.1}
      far={10000}
      position={new THREE.Vector3(-15, 10, 10)}
      lookAt={new THREE.Vector3(0, 0, 0)}
    />}
    scene={<scene>
      <mesh>
        <boxGeometry width={5} height={5} depth={5} />
        <meshLambertMaterial
          color={0xFF0000}
        />
      </mesh>
      <pointLight
        position={new THREE.Vector3(10, 0, 10)}
        color={0xFFFF00}
      />
    </scene>}
  >
  </render>
</webGLRenderer>, document.getElementById("example"));
