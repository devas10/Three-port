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

const geometry = new THREE.TorusGeometry(10, 1, 10, 100);

const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
});

//material.emissive.setHex(0x000000);
const cube = new THREE.Mesh(geometry, material);
mainScene.add(cube);

function addStar(scene1, x, y, z) {
  const color = THREE.MathUtils.randInt(0, 0xffffff)
  const material = new THREE.MeshBasicMaterial({
    color: color,
  });

  const starSize= THREE.MathUtils.randInt(4,15);
  const genericStar = new THREE.SphereGeometry(starSize, 25, 25);

  const star = new THREE.Mesh(genericStar, material);

  star.position.set(x, y, z);
  scene1.add(star);
}

const pointLight = new THREE.PointLight(0xffffff);
mainScene.add(pointLight);

camera.position.setZ(50);

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
  addStar(bloomGroup, point.x, point.y, point.z);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  composer.render();

  //bloomPass.radius += bloomPass.radius < 1? 0.008 : -0.5; 

  bloomPass.strength += bloomPass.strength < 1? 0.005 : -0.5;
  renderer.render(scene, camera);
}

animate();
