import {expect} from "chai";
import * as React from "react";
import * as Sinon from "sinon";
import {Euler, Mesh, Object3D, Quaternion, Vector3} from "three";
import ReactThreeRenderer from "../../../../src/core/renderer/reactThreeRenderer";
import {mockConsole} from "../../index";
import {propsTarget} from "../props";

describe("for types that extend object3d", () => {
  it("should be set and updated", (done) => {
    const meshRef = Sinon.spy();

    ReactThreeRenderer.render(<mesh
      name={"test-name"}

      ref={meshRef}
    />, propsTarget);

    const mesh: Mesh = meshRef.lastCall.args[0];
    expect(mesh.name).to.equal("test-name");

    ReactThreeRenderer.render(<mesh
      name={"updated-name"}
    />, propsTarget);

    expect(mesh.name).to.equal("updated-name");

    done();
  });
});

describe("for object3D", () => {
  describe("lookAt", () => {
    it("should be called when initially set", () => {
      const object3DRef = Sinon.spy();

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}
      />, propsTarget);

      const object3D: Object3D = object3DRef.lastCall.args[0];

      const lookAtSpy = Sinon.spy(object3D, "lookAt");

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        lookAt={new Vector3(1, 2, 3)}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(1);
      expect(lookAtSpy.lastCall.args[0]).to.deep.equal(new Vector3(1, 2, 3));
    });

    it("should be called when updated", () => {
      const object3DRef = Sinon.spy();

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}
      />, propsTarget);

      const object3D: Object3D = object3DRef.lastCall.args[0];

      const lookAtSpy = Sinon.spy(object3D, "lookAt");

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        lookAt={new Vector3(1, 2, 3)}
      />, propsTarget);

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        lookAt={new Vector3(3, 4, 5)}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(2);
      expect(lookAtSpy.lastCall.args[0]).to.deep.equal(new Vector3(3, 4, 5));
    });

    it("should not be called when another property changes", () => {
      const object3DRef = Sinon.spy();

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}
      />, propsTarget);

      const object3D: Object3D = object3DRef.lastCall.args[0];

      const lookAtSpy = Sinon.spy(object3D, "lookAt");

      const lookAtVector = new Vector3(1, 2, 3);

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        lookAt={lookAtVector}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(1);

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        name="new name"

        lookAt={lookAtVector}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(1);
    });

    it("should be called when position property changes", () => {
      const object3DRef = Sinon.spy();

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}
      />, propsTarget);

      const object3D: Object3D = object3DRef.lastCall.args[0];

      const lookAtSpy = Sinon.spy(object3D, "lookAt");

      const lookAtVector = new Vector3(1, 2, 3);

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        lookAt={lookAtVector}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(1);

      const positionVector = new Vector3(10, 20, 30);

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        position={positionVector}

        lookAt={lookAtVector}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(2);
      expect(lookAtSpy.lastCall.args[0]).to.deep.equal(lookAtVector);

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        name="new name"
        position={positionVector}

        lookAt={lookAtVector}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(2);
    });

    it("should not be called when the property is removed", () => {
      const object3DRef = Sinon.spy();

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}
      />, propsTarget);

      const object3D: Object3D = object3DRef.lastCall.args[0];

      const lookAtSpy = Sinon.spy(object3D, "lookAt");

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        lookAt={new Vector3(1, 2, 3)}
      />, propsTarget);

      // even if the position property changes!
      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        position={new Vector3(5, 10, 15)}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(1);
    });

    it("should not be called when replaced by another rotation property", () => {
      const object3DRef = Sinon.spy();

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}
      />, propsTarget);

      const object3D: Object3D = object3DRef.lastCall.args[0];

      const lookAtSpy = Sinon.spy(object3D, "lookAt");

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        lookAt={new Vector3(1, 2, 3)}
      />, propsTarget);

      // even if the position property changes!
      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        rotation={new Euler(5, 10, 15)}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(1);

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        lookAt={new Vector3(20, 30, 40)}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(2);
      expect(lookAtSpy.lastCall.args[0]).to.deep.equal(new Vector3(20, 30, 40));

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        quaternion={new Quaternion(0, 1, 0, 1)}
      />, propsTarget);

      expect(lookAtSpy.callCount).to.equal(2);
    });

    it("should give a warning when other rotation properties exist", () => {
      const object3DRef = Sinon.spy();

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}
      />, propsTarget);

      const object3D: Object3D = object3DRef.lastCall.args[0];

      const lookAtSpy = Sinon.spy(object3D, "lookAt");

      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        lookAt={new Vector3(1, 2, 3)}
      />, propsTarget);

      // even if the position property changes!

      mockConsole.expectWarnDev("An object is being updated with both 'lookAt' and 'rotation' properties.\n" +
        "Only 'lookAt' will be applied.");
      ReactThreeRenderer.render(<object3D
        ref={object3DRef}

        lookAt={new Vector3(20, 30, 45)}
        rotation={new Euler(5, 10, 15)}
      />, propsTarget);

      mockConsole.revert();

      expect(lookAtSpy.callCount).to.equal(2);
    });
  });
});
