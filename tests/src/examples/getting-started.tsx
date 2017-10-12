import * as React from "react";
import {
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";

const {expect} = chai;

describe("getting started", () => {
  after("cleanup", () => {
    ReactThreeRenderer.unmountComponentAtNode(document.body);
  });

  it("works", () => {
    interface IRefProxy<T> {
      ref: T | null;

      (instance: T): void;
    }

    function refProxy<T>(): IRefProxy<T> {
      const self: any = function wrapped(instance: T) {
        self.ref = instance;
      };

      self.ref = null;

      return self;
    }

    const scene = refProxy<Scene>();
    const rendererRef = refProxy<WebGLRenderer>();
    const camera = refProxy<PerspectiveCamera>();

    const boxGeometry = refProxy<BoxGeometry>();
    const material = refProxy<MeshLambertMaterial>();

    const mesh = refProxy<Mesh>();

    const pointLight = refProxy<PointLight>();

    const renderer = ReactThreeRenderer.render(<webGLRenderer
      key="renderer"

      width={800}
      height={600}

      clearColor={0xdddddd}
      clearAlpha={1}

      devicePixelRatio={window.devicePixelRatio}

      ref={rendererRef}
    >
      <scene
        ref={scene}
      >
        <perspectiveCamera
          fov={35}
          aspect={800 / 600}
          near={0.1}
          far={10000}

          position={new Vector3(-15, 10, 10)}
          lookAt={new Vector3(0, 0, 0)}

          ref={camera}
        />
        <mesh
          ref={mesh}
        >
          <boxGeometry
            width={5}
            height={5}
            depth={5}

            ref={boxGeometry}
          />
          <meshLambertMaterial
            color={0xFF0000}

            ref={material}
          />
        </mesh>
        <pointLight
          position={new Vector3(10, 0, 10)}
          color={0xFFFF00}

          ref={pointLight}
        />
      </scene>
    </webGLRenderer>, document.body);

    expect(renderer).to.equal(rendererRef.ref);

    expect(scene.ref, "Scene should be set").not.to.be.null();
    expect(camera.ref, "Camera should be set").not.to.be.null();
    expect(mesh.ref, "Mesh should be set").not.to.be.null();
    expect(pointLight.ref, "Light should be set").not.to.be.null();

    if (mesh.ref !== null) {
      expect(boxGeometry.ref).to.equal(mesh.ref.geometry);
      expect(material.ref).to.equal(mesh.ref.material);
    }

    if (boxGeometry.ref !== null) {
      expect(boxGeometry.ref.parameters.width).to.equal(5);
      expect(boxGeometry.ref.parameters.height).to.equal(5);
      expect(boxGeometry.ref.parameters.depth).to.equal(5);
    }

    if (material.ref !== null) {
      expect(material.ref.color.getHexString()).to.equal("ff0000");
    }

    if (pointLight.ref !== null) {
      expect(pointLight.ref.color.getHexString()).to.equal("ffff00");
    }

    if (rendererRef.ref !== null) {
      expect(rendererRef.ref.getClearColor().getHexString()).to.equal("dddddd");
      expect(rendererRef.ref.getClearAlpha()).to.equal(1);

      if (scene.ref !== null && camera.ref !== null) {
        rendererRef.ref.render(scene.ref, camera.ref);
      }
    }
  });
});
