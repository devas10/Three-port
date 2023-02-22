import './style.css'

import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({canvas:document.querySelector("#bg") });
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



const geometry = new THREE.TorusGeometry( 10, 1, 10,100 );

const material = new THREE.MeshStandardMaterial( { 
  color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5)
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff,10000)
scene.add(pointLight)

const lighthelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lighthelper,gridHelper)

camera.position.setZ(30)

const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
  rotation()
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  controls.update()
}
function rotation(){
  cube.rotation.x += 0.004;
  cube.rotation.y += 0.01;
}
animate();