import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';


// ----Consts----
const PURPLE = 0xff11ff;
const CYAN = 0x11ffff;
const arenaLength = 25;
const arenaWidth = 15;
const wallHeight = 0.5;
const wallThickness = 0.2;
const floorThickness = 0.2;
const floorWidth = arenaWidth + floorThickness * 2;
const wallLightIntensity = 1;
const paddleLightIntensity = 1;


// ----Scene----
const scene = new THREE.Scene();


// -----Camera Setup----
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.lookAt(0, 0, 0);
camera.position.set(-22, 15, 25);


// ----Renderer Setup----
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// ----Add Orbit Control----
const controls = new OrbitControls(camera, renderer.domElement);


// ----Light----
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);


// ----Floor----
const floorGeometry = new THREE.BoxGeometry(arenaLength, floorThickness, floorWidth);
const floorMeshMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, wireframe: false});
const floor = new THREE.Mesh(floorGeometry, floorMeshMaterial);
floor.position.set(0, -(wallHeight / 2 + floorThickness / 2), 0);
scene.add(floor);


// ----Walls----
const sideWallGeometry = new THREE.BoxGeometry(arenaLength, wallHeight, wallThickness);
const wallMeshMaterial = new THREE.MeshStandardMaterial({color: PURPLE, emissive: PURPLE, wireframe: false});

const leftSideWall = new THREE.Mesh(sideWallGeometry, wallMeshMaterial);
leftSideWall.position.set(0, 0, -(arenaWidth / 2 + wallThickness / 2))
scene.add(leftSideWall);

const rightSideWall = new THREE.Mesh(sideWallGeometry, wallMeshMaterial);
rightSideWall.position.set(0, 0, (arenaWidth / 2 + wallThickness / 2))
scene.add(rightSideWall);


// ----Wall Lights----
RectAreaLightUniformsLib.init();
const wallLightLeft = new THREE.RectAreaLight(PURPLE, wallLightIntensity, arenaLength, wallHeight);
wallLightLeft.position.copy(leftSideWall.position);
wallLightLeft.lookAt(0, 0, 0);
scene.add(wallLightLeft);

const wallLightRight = new THREE.RectAreaLight(PURPLE, wallLightIntensity, arenaLength, wallHeight);
wallLightRight.position.copy(rightSideWall.position);
wallLightRight.lookAt(0, 0, 0);
scene.add(wallLightRight);


// ----Paddles----
const paddleLength = 2;
const paddleHeight = wallHeight;
const paddleThickness = 0.2;
const paddleGeometry = new THREE.BoxGeometry(paddleThickness, wallHeight, paddleLength);
const paddleMaterial = new THREE.MeshStandardMaterial({color: CYAN, emissive: CYAN, wireframe: false});

const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddle1.position.set(-(arenaLength / 2 - paddleThickness / 2), 0, 0);
scene.add(paddle1);

const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
paddle2.position.set((arenaLength / 2 - paddleThickness / 2), 0, 0);
scene.add(paddle2);


// ----Paddle Light----
const paddleLight1 = new THREE.RectAreaLight(CYAN, paddleLightIntensity, paddleLength, paddleHeight);
paddleLight1.position.copy(paddle1.position);
paddleLight1.lookAt(0, 0, 0);
scene.add(paddleLight1);

const paddleLight2 = new THREE.RectAreaLight(CYAN, paddleLightIntensity, paddleLength, paddleHeight);
paddleLight2.position.copy(paddle2.position);
paddleLight2.lookAt(0, 0, 0);
scene.add(paddleLight2);


// ----Ball----
const ballRadius = 0.2;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 16);
const ballMaterial = new THREE.MeshBasicMaterial({color: CYAN, wireframe: false});
const ballSphere = new THREE.Mesh(ballGeometry, ballMaterial);
ballSphere.position.set(-2, 0, -3);
scene.add(ballSphere);
const ballLight = new THREE.PointLight(CYAN, 1, 10, 0.5); // (color, intensity, distance, decay)
ballLight.position.copy(ballSphere.position);
scene.add(ballLight);


// ----Update and render----
function update()
{
    requestAnimationFrame(update);
    var time = Date.now() * 0.0005;
    ballSphere.position.x = Math.sin(time) * 2;
    ballSphere.position.z = Math.cos(time) * 2;
    ballLight.position.copy(ballSphere.position);
    renderer.render(scene, camera);
}
update();


//----Window resize----
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize( event )
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}