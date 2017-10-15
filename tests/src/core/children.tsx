import * as React from "react";
import {Object3D} from "three";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";

import {expect} from "chai";
import * as Sinon from "sinon";

describe("children", () => {
  const target = new Object3D();

  afterEach("cleanup", () => {
    ReactThreeRenderer.unmountComponentAtNode(target);
  });

  it("should place children in the right order", () => {
    const aRef = Sinon.spy();
    const bRef = Sinon.spy();
    const cRef = Sinon.spy();

    ReactThreeRenderer.render([
      null,
      <object3D
        name={"b"}
        key="b"

        ref={bRef}
      />,
      <object3D
        name={"c"}
        key="c"

        ref={cRef}
      />,
    ], target);

    expect(aRef.callCount).to.equal(0);
    expect(bRef.callCount).to.equal(1);
    expect(cRef.callCount).to.equal(1);

    const b: Object3D = bRef.lastCall.args[0];

    expect(b.name).to.equal("b");
    expect(target.children.indexOf(b), "B should be the first object in the target").to.equal(0);

    ReactThreeRenderer.render([
      <object3D
        name={"a"}
        key="a"

        ref={aRef}
      />,
      <object3D
        name={"b"}
        key="b"

        ref={bRef}
      />,
      <object3D
        name={"c"}
        key="c"

        ref={cRef}
      />,
    ], target);

    expect(aRef.callCount).to.equal(1);
    expect(bRef.callCount).to.equal(1);

    const a: Object3D = aRef.lastCall.args[0];

    expect(a.name).to.equal("a");

    expect(target.children.indexOf(a), "A should be the first child").to.equal(0);
    expect(target.children.indexOf(b), "B should be the second child").to.equal(1);

    ReactThreeRenderer.render([
      <object3D
        name={"b"}
        key="b"

        ref={bRef}
      />,
      <object3D
        name={"a"}
        key="a"

        ref={aRef}
      />,
      <object3D
        name={"c"}
        key="c"

        ref={cRef}
      />,
    ], target);

    expect(aRef.callCount).to.equal(1);
    expect(bRef.callCount).to.equal(1);

    expect(target.children.indexOf(a), "A should be the second child").to.equal(1);
    expect(target.children.indexOf(b), "B should be the first child").to.equal(0);
  });
});
