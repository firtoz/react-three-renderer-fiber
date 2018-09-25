import {expect} from "chai";
import * as React from "react";
import * as Sinon from "sinon";
import {BoxGeometry, Geometry, Material, Mesh, MeshBasicMaterial} from "three";
import ReactThreeRenderer from "../../../../src/core/renderer/reactThreeRenderer";
import {propsTarget} from "../props";

describe("for mesh", () => {
  it("should allow material and geometry as children", () => {
    const meshRef = Sinon.spy();
    const geometryRef = Sinon.spy();
    const materialRef = Sinon.spy();

    ReactThreeRenderer.render(<mesh
      ref={meshRef}
    >
      <boxGeometry ref={geometryRef} width={5} height={10} depth={15}/>
      <meshBasicMaterial ref={materialRef} color={0xff0000}/>
    </mesh>, propsTarget);

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

      geometry={<boxGeometry ref={geometryRef} width={5} height={10} depth={15}/>}
      material={<meshBasicMaterial ref={materialRef} color={0xff0000}/>}
    />, propsTarget);

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
    </mesh>, propsTarget);

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

      geometry={<boxGeometry ref={geometryRef} width={5} height={10} depth={15}/>}
      material={<meshBasicMaterial ref={materialRef} color={0xff0000}/>}
    />, propsTarget);

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
    />, propsTarget);

    expect(mesh.geometry, "Geometry should have been updated for the mesh").to.equal(newGeometry);
    expect(mesh.material, "Material should have been updated for the mesh").to.equal(newMaterial);

    ReactThreeRenderer.render(<mesh
      ref={meshRef}

      geometry={<boxGeometry ref={geometryRef} width={50} height={50} depth={50}/>}
      material={<meshBasicMaterial ref={materialRef} color={0xff0000}/>}
    />, propsTarget);

    const newerGeometry: Geometry = geometryRef.lastCall.args[0];
    const newerMaterial: Geometry = materialRef.lastCall.args[0];

    expect(mesh.geometry, "Geometry should have been assigned to the mesh").to.equal(newerGeometry);
    expect(mesh.material, "Material should have been assigned to the mesh").to.equal(newerMaterial);
  });

  it("should allow mixing of elements and objects", () => {
    const meshRef = Sinon.spy();
    const geometryRef = Sinon.spy();
    const materialRef = Sinon.spy();

    ReactThreeRenderer.render(<mesh
      ref={meshRef}

      geometry={<boxGeometry ref={geometryRef} width={5} height={10} depth={15}/>}
      material={<meshBasicMaterial ref={materialRef} color={0xff0000}/>}
    />, propsTarget);

    const mesh: Mesh = meshRef.lastCall.args[0];
    const geometry: Geometry = geometryRef.lastCall.args[0];
    const material: Material = materialRef.lastCall.args[0];

    expect(mesh).to.be.instanceOf(Mesh);
    expect(geometry).to.be.instanceOf(Geometry);
    expect(material).to.be.instanceOf(Material);

    expect(mesh.geometry, "Geometry should have been assigned to the mesh").to.equal(geometry);
    expect(mesh.material, "Material should have been assigned to the mesh").to.equal(material);

    const newGeometry = new BoxGeometry(10, 10, 10);

    ReactThreeRenderer.render(<mesh
      ref={meshRef}

      geometry={newGeometry}
      material={<meshBasicMaterial ref={materialRef} color={0xff0000}/>}
    />, propsTarget);

    expect(mesh.geometry, "Geometry should have been updated for the mesh").to.equal(newGeometry);
    expect(mesh.material, "Material should have been updated for the mesh").to.equal(material);
    expect(materialRef.callCount, "MaterialRef should not have been called again").to.equal(1);

    const newMaterial = new MeshBasicMaterial({color: 0x00FF00});

    ReactThreeRenderer.render(<mesh
      ref={meshRef}

      geometry={<boxGeometry ref={geometryRef} width={5} height={10} depth={15}/>}
      material={newMaterial}
    />, propsTarget);

    expect(mesh.geometry, "Geometry should have been assigned to the mesh").to.equal(geometryRef.lastCall.args[0]);
    expect(mesh.material, "Material should have been updated for the mesh").to.equal(newMaterial);
    expect(materialRef.callCount, "materialRef should have been called again").to.equal(2);
    expect(materialRef.lastCall.args[0], "materialRef should have received a null parameter").to.equal(null);
  });
});
