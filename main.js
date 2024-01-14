import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { randFloatSpread } from "three/src/math/MathUtils";

const scene = new THREE.Scene();

const mainScene = new THREE.Group();
scene.add(mainScene);

const bloomGroup = new THREE.Group();
scene.add(bloomGroup);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function generateStars(stars, scene1) {

  for (let count = 0; count < stars; count++) {
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    addStar(scene,x, y, z);
  }
}

function addStar(scene1, x, y, z) {
  const color = THREE.MathUtils.randInt(0, 0xffffff);
  const material = new THREE.MeshBasicMaterial({
    color: color,
  });

  const starSize = THREE.MathUtils.randInt(4, 12);
  const genericStar = new THREE.SphereGeometry(starSize, 25, 25);

  const star = new THREE.Mesh(genericStar, material);

  star.position.set(x, y, z);
  scene1.add(star);
}

generateStars(50,scene);

const pointLight = new THREE.PointLight(0xffffff);
mainScene.add(pointLight);

camera.position.setZ(100);

const renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0.05;
bloomPass.strength = 0.5;
bloomPass.radius = 0.2;

const composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(bloomPass);

const controls = new OrbitControls(camera, renderer.domElement);

renderer.autoClear = false;
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

document.addEventListener("click", onMouseDown, false);

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var planeNormal = new THREE.Vector3();
var point = new THREE.Vector3();

function onMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, point);

  console.log(point);
  addStar(scene, point.x, point.y, point.z);
}


let strengthDir= true;
let radiusDir= true;

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  composer.render();

  const maxRadius = 1.2; 
  const minRadius = 0.2;
  const maxStrength =  0.8; 
  const minStrength =  0.2;


  const radiusStep = 0.015;
  const strengthStep = 0.008;

  if (bloomPass.strength > maxStrength && strengthDir == true)  strengthDir = false;
  if (bloomPass.strength < minStrength && strengthDir == false) strengthDir = true;

  bloomPass.strength += strengthDir? strengthStep : -strengthStep;

  if (bloomPass.radius > maxRadius && radiusDir == true)  radiusDir = false;
  if (bloomPass.radius < minRadius && radiusDir == false) radiusDir = true;

  bloomPass.radius += radiusDir? radiusStep : -radiusStep;
  console.log(bloomPass.radius);

  renderer.render(scene, camera);
}

animate();
