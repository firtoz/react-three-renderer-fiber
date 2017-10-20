import * as React from "react";
import {Object3D} from "three";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";

import {expect} from "chai";
import * as Sinon from "sinon";

export const propsTarget = new Object3D();

describe("props", () => {
  afterEach("cleanup", () => {
    ReactThreeRenderer.unmountComponentAtNode(propsTarget);
  });

  it("should be updated", (done) => {
    const object3DRef = Sinon.spy();

    ReactThreeRenderer.render(<object3D
      name={"test-name"}

      ref={object3DRef}
    />, propsTarget);

    const object3D: Object3D = object3DRef.lastCall.args[0];
    expect(object3D.name).to.equal("test-name");

    ReactThreeRenderer.render(<object3D
      name={"updated-name"}
    />, propsTarget);

    expect(object3D.name).to.equal("updated-name");

    done();
  });

  require("./props/object3d");
  require("./props/mesh");

  // TODO check default value restoration for perspective camera
  // TODO check default value restoration for property groups (alpha / color for renderers?)
});
