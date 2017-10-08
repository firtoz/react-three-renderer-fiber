import * as React from "react";
import * as THREE from "three";
import ReactThreeRenderer from "../../../../src/core/renderer/reactThreeRenderer";

import dirtyChai = require("dirty-chai");

chai.use(dirtyChai);

describe("with a canvas", () => {
  let canvas: HTMLCanvasElement;

  before(() => {
    canvas = document.createElement("canvas");

    document.body.appendChild(canvas);
  });

  it("can render into a canvas", (done) => {
    let rendererInstance: THREE.WebGLRenderer;

    function webGLRendererRef(renderer: THREE.WebGLRenderer) {
      rendererInstance = renderer;
    }

    ReactThreeRenderer.render(<webGLRenderer ref={webGLRendererRef} width={5} height={5} />, canvas, () => {
      chai.expect(rendererInstance).to.be.an.instanceOf(THREE.WebGLRenderer);
      chai.expect(rendererInstance.domElement).to.equal(canvas);

      ReactThreeRenderer.unmountComponentAtNode(canvas, () => {
        chai.expect(rendererInstance, "rendererInstance should have been null").to.be.null();

        done();
      });
    });
  });

  after(() => {
    document.body.removeChild(canvas);
  });
});
