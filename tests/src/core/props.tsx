import * as React from "react";
import {Mesh, Object3D} from "three";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";

import {expect} from "chai";
import * as Sinon from "sinon";

describe("props", () => {
  const target = new Object3D();

  afterEach("cleanup", () => {
    ReactThreeRenderer.unmountComponentAtNode(target);
  });

  it("should be updated", (done) => {
    const object3DRef = Sinon.spy();

    ReactThreeRenderer.render(<object3D
      name={"test-name"}

      ref={object3DRef}
    />, target);

    const object3D: Object3D = object3DRef.lastCall.args[0];
    expect(object3D.name).to.equal("test-name");

    ReactThreeRenderer.render(<object3D
      name={"updated-name"}
    />, target);

    expect(object3D.name).to.equal("updated-name");

    done();
  });

  describe("for types that extend object3d", () => {
    it("should be set and updated", (done) => {
      const meshRef = Sinon.spy();

      ReactThreeRenderer.render(<mesh
        name={"test-name"}

        ref={meshRef}
      />, target);

      const mesh: Mesh = meshRef.lastCall.args[0];
      expect(mesh.name).to.equal("test-name");

      ReactThreeRenderer.render(<mesh
        name={"updated-name"}
      />, target);

      expect(mesh.name).to.equal("updated-name");

      done();
    });
  });

  describe("for object3D", () => {
    describe("lookAt", () => {
      it("should be called when initially set", (done) => {
        // TODO
        done();
      });

      it("should be called when position property changes", (done) => {
        // TODO
        done();
      });

      it("should be called when updated", (done) => {
        // TODO
        done();
      });

      it("should not be called when replaced by another rotation property", (done) => {
        // TODO
        done();
      });

      it("should give a warning when other rotation properties exist", (done) => {
        // TODO
        done();
      });
    });
  });
});
