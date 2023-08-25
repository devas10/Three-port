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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg") });
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const geometry = new THREE.TorusGeometry(10, 1, 10, 100);

const material = new THREE.MeshStandardMaterial({
  color: 0xff0000
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function generateStars(num,stars, scene) {

  for(let count = 0 ; count<stars ; count++){
    const [x,y,z]= Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  
    const sphere = new THREE.SphereGeometry(0.5, 25, 25);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff
    });
    const star = new THREE.Mesh(sphere,material);
    star.position.set(x, y, z);
    scene.add(star);
  }
}


generateStars(100,250, scene);
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 10000)
//scene.add(ambientLight)

const lighthelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lighthelper, gridHelper)

camera.position.setZ(30);

const renderPass = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0;
bloomPass.strength = 1;
bloomPass.radius = 0;

// const outputPass = new OutputPass();
//const bloomer = new BloomEffect()

const composer = new EffectComposer( renderer );
composer.addPass( renderPass );
composer.addPass( bloomPass );
// composer.addPass( outputPass );

const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
  rotation()
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update()
  composer.render();
}
function rotation() {
  cube.rotation.x += 0.004;
  cube.rotation.y += 0.01;
}
animate();