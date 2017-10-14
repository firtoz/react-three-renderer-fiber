import * as React from "react";
import * as THREE from "three";
import ReactThreeRenderer from "../../../../src/core/renderer/reactThreeRenderer";

import dirtyChai = require("dirty-chai");
import {testElements} from "../../index";

chai.use(dirtyChai);

describe("with a canvas", () => {
  it("can render into a canvas", (done) => {
    let rendererInstance: THREE.WebGLRenderer;

    function webGLRendererRef(renderer: THREE.WebGLRenderer) {
      rendererInstance = renderer;
    }

    const testCanvas = testElements.canvas;

    ReactThreeRenderer.render(<webGLRenderer ref={webGLRendererRef} width={5} height={5} />, testCanvas, () => {
      chai.expect(rendererInstance).to.be.an.instanceOf(THREE.WebGLRenderer);
      chai.expect(rendererInstance.domElement).to.equal(testCanvas);

      ReactThreeRenderer.unmountComponentAtNode(testCanvas, () => {
        chai.expect(rendererInstance, "rendererInstance should have been null").to.be.null();

        done();
      });
    });
  });
});
