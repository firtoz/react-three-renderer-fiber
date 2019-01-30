import * as React from "react";
import {BoxGeometry, Mesh, Object3D} from "three";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";

import {expect} from "chai";
import * as Sinon from "sinon";

describe("mounting", () => {
  const target = new Object3D();

  afterEach("cleanup", () => {
    ReactThreeRenderer.unmountComponentAtNode(target);
  });

  // TODO tests
  // null -> null = no change, no updates within refwrapper
  // null -> element = element is mounted, ref gets called
  // null -> raw = raw item gets placed
  // element -> null = element gets unmounted, ref gets called with null
  // element -> same element = ref does not get called, no change
  // element -> same element, but remounted = ref does get called, with same value, gets highlighted in
  // TODO, kill ref wrapper? only support value types in v1?
  // element -> different element = unmount ref gets called for first element, ref gets called for new element, value updates to new element ref
  // element -> raw = element gets unmounted, raw item gets placed
  // raw -> null = raw item gets removed from property
  // raw -> element = element gets mounted into property
  // raw -> same raw = no change, no updates

  it("should mount the geometry property into the mesh", () => {
    const aRef = Sinon.spy();
    const bRef = Sinon.spy();

    ReactThreeRenderer.render(<mesh
      ref={aRef}
      geometry={<boxGeometry
        width={5}
        height={5}
        depth={5}
        ref={bRef}
      />}
    />, target);

    expect(aRef.callCount).to.equal(1);
    expect(bRef.callCount).to.equal(1);

    const a: Mesh = aRef.lastCall.args[0];
    const b: BoxGeometry = bRef.lastCall.args[0];

    expect(a.geometry).to.equal(b, "B should be the geometry of a");
  });

  it("should update the geometry property within the mesh", () => {
    const aRef = Sinon.spy();

    const bSpy = Sinon.spy();
    const bRef = (...args: any[]) => {
      bSpy(...args);
    };

    ReactThreeRenderer.render(<mesh
      ref={aRef}
      geometry={<boxGeometry
        width={5}
        height={5}
        depth={5}
        ref={bRef}
      />}
    />, target);

    expect(aRef.callCount).to.equal(1);
    expect(bSpy.callCount).to.equal(1);

    const a: Mesh = aRef.lastCall.args[0];
    let b: BoxGeometry = bSpy.lastCall.args[0];

    expect(a.geometry).to.equal(b, "B should be the geometry of a");

    ReactThreeRenderer.render(<mesh
      ref={aRef}
      geometry={<boxGeometry
        width={55}
        height={55}
        depth={55}
        ref={bRef}
      />}
    />, target);

    expect(aRef.callCount).to.equal(1);
    expect(bSpy.callCount).to.equal(2);

    b = bSpy.lastCall.args[0];

    expect(a.geometry).to.equal(b, "B should be the geometry of a");
  });

  it("should assign the geometry object property into the mesh", () => {
    const aRef = Sinon.spy();
    const boxGeometry = new BoxGeometry(5, 5, 5);

    ReactThreeRenderer.render(<mesh
      ref={aRef}
      geometry={boxGeometry}
    />, target);

    expect(aRef.callCount).to.equal(1);

    const a: Mesh = aRef.lastCall.args[0];

    expect(a.geometry).to.equal(boxGeometry, "boxGeometry should be the geometry of a");

    ReactThreeRenderer.render(<mesh
      ref={aRef}
    />, target);

    expect(a.geometry).to.equal(null, "The geometry should have been removed from a");
  });

  it("should unmount the geometry property from the mesh", () => {
    const aRef = Sinon.spy();

    ReactThreeRenderer.render(<mesh
      ref={aRef}
      geometry={<boxGeometry
        width={5}
        height={5}
        depth={5}
      />}
    />, target);

    const a: Mesh = aRef.lastCall.args[0];

    ReactThreeRenderer.render(<mesh
      ref={aRef}
    />, target);

    expect(a.geometry).to.equal(null, "The geometry should have been removed from a");
  });
});
