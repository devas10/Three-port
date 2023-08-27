import './style.css'

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { UnrealBloomPass, BloomEffect } from 'three/addons/postprocessing/*';
// import { OutputPass } from 'three/addons/postprocessing/';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const scene = new THREE.Scene();

const mainScene = new THREE.Group();
scene.add(mainScene);

const bloomGroup = new THREE.Group();
scene.add(bloomGroup);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg") });
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.TorusGeometry(10, 1, 10, 100);

const material = new THREE.MeshStandardMaterial({
  color: 0xff0000
});
material.emissive.setHex(0x000000);
const cube = new THREE.Mesh(geometry, material);
mainScene.add(cube);



function generateStars(stars, scene1) {

  for (let count = 0; count < stars; count++) {
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    const sphere = new THREE.SphereGeometry(0.5, 25, 25);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    const star = new THREE.Mesh(sphere, material);
    star.position.set(x, y, z);
    scene1.add(star);
  }
}


// const sphere = new THREE.SphereGeometry(0.5, 25, 25);
// const material1 = new THREE.MeshBasicMaterial({
//   color: 0xffffff
// });
// const star = new THREE.Mesh(sphere, material1);
// bloomGroup.add(star);

generateStars(250, bloomGroup);
const pointLight = new THREE.PointLight(0xffffff);
//pointLight.position.set(5, 5, 5)
mainScene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
//bloomGroup.add(ambientLight);

const lighthelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
//mainScene.add(lighthelper, gridHelper)

camera.position.setZ(30);

const renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.4;
bloomPass.strength = 2;
bloomPass.radius = 1;

// const outputPass = new OutputPass();
//const bloomer = new BloomEffect()

const composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(bloomPass);
// composer.addPass( outputPass );

const controls = new OrbitControls(camera, renderer.domElement);

renderer.autoClear = false;

// bloomScene.renderOrder(0,true);
// scene.renderOrder(0,true);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

let mouse = {
	x: 0,
	y: 0
};
function onMouseMove(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  const z = event.clientz;

	let vector = new THREE.Vector3(mouse.x, mouse.y, z);
	vector.unproject(camera);
	let dir = vector.sub(camera.position).normalize();
	let distance = -camera.position.z / dir.z;
	let pos = camera.position.clone().add(dir.multiplyScalar(distance));
	pointLight.position.copy(pos);

 // star.position.copy(pos);
};
document.addEventListener('mousemove', onMouseMove, false);

function animate() {



  rotation()
  requestAnimationFrame(animate);

  controls.update();
  composer.render();

  renderer.render(scene, camera);

}
function rotation() {
  cube.rotation.x += 0.004;
  cube.rotation.y += 0.01;
}
animate();
