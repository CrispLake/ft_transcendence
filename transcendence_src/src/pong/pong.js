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
const ballBox = new THREE.Box3();
const paddle1Box = new THREE.Box3();
const paddle2Box = new THREE.Box3();
const leftWallBox = new THREE.Box3();
const rightWallBox = new THREE.Box3();


// ----Variables----
let paddleSpeed = 0.2;
let moveLeft1 = false;
let moveRight1 = false;
let moveLeft2 = false;
let moveRight2 = false;
let ballSpeedX = 0.1;
let ballSpeedZ = 0.1;


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
ballSphere.position.set(0, 0, 0);
scene.add(ballSphere);
const ballLight = new THREE.PointLight(CYAN, 1, 10, 0.5); // (color, intensity, distance, decay)
ballLight.position.copy(ballSphere.position);
scene.add(ballLight);


// ----Update and render----
function update()
{
    requestAnimationFrame(update);
    updatePaddlePosition();
    updateBallPosition();
    renderer.render(scene, camera);
}
update();


// ----Key Input----
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event)
{
    switch (event.key)
    {
        case 'ArrowLeft':
            moveLeft2 = true;
            break;
        case 'ArrowRight':
            moveRight2 = true;
            break;
        case 'a':
            moveLeft1 = true;
            break;
        case 'd':
            moveRight1 = true;
            break;
    }
}

function handleKeyUp(event)
{
    switch (event.key)
    {
        case 'ArrowLeft':
            moveLeft2 = false;
            break;
        case 'ArrowRight':
            moveRight2 = false;
            break;
        case 'a':
            moveLeft1 = false;
            break;
        case 'd':
            moveRight1 = false;
            break;
    }
}


// ----Update Paddle----
function updatePaddlePosition()
{
    if (moveLeft1)
    {
        paddle1.position.z -= paddleSpeed;
        if (paddle1.position.z < -(arenaWidth / 2) + paddleLength / 2)
            paddle1.position.z = -(arenaWidth / 2) + paddleLength / 2;
    }
    if (moveRight1)
    {
        paddle1.position.z += paddleSpeed;
        if (paddle1.position.z > (arenaWidth / 2) - paddleLength / 2)
            paddle1.position.z = (arenaWidth / 2) - paddleLength / 2;
    }
    paddleLight1.position.copy(paddle1.position);
    if (moveLeft2)
    {
        paddle2.position.z -= paddleSpeed;
        if (paddle2.position.z < -(arenaWidth / 2) + paddleLength / 2)
            paddle2.position.z = -(arenaWidth / 2) + paddleLength / 2;
    }
    if (moveRight2)
    {
        paddle2.position.z += paddleSpeed;
        if (paddle2.position.z > (arenaWidth / 2) - paddleLength / 2)
            paddle2.position.z = (arenaWidth / 2) - paddleLength / 2;
    }
    paddleLight2.position.copy(paddle2.position);
}


// ----Update Ball----
function updateBallPosition()
{
    ballBox.setFromObject(ballSphere);
    paddle1Box.setFromObject(paddle1);
    paddle2Box.setFromObject(paddle2);
    leftWallBox.setFromObject(leftSideWall);
    rightWallBox.setFromObject(rightSideWall);
    let newPosX = ballSphere.position.x + ballSpeedX;
    let newPosZ = ballSphere.position.z + ballSpeedZ;
    
    if (ballBox.intersectsBox(paddle1Box))
    {
        ballSpeedX = -ballSpeedX;
        newPosX = ballSphere.position.x + ballSpeedX;
        adjustAngle(paddle1);
    }
    else if (ballBox.intersectsBox(paddle2Box))
    {
        ballSpeedX = -ballSpeedX;
        newPosX = ballSphere.position.x + ballSpeedX;
    }

    if (ballBox.intersectsBox(leftWallBox) || ballBox.intersectsBox(rightWallBox))
    {
        ballSpeedZ = -ballSpeedZ;
        newPosZ = ballSphere.position.z + ballSpeedZ;
    }

    ballSphere.position.x = newPosX;
    ballSphere.position.z = newPosZ;
    ballLight.position.copy(ballSphere.position);
}

function calculateAngle()
{
    if ()
}


// ----Window resize----
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize( event )
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}