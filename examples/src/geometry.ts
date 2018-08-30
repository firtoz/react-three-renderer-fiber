/**
 * @author TatumCreative (Greg Tatum) / http://gregtatum.com/
 */
import * as THREE from "three";
import {BufferGeometry, Geometry, Group, LineSegments, Mesh, Vector2} from "three";
import { gui } from "./geometry-browser";

const twoPi = Math.PI * 2;

function updateGroupGeometry(mesh: Group, geometry: Geometry | BufferGeometry) {
  (mesh.children[0] as LineSegments).geometry.dispose();
  (mesh.children[1] as Mesh).geometry.dispose();

  (mesh.children[0] as LineSegments).geometry = new THREE.WireframeGeometry(geometry);
  (mesh.children[1] as Mesh).geometry = geometry;

  // these do not update nicely together if shared
}

function CustomSinCurve(scale: number) {
  THREE.Curve.call(this);

  this.scale = scale === undefined ? 1 : scale;
}

CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
CustomSinCurve.prototype.constructor = CustomSinCurve;

CustomSinCurve.prototype.getPoint = function(t: number) {
  const tx = t * 3 - 1.5;
  const ty = Math.sin(2 * Math.PI * t);
  const tz = 0;

  return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
};

// heart shape

const x = 0;
const y = 0;

const heartShape = new THREE.Shape();

heartShape.moveTo(x + 5, y + 5);
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

const guis: { [key: string]: (mesh: Group) => void; } = {
  BoxBufferGeometry(mesh: Group) {
    const data = {
      depth: 15,
      depthSegments: 1,
      height: 15,
      heightSegments: 1,
      width: 15,
      widthSegments: 1,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.BoxBufferGeometry(
          data.width,
          data.height,
          data.depth,
          data.widthSegments,
          data.heightSegments,
          data.depthSegments,
        ),
      );
    }

    const folder = gui.addFolder("THREE.BoxBufferGeometry");

    folder.add(data, "width", 1, 30).onChange(generateGeometry);
    folder.add(data, "height", 1, 30).onChange(generateGeometry);
    folder.add(data, "depth", 1, 30).onChange(generateGeometry);
    folder
      .add(data, "widthSegments", 1, 10)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "heightSegments", 1, 10)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "depthSegments", 1, 10)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  BoxGeometry(mesh: Group) {
    const data = {
      depth: 15,
      depthSegments: 1,
      height: 15,
      heightSegments: 1,
      width: 15,
      widthSegments: 1,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.BoxGeometry(
          data.width,
          data.height,
          data.depth,
          data.widthSegments,
          data.heightSegments,
          data.depthSegments,
        ),
      );
    }

    const folder = gui.addFolder("THREE.BoxGeometry");

    folder.add(data, "width", 1, 30).onChange(generateGeometry);
    folder.add(data, "height", 1, 30).onChange(generateGeometry);
    folder.add(data, "depth", 1, 30).onChange(generateGeometry);
    folder
      .add(data, "widthSegments", 1, 10)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "heightSegments", 1, 10)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "depthSegments", 1, 10)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  CylinderBufferGeometry(mesh: Group) {
    const data = {
      height: 10,
      heightSegments: 1,
      openEnded: false,
      radialSegments: 8,
      radiusBottom: 5,
      radiusTop: 5,
      thetaLength: twoPi,
      thetaStart: 0,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.CylinderBufferGeometry(
          data.radiusTop,
          data.radiusBottom,
          data.height,
          data.radialSegments,
          data.heightSegments,
          data.openEnded,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    const folder = gui.addFolder("THREE.CylinderBufferGeometry");

    folder.add(data, "radiusTop", 0, 30).onChange(generateGeometry);
    folder.add(data, "radiusBottom", 0, 30).onChange(generateGeometry);
    folder.add(data, "height", 1, 50).onChange(generateGeometry);
    folder
      .add(data, "radialSegments", 3, 64)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "heightSegments", 1, 64)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "openEnded").onChange(generateGeometry);
    folder.add(data, "thetaStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  CylinderGeometry(mesh: Group) {
    const data = {
      height: 10,
      heightSegments: 1,
      openEnded: false,
      radialSegments: 8,
      radiusBottom: 5,
      radiusTop: 5,
      thetaLength: twoPi,
      thetaStart: 0,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.CylinderGeometry(
          data.radiusTop,
          data.radiusBottom,
          data.height,
          data.radialSegments,
          data.heightSegments,
          data.openEnded,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    const folder = gui.addFolder("THREE.CylinderGeometry");

    folder.add(data, "radiusTop", 1, 30).onChange(generateGeometry);
    folder.add(data, "radiusBottom", 1, 30).onChange(generateGeometry);
    folder.add(data, "height", 1, 50).onChange(generateGeometry);
    folder
      .add(data, "radialSegments", 3, 64)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "heightSegments", 1, 64)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "openEnded").onChange(generateGeometry);
    folder.add(data, "thetaStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  ConeBufferGeometry(mesh: Group) {
    const data = {
      height: 10,
      heightSegments: 1,
      openEnded: false,
      radialSegments: 8,
      radius: 5,
      thetaLength: twoPi,
      thetaStart: 0,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.ConeBufferGeometry(
          data.radius,
          data.height,
          data.radialSegments,
          data.heightSegments,
          data.openEnded,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    const folder = gui.addFolder("THREE.ConeBufferGeometry");

    folder.add(data, "radius", 0, 30).onChange(generateGeometry);
    folder.add(data, "height", 1, 50).onChange(generateGeometry);
    folder
      .add(data, "radialSegments", 3, 64)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "heightSegments", 1, 64)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "openEnded").onChange(generateGeometry);
    folder.add(data, "thetaStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  ConeGeometry(mesh: Group) {
    const data = {
      height: 10,
      heightSegments: 1,
      openEnded: false,
      radialSegments: 8,
      radius: 5,
      thetaLength: twoPi,
      thetaStart: 0,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.ConeGeometry(
          data.radius,
          data.height,
          data.radialSegments,
          data.heightSegments,
          data.openEnded,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    const folder = gui.addFolder("THREE.ConeGeometry");

    folder.add(data, "radius", 0, 30).onChange(generateGeometry);
    folder.add(data, "height", 1, 50).onChange(generateGeometry);
    folder
      .add(data, "radialSegments", 3, 64)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "heightSegments", 1, 64)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "openEnded").onChange(generateGeometry);
    folder.add(data, "thetaStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  CircleBufferGeometry(mesh: Group) {
    const data = {
      radius: 10,
      segments: 32,
      thetaLength: twoPi,
      thetaStart: 0,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.CircleBufferGeometry(
          data.radius,
          data.segments,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    const folder = gui.addFolder("THREE.CircleBufferGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "segments", 0, 128)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "thetaStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  CircleGeometry(mesh: Group) {
    const data = {
      radius: 10,
      segments: 32,
      thetaLength: twoPi,
      thetaStart: 0,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.CircleGeometry(
          data.radius,
          data.segments,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    const folder = gui.addFolder("THREE.CircleGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "segments", 0, 128)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "thetaStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  DodecahedronGeometry(mesh: Group) {
    const data = {
      detail: 0,
      radius: 10,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.DodecahedronGeometry(data.radius, data.detail),
      );
    }

    const folder = gui.addFolder("THREE.DodecahedronGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "detail", 0, 5)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  DodecahedronBufferGeometry(mesh: Group) {
    const data = {
      detail: 0,
      radius: 10,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.DodecahedronBufferGeometry(data.radius, data.detail),
      );
    }

    const folder = gui.addFolder("THREE.DodecahedronBufferGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "detail", 0, 5)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  IcosahedronGeometry(mesh: Group) {
    const data = {
      detail: 0,
      radius: 10,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.IcosahedronGeometry(data.radius, data.detail),
      );
    }

    const folder = gui.addFolder("THREE.IcosahedronGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "detail", 0, 5)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  IcosahedronBufferGeometry(mesh: Group) {
    const data = {
      detail: 0,
      radius: 10,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.IcosahedronBufferGeometry(data.radius, data.detail),
      );
    }

    const folder = gui.addFolder("THREE.IcosahedronBufferGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "detail", 0, 5)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  LatheBufferGeometry(mesh: Group) {
    const points: Vector2[] = [];

    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
    }

    const data = {
      phiLength: twoPi,
      phiStart: 0,
      segments: 12,
    };

    function generateGeometry() {
      const geometry = new THREE.LatheBufferGeometry(
        points,
        data.segments,
        data.phiStart,
        data.phiLength,
      );

      updateGroupGeometry(mesh, geometry);
    }

    const folder = gui.addFolder("THREE.LatheBufferGeometry");

    folder
      .add(data, "segments", 1, 30)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "phiStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "phiLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  LatheGeometry(mesh: Group) {
    const points: Vector2[] = [];

    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
    }

    const data = {
      phiLength: twoPi,
      phiStart: 0,
      segments: 12,
    };

    function generateGeometry() {
      const geometry = new THREE.LatheGeometry(
        points,
        data.segments,
        data.phiStart,
        data.phiLength,
      );

      updateGroupGeometry(mesh, geometry);
    }

    const folder = gui.addFolder("THREE.LatheGeometry");

    folder
      .add(data, "segments", 1, 30)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "phiStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "phiLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  OctahedronGeometry(mesh: Group) {
    const data = {
      detail: 0,
      radius: 10,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.OctahedronGeometry(data.radius, data.detail),
      );
    }

    const folder = gui.addFolder("THREE.OctahedronGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "detail", 0, 5)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  OctahedronBufferGeometry(mesh: Group) {
    const data = {
      detail: 0,
      radius: 10,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.OctahedronBufferGeometry(data.radius, data.detail),
      );
    }

    const folder = gui.addFolder("THREE.OctahedronBufferGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "detail", 0, 5)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  PlaneBufferGeometry(mesh: Group) {
    const data = {
      height: 10,
      heightSegments: 1,
      width: 10,
      widthSegments: 1,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.PlaneBufferGeometry(
          data.width,
          data.height,
          data.widthSegments,
          data.heightSegments,
        ),
      );
    }

    const folder = gui.addFolder("THREE.PlaneBufferGeometry");

    folder.add(data, "width", 1, 30).onChange(generateGeometry);
    folder.add(data, "height", 1, 30).onChange(generateGeometry);
    folder
      .add(data, "widthSegments", 1, 30)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "heightSegments", 1, 30)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  PlaneGeometry(mesh: Group) {
    const data = {
      height: 10,
      heightSegments: 1,
      width: 10,
      widthSegments: 1,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.PlaneGeometry(
          data.width,
          data.height,
          data.widthSegments,
          data.heightSegments,
        ),
      );
    }

    const folder = gui.addFolder("THREE.PlaneGeometry");

    folder.add(data, "width", 1, 30).onChange(generateGeometry);
    folder.add(data, "height", 1, 30).onChange(generateGeometry);
    folder
      .add(data, "widthSegments", 1, 30)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "heightSegments", 1, 30)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  RingBufferGeometry(mesh: Group) {
    const data = {
      innerRadius: 5,
      outerRadius: 10,
      phiSegments: 8,
      thetaLength: twoPi,
      thetaSegments: 8,
      thetaStart: 0,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.RingBufferGeometry(
          data.innerRadius,
          data.outerRadius,
          data.thetaSegments,
          data.phiSegments,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    const folder = gui.addFolder("THREE.RingBufferGeometry");

    folder.add(data, "innerRadius", 1, 30).onChange(generateGeometry);
    folder.add(data, "outerRadius", 1, 30).onChange(generateGeometry);
    folder
      .add(data, "thetaSegments", 1, 30)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "phiSegments", 1, 30)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "thetaStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  RingGeometry(mesh: Group) {
    const data = {
      innerRadius: 5,
      outerRadius: 10,
      phiSegments: 8,
      thetaLength: twoPi,
      thetaSegments: 8,
      thetaStart: 0,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.RingGeometry(
          data.innerRadius,
          data.outerRadius,
          data.thetaSegments,
          data.phiSegments,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    const folder = gui.addFolder("THREE.RingGeometry");

    folder.add(data, "innerRadius", 1, 30).onChange(generateGeometry);
    folder.add(data, "outerRadius", 1, 30).onChange(generateGeometry);
    folder
      .add(data, "thetaSegments", 1, 30)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "phiSegments", 1, 30)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "thetaStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  SphereBufferGeometry(mesh: Group) {
    const data = {
      heightSegments: 6,
      phiLength: twoPi,
      phiStart: 0,
      radius: 15,
      thetaLength: Math.PI,
      thetaStart: 0,
      widthSegments: 8,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.SphereBufferGeometry(
          data.radius,
          data.widthSegments,
          data.heightSegments,
          data.phiStart,
          data.phiLength,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    const folder = gui.addFolder("THREE.SphereBufferGeometry");

    folder.add(data, "radius", 1, 30).onChange(generateGeometry);
    folder
      .add(data, "widthSegments", 3, 32)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "heightSegments", 2, 32)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "phiStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "phiLength", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  SphereGeometry(mesh: Group) {
    const data = {
      heightSegments: 6,
      phiLength: twoPi,
      phiStart: 0,
      radius: 15,
      thetaLength: Math.PI,
      thetaStart: 0,
      widthSegments: 8,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.SphereGeometry(
          data.radius,
          data.widthSegments,
          data.heightSegments,
          data.phiStart,
          data.phiLength,
          data.thetaStart,
          data.thetaLength,
        ),
      );
    }

    const folder = gui.addFolder("THREE.SphereGeometry");

    folder.add(data, "radius", 1, 30).onChange(generateGeometry);
    folder
      .add(data, "widthSegments", 3, 32)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "heightSegments", 2, 32)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "phiStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "phiLength", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaStart", 0, twoPi).onChange(generateGeometry);
    folder.add(data, "thetaLength", 0, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  TetrahedronGeometry(mesh: Group) {
    const data = {
      detail: 0,
      radius: 10,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.TetrahedronGeometry(data.radius, data.detail),
      );
    }

    const folder = gui.addFolder("THREE.TetrahedronGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "detail", 0, 5)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  TetrahedronBufferGeometry(mesh: Group) {
    const data = {
      detail: 0,
      radius: 10,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.TetrahedronBufferGeometry(data.radius, data.detail),
      );
    }

    const folder = gui.addFolder("THREE.TetrahedronBufferGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "detail", 0, 5)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  TextGeometry(mesh: Group) {
    const data = {
      bevelEnabled: false,
      bevelSegments: 3,
      bevelSize: 0.5,
      bevelThickness: 1,
      curveSegments: 12,
      font: "helvetiker",
      height: 2,
      size: 5,
      text: "TextGeometry",
      weight: "regular",
    };

    const fonts = ["helvetiker", "optimer", "gentilis", "droid/droid_serif"];

    const weights = ["regular", "bold"];

    function generateGeometry() {
      const loader = new THREE.FontLoader();
      loader.load(
        "../../examples/fonts/" +
          data.font +
          "_" +
          data.weight +
          ".typeface.json",
        (font) => {
          const geometry = new THREE.TextGeometry(data.text, {
            bevelEnabled: data.bevelEnabled,
            bevelSegments: data.bevelSegments,
            bevelSize: data.bevelSize,
            bevelThickness: data.bevelThickness,
            curveSegments: data.curveSegments,
            font,
            height: data.height,
            size: data.size,
          });
          geometry.center();

          updateGroupGeometry(mesh, geometry);
        },
      );
    }

    // Hide the wireframe
    mesh.children[0].visible = false;

    const folder = gui.addFolder("THREE.TextGeometry");

    folder.add(data, "text").onChange(generateGeometry);
    folder.add(data, "size", 1, 30).onChange(generateGeometry);
    folder.add(data, "height", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "curveSegments", 1, 20)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "font", fonts).onChange(generateGeometry);
    folder.add(data, "weight", weights).onChange(generateGeometry);
    folder.add(data, "bevelEnabled").onChange(generateGeometry);
    folder.add(data, "bevelThickness", 0.1, 3).onChange(generateGeometry);
    folder.add(data, "bevelSize", 0.1, 3).onChange(generateGeometry);
    folder
      .add(data, "bevelSegments", 0, 8)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  TextBufferGeometry(mesh: Group) {
    const data = {
      bevelEnabled: false,
      bevelSegments: 3,
      bevelSize: 0.5,
      bevelThickness: 1,
      curveSegments: 12,
      font: "helvetiker",
      height: 2,
      size: 5,
      text: "TextBufferGeometry",
      weight: "regular",
    };

    const fonts = ["helvetiker", "optimer", "gentilis", "droid/droid_serif"];

    const weights = ["regular", "bold"];

    function generateGeometry() {
      const loader = new THREE.FontLoader();
      loader.load(
        "../../examples/fonts/" +
          data.font +
          "_" +
          data.weight +
          ".typeface.json",
        (font) => {
          const geometry = new THREE.TextBufferGeometry(data.text, {
            bevelEnabled: data.bevelEnabled,
            bevelSegments: data.bevelSegments,
            bevelSize: data.bevelSize,
            bevelThickness: data.bevelThickness,
            curveSegments: data.curveSegments,
            font,
            height: data.height,
            size: data.size,
          });
          geometry.center();

          updateGroupGeometry(mesh, geometry);
        },
      );
    }

    // Hide the wireframe
    mesh.children[0].visible = false;

    const folder = gui.addFolder("THREE.TextBufferGeometry");

    folder.add(data, "text").onChange(generateGeometry);
    folder.add(data, "size", 1, 30).onChange(generateGeometry);
    folder.add(data, "height", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "curveSegments", 1, 20)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "font", fonts).onChange(generateGeometry);
    folder.add(data, "weight", weights).onChange(generateGeometry);
    folder.add(data, "bevelEnabled").onChange(generateGeometry);
    folder.add(data, "bevelThickness", 0.1, 3).onChange(generateGeometry);
    folder.add(data, "bevelSize", 0.1, 3).onChange(generateGeometry);
    folder
      .add(data, "bevelSegments", 0, 8)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  TorusBufferGeometry(mesh: Group) {
    const data = {
      arc: twoPi,
      radialSegments: 16,
      radius: 10,
      tube: 3,
      tubularSegments: 100,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.TorusBufferGeometry(
          data.radius,
          data.tube,
          data.radialSegments,
          data.tubularSegments,
          data.arc,
        ),
      );
    }

    const folder = gui.addFolder("THREE.TorusBufferGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder.add(data, "tube", 0.1, 10).onChange(generateGeometry);
    folder
      .add(data, "radialSegments", 2, 30)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "tubularSegments", 3, 200)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "arc", 0.1, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  TorusGeometry(mesh: Group) {
    const data = {
      arc: twoPi,
      radialSegments: 16,
      radius: 10,
      tube: 3,
      tubularSegments: 100,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.TorusGeometry(
          data.radius,
          data.tube,
          data.radialSegments,
          data.tubularSegments,
          data.arc,
        ),
      );
    }

    const folder = gui.addFolder("THREE.TorusGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder.add(data, "tube", 0.1, 10).onChange(generateGeometry);
    folder
      .add(data, "radialSegments", 2, 30)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "tubularSegments", 3, 200)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "arc", 0.1, twoPi).onChange(generateGeometry);

    generateGeometry();
  },

  TorusKnotBufferGeometry(mesh: Group) {
    const data = {
      p: 2,
      q: 3,
      radialSegments: 8,
      radius: 10,
      tube: 3,
      tubularSegments: 64,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.TorusKnotBufferGeometry(
          data.radius,
          data.tube,
          data.tubularSegments,
          data.radialSegments,
          data.p,
          data.q,
        ),
      );
    }

    const folder = gui.addFolder("THREE.TorusKnotBufferGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder.add(data, "tube", 0.1, 10).onChange(generateGeometry);
    folder
      .add(data, "tubularSegments", 3, 300)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "radialSegments", 3, 20)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "p", 1, 20)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "q", 1, 20)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  TorusKnotGeometry(mesh: Group) {
    const data = {
      p: 2,
      q: 3,
      radialSegments: 8,
      radius: 10,
      tube: 3,
      tubularSegments: 64,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.TorusKnotGeometry(
          data.radius,
          data.tube,
          data.tubularSegments,
          data.radialSegments,
          data.p,
          data.q,
        ),
      );
    }

    const folder = gui.addFolder("THREE.TorusKnotGeometry");

    folder.add(data, "radius", 1, 20).onChange(generateGeometry);
    folder.add(data, "tube", 0.1, 10).onChange(generateGeometry);
    folder
      .add(data, "tubularSegments", 3, 300)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "radialSegments", 3, 20)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "p", 1, 20)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "q", 1, 20)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  ParametricBufferGeometry(mesh: Group) {
    const data = {
      slices: 25,
      stacks: 25,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.ParametricBufferGeometry(
          // TODO: fix
          (THREE as any).ParametricGeometries.klein,
          data.slices,
          data.stacks,
        ),
      );
    }

    const folder = gui.addFolder("THREE.ParametricBufferGeometry");

    folder
      .add(data, "slices", 1, 100)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "stacks", 1, 100)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  ParametricGeometry(mesh: Group) {
    const data = {
      slices: 25,
      stacks: 25,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.ParametricGeometry(
          // TODO: fix
          (THREE as any).ParametricGeometries.klein,
          data.slices,
          data.stacks,
        ),
      );
    }

    const folder = gui.addFolder("THREE.ParametricGeometry");

    folder
      .add(data, "slices", 1, 100)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "stacks", 1, 100)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  TubeGeometry(mesh: Group) {
    const data = {
      radialSegments: 8,
      radius: 2,
      segments: 20,
    };

    // TODO: fix
    const path = CustomSinCurve(10) as any;

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.TubeGeometry(
          path,
          data.segments,
          data.radius,
          data.radialSegments,
          false,
        ),
      );
    }

    const folder = gui.addFolder("THREE.TubeGeometry");

    folder
      .add(data, "segments", 1, 100)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "radius", 1, 10).onChange(generateGeometry);
    folder
      .add(data, "radialSegments", 1, 20)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  TubeBufferGeometry(mesh: Group) {
    const data = {
      radialSegments: 8,
      radius: 2,
      segments: 20,
    };

    // TODO: fix
    const path = CustomSinCurve(10) as any;

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new THREE.TubeBufferGeometry(
          path,
          data.segments,
          data.radius,
          data.radialSegments,
          false,
        ),
      );
    }

    const folder = gui.addFolder("THREE.TubeBufferGeometry");

    folder
      .add(data, "segments", 1, 100)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "radius", 1, 10).onChange(generateGeometry);
    folder
      .add(data, "radialSegments", 1, 20)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  ShapeGeometry(mesh: Group) {
    const data = {
      segments: 12,
    };

    function generateGeometry() {
      const geometry = new THREE.ShapeGeometry(heartShape, data.segments);
      geometry.center();

      updateGroupGeometry(mesh, geometry);
    }

    const folder = gui.addFolder("THREE.ShapeGeometry");
    folder
      .add(data, "segments", 1, 100)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  ShapeBufferGeometry(mesh: Group) {
    const data = {
      segments: 12,
    };

    function generateGeometry() {
      const geometry = new THREE.ShapeBufferGeometry(heartShape, data.segments);
      geometry.center();

      updateGroupGeometry(mesh, geometry);
    }

    const folder = gui.addFolder("THREE.ShapeBufferGeometry");
    folder
      .add(data, "segments", 1, 100)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  ExtrudeGeometry(mesh: Group) {
    const data = {
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 1,
      bevelThickness: 1,
      depth: 16,
      steps: 2,
    };

    const length = 12;
    const width = 8;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    function generateGeometry() {
      const geometry = new THREE.ExtrudeGeometry(shape, data);
      geometry.center();

      updateGroupGeometry(mesh, geometry);
    }

    const folder = gui.addFolder("THREE.ExtrudeGeometry");

    folder
      .add(data, "steps", 1, 10)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "depth", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "bevelThickness", 1, 5)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "bevelSize", 1, 5)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "bevelSegments", 1, 5)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },

  ExtrudeBufferGeometry(mesh: Group) {
    const data = {
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 1,
      bevelThickness: 1,
      depth: 16,
      steps: 2,
    };

    const length = 12;
    const width = 8;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    function generateGeometry() {
      // TODO: fix
      const geometry = new THREE.ExtrudeBufferGeometry(shape as any, data);
      geometry.center();

      updateGroupGeometry(mesh, geometry);
    }

    const folder = gui.addFolder("THREE.ExtrudeBufferGeometry");

    folder
      .add(data, "steps", 1, 10)
      .step(1)
      .onChange(generateGeometry);
    folder.add(data, "depth", 1, 20).onChange(generateGeometry);
    folder
      .add(data, "bevelThickness", 1, 5)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "bevelSize", 1, 5)
      .step(1)
      .onChange(generateGeometry);
    folder
      .add(data, "bevelSegments", 1, 5)
      .step(1)
      .onChange(generateGeometry);

    generateGeometry();
  },
};

export function chooseFromHash(mesh: Group) {
  const selectedGeometry = window.location.hash.substring(1) || "TorusGeometry";

  if (guis[selectedGeometry] !== undefined) {
    guis[selectedGeometry](mesh);
  }

  if (
    selectedGeometry === "TextGeometry" ||
    selectedGeometry === "TextBufferGeometry"
  ) {
    return { fixed: true };
  }

  // No configuration options
  return {};
}
