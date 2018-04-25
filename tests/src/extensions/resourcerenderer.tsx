import CustomReactRenderer from "../../../src/core/customRenderer/customReactRenderer";
import * as React from "react";
import {CustomReconcilerConfig} from "../../../src/core/customRenderer/createReconciler";
import ReactThreeRendererDescriptor
  from "../../../src/core/renderer/hostDescriptors/common/ReactThreeRendererDescriptor";


import * as THREE from "three";
// import ReactThreeRenderer from "../../../../src/core/renderer/reactThreeRenderer";

import dirtyChai = require("dirty-chai");
import {BoxGeometry, BufferGeometry, Geometry} from "three";

// import {testContainers} from "../../index";

class ResourceReconcilerConfig extends CustomReconcilerConfig<ReactThreeRendererDescriptor> {

}

class ResourceRenderer extends CustomReactRenderer {
}

const resourceRenderer = new ResourceRenderer(new ResourceReconcilerConfig());
// export default new ReactThreeRenderer(r3rReconcilerConfig);

chai.use(dirtyChai);

describe("with a canvas", () => {
  it("can render into a canvas", (done) => {
    const container = {};

    let geometry: BufferGeometry | null = null;

    function geometryRef(geom: BoxGeometry) {

    }

    resourceRenderer.render(<resources>
      <boxGeometry
        width={20}
        height={20}
        depth={20}
        ref={geometryRef}/>
    </resources>, container);

    chai.expect(geometry).not.to.be.null();
    chai.expect(geometry).to.be.instanceOf(BoxGeometry);
    // let rendererInstance: THREE.WebGLRenderer;
    //
    // function webGLRendererRef(renderer: THREE.WebGLRenderer) {
    //   rendererInstance = renderer;
    // }
    //
    // const testCanvas = testContainers.canvas;
    //
    // ReactThreeRenderer.render(<webGLRenderer ref={webGLRendererRef} width={5} height={5}/>, testCanvas, () => {
    //   chai.expect(rendererInstance).to.be.an.instanceOf(THREE.WebGLRenderer);
    //   chai.expect(rendererInstance.domElement).to.equal(testCanvas);
    //
    //   ReactThreeRenderer.unmountComponentAtNode(testCanvas, () => {
    //     chai.expect(rendererInstance, "rendererInstance should have been null").to.be.null();
    //
    //     done();
    //   });
    // });
  });
});
