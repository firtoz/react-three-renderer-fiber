import * as React from "react";
import {
  Camera,
  CameraHelper,
  Euler,
  Math as THREEMath,
  OrthographicCamera,
  PerspectiveCamera, Scene,
  Vector3,
  WebGLRenderer,
} from "three";

import {ReactThreeRenderer} from "../../src/index";

const container = document.getElementById("example");

const frustumSize = 600;

const particleVertices: Vector3[] = [];

for (let i = 0; i < 10000; i++) {
  const vertex = new Vector3();

  vertex.x = THREEMath.randFloatSpread(2000);
  vertex.y = THREEMath.randFloatSpread(2000);
  vertex.z = THREEMath.randFloatSpread(2000);

  particleVertices.push(vertex);
}

enum CameraType {
  Perspective,
  Orthographic,
}

class CameraExample extends React.Component<{}, { r: number }> {
  private cameraPerspective: PerspectiveCamera;
  private cameraOrtho: OrthographicCamera;

  private cameraPerspectiveHelper: CameraHelper;
  private cameraOrthoHelper: CameraHelper;

  private renderer: WebGLRenderer;

  private camera: PerspectiveCamera;

  private activeHelper: CameraHelper;
  private activeCamera: Camera;

  private chosenCamera: CameraType = CameraType.Perspective;

  private scene: Scene;

  constructor(props: {}, context: any) {
    super(props, context);

    this.state = {
      r: Date.now() * 0.0005,
    };
  }

  public render() {
    const {r} = this.state;

    const meshPosition = new Vector3(
      700 * Math.cos(r),
      700 * Math.sin(r),
      700 * Math.sin(r),
    );

    const innerMeshPosition = new Vector3(
      70 * Math.cos(2 * r),
      150,
      70 * Math.sin(r),
    );

    const SCREEN_WIDTH = window.innerWidth;
    const SCREEN_HEIGHT = window.innerHeight;

    const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    return <webGLRenderer
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}

      antialias

      devicePixelRatio={window.devicePixelRatio}

      autoClear={false}

      ref={this.rendererRef}
    >
      <scene
        ref={this.sceneRef}
      >
        <perspectiveCamera
          fov={50}
          aspect={0.5 * aspect}
          near={1}
          far={10000}
          position={new Vector3(0, 0, 2500)}

          ref={this.cameraRef}
        />
        <cameraHelper
          camera={this.cameraPerspective}
          ref={this.perspectiveCameraHelperRef}
          visible={this.chosenCamera === CameraType.Perspective}
        />
        <cameraHelper
          camera={this.cameraOrtho}
          ref={this.orthographicCameraHelperRef}
          visible={this.chosenCamera === CameraType.Orthographic}
        />
        <group
          lookAt={meshPosition}
        >
          <perspectiveCamera
            fov={35 + 30 * Math.sin(0.5 * r)}
            aspect={0.5 * aspect}
            near={150}
            far={meshPosition.length()}

            ref={this.perspectiveCameraRef}

            rotation={new Euler(0, Math.PI, 0)}
          />
          <orthographicCamera
            left={-0.5 * frustumSize * aspect / 2}
            right={0.5 * frustumSize * aspect / 2}
            top={frustumSize / 2}
            bottom={-frustumSize / 2}

            near={150}
            far={meshPosition.length()}

            ref={this.orthographicCameraRef}

            rotation={new Euler(0, Math.PI, 0)}
          />
          <mesh
            geometry={<sphereGeometry
              radius={5}
              widthSegments={16}
              heightSegments={8}
            />}
            material={
              <meshBasicMaterial
                color={0x0000ff}
                wireframe
              />
            }
            position={new Vector3(0, 0, 150)}
          />
        </group>
        <mesh
          geometry={<sphereGeometry
            radius={100}
            widthSegments={16}
            heightSegments={8}
          />}
          material={
            <meshBasicMaterial
              color={0xffffff}
              wireframe
            />
          }
          position={meshPosition}
        >
          <mesh
            geometry={<sphereGeometry
              radius={50}
              widthSegments={16}
              heightSegments={8}
            />}
            material={
              <meshBasicMaterial
                color={0x00ff00}
                wireframe
              />
            }
            position={innerMeshPosition}
          />
        </mesh>
        <points
          geometry={<geometry
            vertices={particleVertices}
          />}
          material={<pointsMaterial
            color={0x888888}
          />}
        />
      </scene>
    </webGLRenderer>;
  }

  public componentDidMount() {
    this.onAnimationFrame();

    document.addEventListener("keydown", this.onKeyDown, false);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 79: /*O*/
        this.chosenCamera = CameraType.Orthographic;
        this.activeCamera = this.cameraOrtho;
        this.activeHelper = this.cameraOrthoHelper;
        break;
      case 80: /*P*/
        this.chosenCamera = CameraType.Perspective;
        this.activeCamera = this.cameraPerspective;
        this.activeHelper = this.cameraPerspectiveHelper;
        break;
    }
  };

  private onAnimationFrame = () => {
    this.setState({
      r: Date.now() * 0.0005,
    }, () => {
      const SCREEN_WIDTH = window.innerWidth;
      const SCREEN_HEIGHT = window.innerHeight;

      this.renderer.clear();

      this.cameraPerspectiveHelper.update();
      this.cameraOrthoHelper.update();

      const activeHelperWasVisible = this.activeHelper.visible;
      this.activeHelper.visible = false;

      this.renderer.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
      this.renderer.render(this.scene, this.activeCamera);

      this.activeHelper.visible = activeHelperWasVisible;

      this.renderer.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(this.onAnimationFrame);
    });
  };

  private cameraRef = (camera: PerspectiveCamera) => {
    this.camera = camera;
  };

  private perspectiveCameraRef = (camera: PerspectiveCamera) => {
    this.cameraPerspective = camera;

    if (this.chosenCamera === CameraType.Perspective) {
      this.activeCamera = camera;
    }
  };

  private perspectiveCameraHelperRef = (perspectiveCameraHelper: CameraHelper) => {
    this.cameraPerspectiveHelper = perspectiveCameraHelper;

    if (this.chosenCamera === CameraType.Perspective) {
      this.activeHelper = perspectiveCameraHelper;
    }
  };

  private orthographicCameraRef = (camera: OrthographicCamera) => {
    this.cameraOrtho = camera;

    if (this.chosenCamera === CameraType.Orthographic) {
      this.activeCamera = camera;
    }
  };

  private orthographicCameraHelperRef = (orthographicCameraHelper: CameraHelper) => {
    this.cameraOrthoHelper = orthographicCameraHelper;

    if (this.chosenCamera === CameraType.Orthographic) {
      this.activeHelper = orthographicCameraHelper;
    }
  };

  private sceneRef = (scene: Scene) => {
    this.scene = scene;
  };

  private rendererRef = (renderer: WebGLRenderer) => {
    this.renderer = renderer;
  };
}

ReactThreeRenderer.render(<CameraExample/>, container);
