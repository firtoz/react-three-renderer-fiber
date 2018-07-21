// tslint:disable-next-line
require("three/examples/js/controls/OrbitControls");

/* testing cloth simulation */
const pinsFormation: number[][] = [];
let pins = [6];
pinsFormation.push(pins);
pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
pinsFormation.push(pins);
pins = [0];
pinsFormation.push(pins);
pins = []; // cut the rope ;)
pinsFormation.push(pins);
pins = [0, (global as any).cloth.w]; // classic 2 pins
pinsFormation.push(pins);
pins = pinsFormation[1];

(global as any).pins = pins;

function togglePins(e: Event) {
  // tslint:disable-next-line
  pins = pinsFormation[~~(Math.random() * pinsFormation.length)];
  (global as any).pins = pins;

  e.preventDefault();

  return false;
}

(global as any).togglePins = togglePins;

// if (!Detector.webgl) Detector.addGetWebGLMessage();
let container: any;
// let stats: any;
let camera: any;
let scene: any;
let renderer: any;
let clothGeometry: any;
let sphere: any;
let object: any;

init();
animate();

function init() {
  const clothFunction = (global as any).clothFunction;
  const ballSize = (global as any).ballSize;
  const cloth = (global as any).cloth;

  container = document.createElement("div");
  document.body.appendChild(container);

  // scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcce0ff);
  scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);
  // camera
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(1000, 50, 1500);
  // lights
  let light: any;
  scene.add(new THREE.AmbientLight(0x666666));
  light = new THREE.DirectionalLight(0xdfebff, 1);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(1.3);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  const d = 300;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.far = 1000;
  scene.add(light);
  // cloth material
  const loader = new THREE.TextureLoader();
  const clothTexture = loader.load("textures/patterns/circuit_pattern.png");
  clothTexture.anisotropy = 16;
  const clothMaterial = new THREE.MeshLambertMaterial({
    alphaTest: 0.5,
    map: clothTexture,
    side: THREE.DoubleSide,
  });
  // cloth geometry
  clothGeometry = new THREE.ParametricGeometry(clothFunction, cloth.w, cloth.h);
  (global as any).clothGeometry = clothGeometry;
  // cloth mesh
  object = new THREE.Mesh(clothGeometry, clothMaterial);
  object.position.set(0, 0, 0);
  object.castShadow = true;
  scene.add(object);
  object.customDepthMaterial = new THREE.MeshDepthMaterial({
    alphaTest: 0.5,
    depthPacking: THREE.RGBADepthPacking,
    map: clothTexture,
  } as any);
  // sphere
  const ballGeo = new THREE.SphereBufferGeometry(ballSize, 32, 16);
  const ballMaterial = new THREE.MeshLambertMaterial();
  sphere = new THREE.Mesh(ballGeo, ballMaterial);
  (global as any).sphere = sphere;
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);
  // ground
  const groundTexture = loader.load("textures/terrain/grasslight-big.jpg");
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(25, 25);
  groundTexture.anisotropy = 16;
  const groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
  let mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
  mesh.position.y = -250;
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);
  // poles
  const poleGeo = new THREE.BoxBufferGeometry(5, 375, 5);
  const poleMat = new THREE.MeshLambertMaterial();
  mesh = new THREE.Mesh(poleGeo, poleMat);
  mesh.position.x = -125;
  mesh.position.y = -62;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);
  mesh = new THREE.Mesh(poleGeo, poleMat);
  mesh.position.x = 125;
  mesh.position.y = -62;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);
  mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(255, 5, 5), poleMat);
  mesh.position.y = -250 + (750 / 2);
  mesh.position.x = 0;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);
  const gg = new THREE.BoxBufferGeometry(10, 10, 10);
  mesh = new THREE.Mesh(gg, poleMat);
  mesh.position.y = -250;
  mesh.position.x = 125;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);
  mesh = new THREE.Mesh(gg, poleMat);
  mesh.position.y = -250;
  mesh.position.x = -125;
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add(mesh);
  // renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  // controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 1000;
  controls.maxDistance = 5000;
  // performance monitor
  // stats = new Stats();
  // container.appendChild(stats.dom);
  //
  window.addEventListener("resize", onWindowResize, false);
  sphere.visible = !true;
}

//
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//
function animate() {
  const windForce = (global as any).windForce;
  const simulate = (global as any).simulate;

  requestAnimationFrame(animate);
  const time = Date.now();
  const windStrength = Math.cos(time / 7000) * 20 + 40;
  windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000));
  windForce.normalize();
  windForce.multiplyScalar(windStrength);
  simulate(time);
  render();
  // stats.update();
}

function render() {
  const ballPosition = (global as any).ballPosition;

  const p = (global as any).cloth.particles;
  for (let i = 0, il = p.length; i < il; i++) {
    clothGeometry.vertices[i].copy(p[i].position);
  }
  clothGeometry.verticesNeedUpdate = true;
  clothGeometry.computeFaceNormals();
  clothGeometry.computeVertexNormals();
  sphere.position.copy(ballPosition);
  renderer.render(scene, camera);
}
