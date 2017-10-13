import {expect} from "chai";
import * as React from "react";
import * as Sinon from "sinon";
import {
  BoxGeometry,
  Camera,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";

import {mockConsole} from "../index";

describe("render", () => {
  function verifyRenderCall(rendererSpy: Sinon.SinonSpy) {
    expect(rendererSpy.callCount).to.equal(1);

    const lastCall = rendererSpy.lastCall;

    const scene = lastCall.args[0] as Scene;

    expect(scene).to.be.instanceOf(Scene);
    expect(lastCall.args[1]).to.be.instanceOf(Camera);

    expect(scene.children.length).to.equal(1);

    const mesh = scene.children[0] as Mesh;

    expect(mesh).to.be.instanceOf(Mesh);

    expect(mesh.geometry).to.be.instanceOf(BoxGeometry);
    expect(mesh.material).to.be.instanceOf(MeshLambertMaterial);
  }

  it("should be able to be rendered into a renderer", (done) => {
    mockConsole.expectLog("THREE.WebGLRenderer", "87");
    mockConsole.expectWarn("THREE.WebGLProgram: gl.getProgramInfoLog()", "\n\n\n");

    const renderer = new WebGLRenderer();

    const renderCallSpy = Sinon.spy(renderer, "render");

    ReactThreeRenderer.render(<render
      camera={<perspectiveCamera name="perspective-camera" />}
      scene={<scene>
        <mesh>
          <boxGeometry width={5} height={5} depth={5} />
          <meshLambertMaterial />
        </mesh>
      </scene>} />, renderer);

    verifyRenderCall(renderCallSpy);

    ReactThreeRenderer.unmountComponentAtNode(renderer, () => {
      done();
    });
  });

  it("should be able to be rendered into a container within a renderer", (done) => {
    const container = document.createElement("canvas");

    const rendererSpy = Sinon.spy();

    ReactThreeRenderer.render(<webGLRenderer
      width={800}
      height={600}

      ref={rendererSpy}
    />, container);

    expect(rendererSpy.callCount).to.equal(1);

    const renderer = rendererSpy.lastCall.args[0];

    expect(renderer).to.be.instanceOf(WebGLRenderer);

    const renderCallSpy = Sinon.spy(rendererSpy.lastCall.args[0], "render");

    expect(renderCallSpy.notCalled).to.equal(true);

    ReactThreeRenderer.render(<webGLRenderer
      width={800}
      height={600}

      ref={rendererSpy}
    >
      <render
        camera={<perspectiveCamera name="perspective-camera" />}
        scene={<scene>
          <mesh>
            <boxGeometry width={5} height={5} depth={5} />
            <meshLambertMaterial />
          </mesh>
        </scene>} />
    </webGLRenderer>, container);

    verifyRenderCall(renderCallSpy);

    done();
  });

  it("should call the camera and scene refs with the correct objects", (done) => {
    const container = document.createElement("canvas");

    const perspectiveCameraRef = Sinon.spy();
    const sceneRef = Sinon.spy();

    ReactThreeRenderer.render(<webGLRenderer
      width={800}
      height={600}
    >
      <render
        camera={<perspectiveCamera ref={perspectiveCameraRef} name="some camera" />}
        scene={<scene ref={sceneRef} name="some scene">
          <mesh>
            <boxGeometry width={5} height={5} depth={5} />
            <meshLambertMaterial />
          </mesh>
        </scene>} />
    </webGLRenderer>, container);

    expect(perspectiveCameraRef.callCount).to.equal(1);
    expect(perspectiveCameraRef.lastCall.args[0].name).to.equal("some camera");

    expect(sceneRef.callCount).to.equal(1);
    expect(sceneRef.lastCall.args[0].name).to.equal("some scene");

    ReactThreeRenderer.render(<webGLRenderer
      width={800}
      height={600}
    >
      <render
        camera={<perspectiveCamera name="some camera" />}
        scene={<scene name="some scene">
          <mesh>
            <boxGeometry width={5} height={5} depth={5} />
            <meshLambertMaterial />
          </mesh>
        </scene>} />
    </webGLRenderer>, container);

    expect(perspectiveCameraRef.callCount).to.equal(2);
    expect(perspectiveCameraRef.lastCall.args[0]).to.equal(null);

    expect(sceneRef.callCount).to.equal(2);
    expect(sceneRef.lastCall.args[0]).to.equal(null);

    done();
  });

  it("should accept a scene as a parameter", (done) => {
    const scene = new Scene();

    ReactThreeRenderer.render(<render
      camera={null}
      scene={scene}>

    </render>, document.body);

    done();
  });

  it("should accept a scene element as a parameter", (done) => {
    done();
  });

  it("should accept a camera as a parameter", (done) => {
    const camera = new PerspectiveCamera();

    ReactThreeRenderer.render(<render
      camera={camera}
      scene={null}>

    </render>, document.body);

    done();
  });

  it("should accept a camera element as a parameter", (done) => {
    done();
  });

  it("should trigger a render when a visible element is added", (done) => {
    done();
  });

  it("should trigger a render when a visible element is updated", (done) => {
    done();
  });

  it("should not trigger a render when an invisible element is added", (done) => {
    done();
  });

  it("should not trigger a render when am invisible element is updated", (done) => {
    done();
  });
});
