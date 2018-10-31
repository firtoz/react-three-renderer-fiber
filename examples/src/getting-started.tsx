// Following https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene

import * as React from "react";
import * as THREE from "three";
import {Euler} from "three";
import {ReactThreeRenderer} from "../../src";

const container = document.createElement("div");

document.body.appendChild(container);

class Demo extends React.Component<any, {
  cubeRotation: Euler,
}> {
  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      cubeRotation: new Euler(),
    };
  }

  public render() {
    return <webGLRenderer
      width={window.innerWidth}
      height={window.innerHeight}

      clearColor={0xdddddd}
      clearAlpha={1}
    >
      <render
        autoRender
        onBeforeRender={this.onAnimationFrame}
        scene={<scene>
          <mesh
            rotation={this.state.cubeRotation}
            geometry={<boxGeometry width={1} height={1} depth={1}/>}
            material={<meshBasicMaterial
              color={0x00ff00}
            />}
          />
          <pointLight
            position={new THREE.Vector3(10, 0, 10)}
            color={0xFFFF00}
          />
        </scene>}
        camera={<perspectiveCamera
          fov={75}
          aspect={window.innerWidth / window.innerHeight}
          near={0.1}
          far={1000}
          position={new THREE.Vector3(0, 0, 5)}
        />}
      />
    </webGLRenderer>;
  }

  private onAnimationFrame = () => {
    this.setState({
      cubeRotation: new Euler(
        this.state.cubeRotation.x + 0.1,
        this.state.cubeRotation.y + 0.1,
        this.state.cubeRotation.z,
      ),
    });
  }
}

ReactThreeRenderer.render(<Demo/>, container);
