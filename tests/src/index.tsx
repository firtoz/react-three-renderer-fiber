import * as React from "react";

import ReactThreeRenderer from "../../src/core/renderer/reactThreeRenderer";

import * as THREE from "three";

describe("ReactThreeRenderer", () => {
  it("can render into a canvas", (done) => {
    const canvas = document.createElement("canvas");

    document.body.appendChild(canvas);

    let webglRenderer: THREE.WebGLRenderer;

    function webglRendererRef(renderer: THREE.WebGLRenderer) {
      webglRenderer = renderer;
    }

    ReactThreeRenderer.render(<webglRenderer ref={webglRendererRef} width={5} height={5} />, canvas, () => {
      chai.expect(webglRenderer).to.be.an.instanceOf(THREE.WebGLRenderer);

      done();
    });
  });

  it("can render into another object", (done) => {
    const anObject = new THREE.Object3D();

    let childObject: THREE.Object3D;

    function object3DRef(renderer: THREE.Object3D) {
      childObject = renderer;
    }

    ReactThreeRenderer.render(<object3D ref={object3DRef} />, anObject, () => {
      chai.expect(childObject).to.be.an.instanceOf(THREE.Object3D);

      chai.expect(childObject.parent).to.equal(anObject);
      chai.expect(anObject.children[0]).to.equal(childObject);

      done();
    });
  });
});
