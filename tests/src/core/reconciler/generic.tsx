import * as React from "react";
import * as THREE from "three";
import ReactThreeRenderer from "../../../../src/core/renderer/reactThreeRenderer";

describe("generic", () => {
  it("can render into another object", (done) => {
    const parentObject = new THREE.Object3D();

    let childObject: THREE.Object3D;

    function object3DRef(renderer: THREE.Object3D) {
      childObject = renderer;
    }

    ReactThreeRenderer.render(<object3D ref={object3DRef} />, parentObject, () => {
      chai.expect(childObject).to.be.an.instanceOf(THREE.Object3D);

      chai.expect(childObject.parent).to.equal(parentObject);
      chai.expect(parentObject.children[0]).to.equal(childObject);

      ReactThreeRenderer.unmountComponentAtNode(parentObject, () => {
        chai.expect(childObject, "childObject should have been null").to.be.null();

        chai.expect(parentObject.children.length, "Child object should have been removed from the parent")
          .to.equal(0);

        done();
      });
    });
  });
});
