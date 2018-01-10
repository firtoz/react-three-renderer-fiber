import {expect} from "chai";
import * as React from "react";
import * as Sinon from "sinon";
import {
  BoxGeometry,
  Camera, Group,
  Mesh,
  MeshLambertMaterial, Object3D,
  PerspectiveCamera,
  Scene, Vector3,
  WebGLRenderer,
} from "three";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";

import object3D from "../../../src/core/renderer/hostDescriptors/descriptors/objects/object3D";
import {RenderAction} from "../../../src/core/renderer/hostDescriptors/descriptors/render";
import webGLRenderer from "../../../src/core/renderer/hostDescriptors/descriptors/webGLRenderer";
import wrRenderer from "../../../src/core/WR/wrRenderer";
import {mockConsole, testContainers} from "../index";

const {div: testDiv} = testContainers;

describe("render", () => {
  function verifyRenderCall(rendererSpy: Sinon.SinonSpy) {
    expect(rendererSpy.callCount, "Render should only be called once").to.equal(1);

    const lastCall = rendererSpy.lastCall;

    const scene = lastCall.args[0] as Scene;

    expect(scene).to.be.instanceOf(Scene);
    expect(lastCall.args[1]).to.be.instanceOf(Camera);

    expect(scene.children.length, "Scene should only have one child").to.equal(1);

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
      camera={<perspectiveCamera />}
      scene={<scene>
        <mesh>
          <boxGeometry width={5} height={5} depth={5} />
          <meshLambertMaterial />
        </mesh>
      </scene>} />, renderer);

    requestAnimationFrame(() => {
      verifyRenderCall(renderCallSpy);

      ReactThreeRenderer.unmountComponentAtNode(renderer, () => {
        done();
      });
    });
  });

  it("should be able to be rendered into a container within a renderer", (done) => {
    const rendererSpy = Sinon.spy();

    const {canvas: testCanvas} = testContainers;

    ReactThreeRenderer.render(<webGLRenderer
      width={800}
      height={600}

      ref={rendererSpy}
    />, testCanvas);

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
        camera={<perspectiveCamera />}
        scene={<scene>
          <mesh>
            <boxGeometry width={5} height={5} depth={5} />
            <meshLambertMaterial />
          </mesh>
        </scene>} />
    </webGLRenderer>, testCanvas);

    requestAnimationFrame(() => {
      verifyRenderCall(renderCallSpy);

      ReactThreeRenderer.unmountComponentAtNode(testCanvas, done);
    });
  });

  it("should not render if scene or camera are null", (done: () => {}) => {
    mockConsole.expectLog("THREE.WebGLRenderer", "87");

    const renderer = new WebGLRenderer();

    const renderCallSpy = Sinon.spy(renderer, "render");

    ReactThreeRenderer.render(<render
      camera={null}
      scene={null}
    />, renderer);

    requestAnimationFrame(() => {
      expect(renderCallSpy.callCount).to.equal(0);

      ReactThreeRenderer.render(<render
        camera={null}
        scene={<scene>
          <mesh>
            <boxGeometry width={5} height={5} depth={5} />
            <meshLambertMaterial />
          </mesh>
        </scene>} />, renderer);

      requestAnimationFrame(() => {
        expect(renderCallSpy.callCount).to.equal(0);

        ReactThreeRenderer.render(<render
          camera={<perspectiveCamera />}
          scene={null} />, renderer);

        requestAnimationFrame(() => {
          expect(renderCallSpy.callCount).to.equal(0);

          mockConsole.expectWarn("THREE.WebGLProgram: gl.getProgramInfoLog()", "\n\n\n");

          ReactThreeRenderer.render(<render
            camera={<perspectiveCamera />}
            scene={<scene>
              <mesh>
                <boxGeometry width={5} height={5} depth={5} />
                <meshLambertMaterial />
              </mesh>
            </scene>} />, renderer);

          requestAnimationFrame(() => {
            expect(renderCallSpy.callCount).to.equal(1);

            ReactThreeRenderer.unmountComponentAtNode(renderer, done);
          });
        });
      });
    });
  });

  it("should call the camera and scene refs with the correct objects", (done) => {
    const perspectiveCameraRef = Sinon.spy();
    const sceneRef = Sinon.spy();

    const {canvas: testCanvas} = testContainers;

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
    </webGLRenderer>, testCanvas);

    expect(perspectiveCameraRef.callCount).to.equal(1);
    expect(sceneRef.callCount).to.equal(1);

    const firstCamera: Camera = perspectiveCameraRef.lastCall.args[0];
    const firstScene: Scene = sceneRef.lastCall.args[0];

    expect(firstCamera.name).to.equal("some camera");
    expect(firstScene.name).to.equal("some scene");

    // they should have mounted into the same group
    const renderActionGroup: Group = firstScene.parent;

    expect(renderActionGroup).to.not.equal(null);
    expect(renderActionGroup).to.equal(firstCamera.parent);

    ReactThreeRenderer.render(<webGLRenderer
      width={800}
      height={600}
    >
      <render
        camera={<perspectiveCamera ref={perspectiveCameraRef} name="same camera different name" />}
        scene={<scene ref={sceneRef} name="same scene different name">
          <mesh>
            <boxGeometry width={5} height={5} depth={5} />
            <meshLambertMaterial />
          </mesh>
        </scene>} />
    </webGLRenderer>, testCanvas);

    // the refs should not be called again
    expect(perspectiveCameraRef.callCount).to.equal(1);
    expect(sceneRef.callCount).to.equal(1);

    expect(firstCamera.parent).to.equal(renderActionGroup);
    expect(firstScene.parent).to.equal(renderActionGroup);

    expect(firstCamera.name).to.equal("same camera different name");
    expect(firstScene.name).to.equal("same scene different name");

    ReactThreeRenderer.render(<webGLRenderer
      width={800}
      height={600}
    >
      <render
        camera={<perspectiveCamera ref={perspectiveCameraRef} name="another camera" key={"3"} />}
        scene={<scene ref={sceneRef} name="another scene" key={"4"}>
          <mesh>
            <boxGeometry width={5} height={5} depth={5} />
            <meshLambertMaterial />
          </mesh>
        </scene>} />
    </webGLRenderer>, testCanvas);

    // but for different keys, they should be!
    expect(perspectiveCameraRef.callCount).to.equal(3);
    expect(sceneRef.callCount).to.equal(3);

    // names should not have changed but they should have dismounted
    expect(firstCamera.name).to.equal("same camera different name");
    expect(firstScene.name).to.equal("same scene different name");

    expect(firstCamera.parent).to.equal(null);
    expect(firstScene.parent).to.equal(null);

    const secondCamera = perspectiveCameraRef.lastCall.args[0];
    const secondScene = sceneRef.lastCall.args[0];

    expect(secondCamera).to.not.equal(firstCamera);
    expect(secondScene).to.not.equal(firstScene);

    // they should have replaced the first camera and scene in the same group
    expect(secondCamera.parent).to.equal(renderActionGroup);
    expect(secondScene.parent).to.equal(renderActionGroup);

    expect(secondCamera.name).to.equal("another camera");
    expect(secondScene.name).to.equal("another scene");

    ReactThreeRenderer.render(<webGLRenderer
      width={800}
      height={600}
    >
      <render
        camera={<perspectiveCamera name="second camera but without ref this time" key={"3"} />}
        scene={<scene name="second scene but without ref this time" key={"4"}>
          <mesh>
            <boxGeometry width={5} height={5} depth={5} />
            <meshLambertMaterial />
          </mesh>
        </scene>} />
    </webGLRenderer>, testCanvas);

    expect(perspectiveCameraRef.callCount).to.equal(4);
    expect(sceneRef.callCount).to.equal(4);

    expect(perspectiveCameraRef.lastCall.args[0]).to.equal(null);
    expect(sceneRef.lastCall.args[0]).to.equal(null);

    expect(firstCamera.name).to.equal("same camera different name");
    expect(firstScene.name).to.equal("same scene different name");

    // sure the ref may not be called but it's still the same object
    expect(secondCamera.name).to.equal("second camera but without ref this time");
    expect(secondScene.name).to.equal("second scene but without ref this time");

    // and should remain in group
    expect(secondCamera.parent).to.equal(renderActionGroup);
    expect(secondScene.parent).to.equal(renderActionGroup);

    ReactThreeRenderer.render(<webGLRenderer
      width={800}
      height={600}
    >
      <render
        camera={<perspectiveCamera name="third camera" key={"10"} />}
        scene={<scene name="third scene" key={"20"}>
          <mesh>
            <boxGeometry width={5} height={5} depth={5} />
            <meshLambertMaterial />
          </mesh>
        </scene>} />
    </webGLRenderer>, testCanvas);

    expect(perspectiveCameraRef.callCount).to.equal(4);
    expect(sceneRef.callCount).to.equal(4);

    expect(perspectiveCameraRef.lastCall.args[0]).to.equal(null);
    expect(sceneRef.lastCall.args[0]).to.equal(null);

    expect(firstCamera.name).to.equal("same camera different name");
    expect(firstScene.name).to.equal("same scene different name");

    // second one should have dismounted, but the third one will be created
    expect(secondCamera.name).to.equal("second camera but without ref this time");
    expect(secondScene.name).to.equal("second scene but without ref this time");

    expect(secondCamera.parent).to.equal(null);
    expect(secondScene.parent).to.equal(null);

    const thirdCamera = renderActionGroup.children.filter((child) => child instanceof Camera)[0];
    const thirdScene = renderActionGroup.children.filter((child) => child instanceof Scene)[0];

    expect(thirdCamera.name).to.equal("third camera");
    expect(thirdScene.name).to.equal("third scene");

    ReactThreeRenderer.unmountComponentAtNode(testCanvas, done);
  });

  it("should accept a scene as a parameter", (done) => {
    mockConsole.expectLog("THREE.WebGLRenderer", "87");

    const renderer = new WebGLRenderer();

    const renderCallSpy = Sinon.spy(renderer, "render");
    const perspectiveCameraSpy = Sinon.spy();

    const scene = new Scene();

    ReactThreeRenderer.render(<render
      camera={<perspectiveCamera ref={perspectiveCameraSpy} />}
      scene={scene}
    />, renderer);

    requestAnimationFrame(() => {
      const lastCall = renderCallSpy.lastCall;

      expect(lastCall.args[0], "Scene from object reference should have been used")
        .to.equal(scene);
      expect(lastCall.args[1], "Camera from element should have been used")
        .to.equal(perspectiveCameraSpy.lastCall.args[0]);

      ReactThreeRenderer.unmountComponentAtNode(testDiv, done);
    });
  });

  it("should accept a camera as a parameter", (done) => {
    mockConsole.expectLog("THREE.WebGLRenderer", "87");

    const renderer = new WebGLRenderer();

    const renderCallSpy = Sinon.spy(renderer, "render");
    const sceneRef = Sinon.spy();

    const camera = new PerspectiveCamera();

    ReactThreeRenderer.render(<render
      camera={camera}
      scene={<scene ref={sceneRef} />}
    />, renderer);

    requestAnimationFrame(() => {
      const lastCall = renderCallSpy.lastCall;

      expect(lastCall.args[0], "Scene from element should have been used")
        .to.equal(sceneRef.lastCall.args[0]);
      expect(lastCall.args[1], "Camera from element should have been used")
        .to.equal(camera);

      ReactThreeRenderer.unmountComponentAtNode(testDiv, done);
    });
  });

  it("should trigger a render when a visible element is added or removed", (done) => {
    mockConsole.expectLog("THREE.WebGLRenderer", "87");

    const renderer = new WebGLRenderer();

    const renderCallSpy = Sinon.spy(renderer, "render");

    let setChildren: ((childCount: number, callback: () => void) => void) | null = null;

    class TestContainer extends React.Component<any, { childCount: number }> {
      constructor() {
        super();

        this.state = {
          childCount: 0,
        };

        setChildren = (childCount: number, callback: () => void) => {
          this.setState({
            childCount,
          }, () => {
            requestAnimationFrame(callback);
          });
        };
      }

      public render() {
        const children = [];

        for (let i = 0; i < this.state.childCount; ++i) {
          children.push(<object3D key={`${i}`} />);
        }

        return <object3D>
          {children}
        </object3D>;
      }
    }

    ReactThreeRenderer.render(<render
      camera={<perspectiveCamera />}
      scene={<scene>
        <TestContainer />
      </scene>}
    />, renderer);

    if (setChildren == null) {
      return;
    }

    const updateChildren = setChildren;

    requestAnimationFrame(() => {
      expect(renderCallSpy.callCount).to.equal(1);

      requestAnimationFrame(() => {
        // nothing has changed!
        expect(renderCallSpy.callCount).to.equal(1);

        // add a child
        updateChildren(1, () => {
          // it should render
          expect(renderCallSpy.callCount).to.equal(2);

          // do not add a child
          updateChildren(1, () => {
            // should not have rendered!
            expect(renderCallSpy.callCount).to.equal(2);

            // add another child
            updateChildren(2, () => {
              // should have rendered!
              expect(renderCallSpy.callCount).to.equal(3);

              // remove children
              updateChildren(0, () => {
                // should have rendered!
                expect(renderCallSpy.callCount).to.equal(4);

                ReactThreeRenderer.unmountComponentAtNode(testDiv, done);
              });
            });
          });
        });
      });
    });
  });

  it("should allow custom renderers", (done) => {
    wrRenderer.render(<test />, testDiv);

    done();
  });

  it("should trigger a render only when a visible property is updated", (done) => {
    mockConsole.expectLog("THREE.WebGLRenderer", "87");

    const renderer = new WebGLRenderer();

    let nameChangeEvent: any = null;
    let positionChangeEvent: any = null;

    class ObjectStateChanger extends React.Component<any, {
      name: string,
      position: Vector3,
    }> {
      constructor() {
        super();

        this.state = {
          name: "test",
          position: new Vector3(),
        };
      }

      public componentDidMount() {
        nameChangeEvent = (newName: string, callback: () => {}) => {
          this.setState({
            name: newName,
          }, callback);
        };

        positionChangeEvent = (newPosition: Vector3, callback: () => {}) => {
          this.setState({
            position: newPosition,
          }, callback);
        };
      }

      public render() {
        return <object3D
          position={this.state.position}
          name={this.state.name}
        />;
      }
    }

    const changerSpy = Sinon.spy();

    const renderRef = Sinon.spy();

    ReactThreeRenderer.render(<render
      ref={renderRef}
      camera={<perspectiveCamera />}
      scene={<scene>
        <ObjectStateChanger ref={changerSpy} />
      </scene>} />, renderer);

    const render: RenderAction = renderRef.lastCall.args[0];

    const renderCallSpy = Sinon.spy(render, "triggerRender");

    expect(renderCallSpy.callCount).to.equal(0);

    const obj: Object3D = ReactThreeRenderer.findTHREEObject(changerSpy.lastCall.args[0]);

    positionChangeEvent(new Vector3(1, 2, 3), () => {
      expect(renderCallSpy.callCount).to.equal(1);
      expect(obj.position.equals(new Vector3(1, 2, 3))).to.equal(true);

      nameChangeEvent("new name", () => {
        expect(renderCallSpy.callCount).to.equal(1);
        expect(obj.name).to.equal("new name");

        positionChangeEvent(new Vector3(3, 2, 1), () => {
          expect(renderCallSpy.callCount).to.equal(2);
          expect(obj.position.equals(new Vector3(3, 2, 1))).to.equal(true);

          nameChangeEvent("newer name", () => {
            expect(renderCallSpy.callCount).to.equal(2);
            expect(obj.name).to.equal("newer name");

            ReactThreeRenderer.unmountComponentAtNode(renderer, () => {
              done();
            });
          });
        });
      });
    });
  });
});
