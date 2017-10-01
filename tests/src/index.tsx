import * as React from "react";

import ReactThreeRenderer from "../../src/core/renderer/reactThreeRenderer";

import * as THREE from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      webglRenderer: any;
      object3D: any;
    }
  }
}

describe("ReactThreeRenderer", () => {
  it("can render into a canvas", (done) => {
    const canvas = document.createElement("canvas");

    document.body.appendChild(canvas);

    let webglRenderer: THREE.WebGLRenderer;

    function webglRendererRef(renderer: THREE.WebGLRenderer) {
      // console.log("got renderer:", renderer);
      webglRenderer = renderer;
    }

    console.log("starting render");

    ReactThreeRenderer.render(<webglRenderer ref={webglRendererRef} width={5} height={5} />, canvas, () => {
      // console.log("render fin!");

      chai.expect(webglRenderer).to.be.an.instanceOf(THREE.WebGLRenderer);

      done();
    });

    console.log("end render");
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
