import * as React from "react";
import {BoxGeometry, Euler, Geometry, Material, Mesh, MeshBasicMaterial, Object3D, Quaternion, Vector3} from "three";
import ReactThreeRenderer from "../../../src/core/renderer/reactThreeRenderer";

import {expect} from "chai";
import * as Sinon from "sinon";
import {mockConsole} from "../index";

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
      it("should be called when initially set", () => {
        const object3DRef = Sinon.spy();

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}
        />, target);

        const object3D: Object3D = object3DRef.lastCall.args[0];

        const lookAtSpy = Sinon.spy(object3D, "lookAt");

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          lookAt={new Vector3(1, 2, 3)}
        />, target);

        expect(lookAtSpy.callCount).to.equal(1);
        expect(lookAtSpy.lastCall.args[0]).to.deep.equal(new Vector3(1, 2, 3));
      });

      it("should be called when updated", () => {
        const object3DRef = Sinon.spy();

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}
        />, target);

        const object3D: Object3D = object3DRef.lastCall.args[0];

        const lookAtSpy = Sinon.spy(object3D, "lookAt");

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          lookAt={new Vector3(1, 2, 3)}
        />, target);

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          lookAt={new Vector3(3, 4, 5)}
        />, target);

        expect(lookAtSpy.callCount).to.equal(2);
        expect(lookAtSpy.lastCall.args[0]).to.deep.equal(new Vector3(3, 4, 5));
      });

      it("should not be called when another property changes", () => {
        const object3DRef = Sinon.spy();

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}
        />, target);

        const object3D: Object3D = object3DRef.lastCall.args[0];

        const lookAtSpy = Sinon.spy(object3D, "lookAt");

        const lookAtVector = new Vector3(1, 2, 3);

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          lookAt={lookAtVector}
        />, target);

        expect(lookAtSpy.callCount).to.equal(1);

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          name="new name"

          lookAt={lookAtVector}
        />, target);

        expect(lookAtSpy.callCount).to.equal(1);
      });

      it("should be called when position property changes", () => {
        const object3DRef = Sinon.spy();

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}
        />, target);

        const object3D: Object3D = object3DRef.lastCall.args[0];

        const lookAtSpy = Sinon.spy(object3D, "lookAt");

        const lookAtVector = new Vector3(1, 2, 3);

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          lookAt={lookAtVector}
        />, target);

        expect(lookAtSpy.callCount).to.equal(1);

        const positionVector = new Vector3(10, 20, 30);

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          position={positionVector}

          lookAt={lookAtVector}
        />, target);

        expect(lookAtSpy.callCount).to.equal(2);
        expect(lookAtSpy.lastCall.args[0]).to.deep.equal(lookAtVector);

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          name="new name"
          position={positionVector}

          lookAt={lookAtVector}
        />, target);

        expect(lookAtSpy.callCount).to.equal(2);
      });

      it("should not be called when the property is removed", () => {
        const object3DRef = Sinon.spy();

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}
        />, target);

        const object3D: Object3D = object3DRef.lastCall.args[0];

        const lookAtSpy = Sinon.spy(object3D, "lookAt");

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          lookAt={new Vector3(1, 2, 3)}
        />, target);

        // even if the position property changes!
        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          position={new Vector3(5, 10, 15)}
        />, target);

        expect(lookAtSpy.callCount).to.equal(1);
      });

      it("should not be called when replaced by another rotation property", () => {
        const object3DRef = Sinon.spy();

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}
        />, target);

        const object3D: Object3D = object3DRef.lastCall.args[0];

        const lookAtSpy = Sinon.spy(object3D, "lookAt");

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          lookAt={new Vector3(1, 2, 3)}
        />, target);

        // even if the position property changes!
        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          rotation={new Euler(5, 10, 15)}
        />, target);

        expect(lookAtSpy.callCount).to.equal(1);

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          lookAt={new Vector3(20, 30, 40)}
        />, target);

        expect(lookAtSpy.callCount).to.equal(2);
        expect(lookAtSpy.lastCall.args[0]).to.deep.equal(new Vector3(20, 30, 40));

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          quaternion={new Quaternion(0, 1, 0, 1)}
        />, target);

        expect(lookAtSpy.callCount).to.equal(2);
      });

      it("should give a warning when other rotation properties exist", () => {
        const object3DRef = Sinon.spy();

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}
        />, target);

        const object3D: Object3D = object3DRef.lastCall.args[0];

        const lookAtSpy = Sinon.spy(object3D, "lookAt");

        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          lookAt={new Vector3(1, 2, 3)}
        />, target);

        // even if the position property changes!

        mockConsole.expectWarn("An object is being updated with both 'lookAt' and 'rotation' properties.\n" +
          "Only 'lookAt' will be applied.");
        ReactThreeRenderer.render(<object3D
          ref={object3DRef}

          lookAt={new Vector3(20, 30, 45)}
          rotation={new Euler(5, 10, 15)}
        />, target);

        expect(lookAtSpy.callCount).to.equal(2);
      });
    });
  });

  describe("for mesh", () => {
    it("should allow material and geometry as children", () => {
      const meshRef = Sinon.spy();
      const geometryRef = Sinon.spy();
      const materialRef = Sinon.spy();

      ReactThreeRenderer.render(<mesh
        ref={meshRef}
      >
        <boxGeometry ref={geometryRef} width={5} height={10} depth={15} />
        <meshBasicMaterial ref={materialRef} color={0xff0000} />
      </mesh>, target);

      const mesh: Mesh = meshRef.lastCall.args[0];
      const geometry: Geometry = geometryRef.lastCall.args[0];
      const material: Material = materialRef.lastCall.args[0];

      expect(mesh).to.be.instanceOf(Mesh);
      expect(geometry).to.be.instanceOf(Geometry);
      expect(material).to.be.instanceOf(Material);

      expect(mesh.geometry).to.equal(geometry);
      expect(mesh.material).to.equal(material);
    });

    it("should allow material and geometry elements as properties", () => {
      const meshRef = Sinon.spy();
      const geometryRef = Sinon.spy();
      const materialRef = Sinon.spy();

      ReactThreeRenderer.render(<mesh
        ref={meshRef}

        geometry={<boxGeometry ref={geometryRef} width={5} height={10} depth={15} />}
        material={<meshBasicMaterial ref={materialRef} color={0xff0000} />}
      >
      </mesh>, target);

      const mesh: Mesh = meshRef.lastCall.args[0];
      const geometry: Geometry = geometryRef.lastCall.args[0];
      const material: Material = materialRef.lastCall.args[0];

      expect(mesh).to.be.instanceOf(Mesh);
      expect(geometry).to.be.instanceOf(Geometry);
      expect(material).to.be.instanceOf(Material);

      expect(mesh.geometry, "Geometry should have been assigned to the mesh").to.equal(geometry);
      expect(mesh.material, "Material should have been assigned to the mesh").to.equal(material);
    });

    it("should allow material and geometry objects as properties", () => {
      const meshRef = Sinon.spy();

      const geometry = new BoxGeometry(5, 6, 7);
      const material = new MeshBasicMaterial({color: 0xff000000});

      ReactThreeRenderer.render(<mesh
        ref={meshRef}

        geometry={geometry}
        material={material}
      >
      </mesh>, target);

      const mesh: Mesh = meshRef.lastCall.args[0];

      expect(mesh).to.be.instanceOf(Mesh);

      expect(mesh.geometry, "Geometry should have been assigned to the mesh").to.equal(geometry);
      expect(mesh.material, "Material should have been assigned to the mesh").to.equal(material);
    });

    it("should allow updating from a geometry object to a geometry element", () => {
      const meshRef = Sinon.spy();
      const geometryRef = Sinon.spy();
      const materialRef = Sinon.spy();

      ReactThreeRenderer.render(<mesh
        ref={meshRef}

        geometry={<boxGeometry ref={geometryRef} width={5} height={10} depth={15} />}
        material={<meshBasicMaterial ref={materialRef} color={0xff0000} />}
      />, target);

      const mesh: Mesh = meshRef.lastCall.args[0];
      const geometry: Geometry = geometryRef.lastCall.args[0];
      const material: Material = materialRef.lastCall.args[0];

      expect(mesh).to.be.instanceOf(Mesh);
      expect(geometry).to.be.instanceOf(Geometry);
      expect(material).to.be.instanceOf(Material);

      expect(mesh.geometry, "Geometry should have been assigned to the mesh").to.equal(geometry);
      expect(mesh.material, "Material should have been assigned to the mesh").to.equal(material);

      const newGeometry = new BoxGeometry(10, 10, 10);
      const newMaterial = new MeshBasicMaterial({color: 0x00FF00});

      ReactThreeRenderer.render(<mesh
        ref={meshRef}

        geometry={newGeometry}
        material={newMaterial}
      />, target);

      expect(mesh.geometry, "Geometry should have been updated for the mesh").to.equal(newGeometry);
      expect(mesh.material, "Material should have been updated for the mesh").to.equal(newMaterial);

      ReactThreeRenderer.render(<mesh
        ref={meshRef}

        geometry={<boxGeometry ref={geometryRef} width={50} height={50} depth={50} />}
        material={<meshBasicMaterial ref={materialRef} color={0xff0000} />}
      />, target);

      const newerGeometry: Geometry = geometryRef.lastCall.args[0];
      const newerMaterial: Geometry = materialRef.lastCall.args[0];

      expect(mesh.geometry, "Geometry should have been assigned to the mesh").to.equal(newerGeometry);
      expect(mesh.material, "Material should have been assigned to the mesh").to.equal(newerMaterial);
    });

    it("should allow mixing of elements and objects", () => {
      // TODO
    });
  });
});
