import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { lerp, degToRad, radToDeg, calculate2DSpeed, vector2DToAngle, deriveXspeed, deriveZspeed, setMinAngle, setMaxAngle } from './math.js';
import { speedUp } from './utilities.js';


/*---- INITIALIZE ------------------------------------------------------------*/

// ----Base Colors----
const PURPLE = 0xff11ff;
const CYAN = 0x11ffff;
const YELLOW = 0xffff11;
const WHITE = 0xffffff;
const ORANGE = 0xff7722;

// ----Object Colors----
const WALL_COLOR = PURPLE;
const PADDLE_COLOR = CYAN;
const BALL_COLOR = WHITE;

// ----Arena----
const arenaLength = 25;
const arenaWidth = 15;
const wallHeight = 0.5;
const wallThickness = 0.2;
const floorThickness = 0.2;
const floorWidth = arenaWidth + floorThickness * 2;
const wallLightIntensity = 1;

// ----Other----
const maxAngleDegrees = 20;
let minAngle = setMinAngle(maxAngleDegrees);
let maxAngle = setMaxAngle(maxAngleDegrees);

// ----Paddles----
const paddleLightIntensity = 1;
// const paddleLength = arenaWidth;
const paddleLength = 4;
const paddleHeight = wallHeight;
const paddleThickness = 0.2;

// ----Boxes----

const leftWallBox = new THREE.Box3();
const rightWallBox = new THREE.Box3();

// ----Variables----
let paddleSpeed = 0.2;
let moveLeft1 = false;
let moveRight1 = false;
let moveLeft2 = false;
let moveRight2 = false;
let speed = 0.2;
let speedIncrement = 0.01;
let angle = 30;
let ballSpeedX = deriveXspeed(speed, angle);
let ballSpeedZ = deriveZspeed(speed, angle);

// ----Scene----
const scene = new THREE.Scene();

// -----Camera Setup----
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.lookAt(0, 0, 0);
camera.position.set(-22, 25, 23);
// camera.position.set(0, 35, 0);

// ----Renderer Setup----
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ----Orbit Control----
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
const wallMeshMaterial = new THREE.MeshStandardMaterial({color: WALL_COLOR, emissive: WALL_COLOR, wireframe: false});

const leftSideWall = new THREE.Mesh(sideWallGeometry, wallMeshMaterial);
leftSideWall.position.set(0, 0, -(arenaWidth / 2 + wallThickness / 2))
scene.add(leftSideWall);

const rightSideWall = new THREE.Mesh(sideWallGeometry, wallMeshMaterial);
rightSideWall.position.set(0, 0, (arenaWidth / 2 + wallThickness / 2))
scene.add(rightSideWall);

// ----Wall Lights----
RectAreaLightUniformsLib.init();
const wallLightLeft = new THREE.RectAreaLight(WALL_COLOR, wallLightIntensity, arenaLength, wallHeight);
wallLightLeft.position.copy(leftSideWall.position);
wallLightLeft.lookAt(0, 0, 0);
scene.add(wallLightLeft);

const wallLightRight = new THREE.RectAreaLight(WALL_COLOR, wallLightIntensity, arenaLength, wallHeight);
wallLightRight.position.copy(rightSideWall.position);
wallLightRight.lookAt(0, 0, 0);
scene.add(wallLightRight);

// ----Paddles----
const paddleGeometry = new THREE.BoxGeometry(paddleThickness, wallHeight, paddleLength);
const paddleMaterial = new THREE.MeshStandardMaterial({color: PADDLE_COLOR, emissive: PADDLE_COLOR, wireframe: false});
const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle1Box = new THREE.Box3();
paddle1.position.set(-(arenaLength / 2 - paddleThickness / 2), 0, 0);
scene.add(paddle1);

const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle2Box = new THREE.Box3();
paddle2.position.set((arenaLength / 2 - paddleThickness / 2), 0, 0);
scene.add(paddle2);


// ----Paddle Light----
const paddleLight1 = new THREE.RectAreaLight(PADDLE_COLOR, paddleLightIntensity, paddleLength, paddleHeight);
paddleLight1.position.copy(paddle1.position);
paddleLight1.lookAt(0, 0, 0);
scene.add(paddleLight1);

const paddleLight2 = new THREE.RectAreaLight(PADDLE_COLOR, paddleLightIntensity, paddleLength, paddleHeight);
paddleLight2.position.copy(paddle2.position);
paddleLight2.lookAt(0, 0, 0);
scene.add(paddleLight2);


// ----Ball----
const ballRadius = 0.2;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 16);
const ballMaterial = new THREE.MeshBasicMaterial({color: BALL_COLOR, wireframe: false});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
const ballBox = new THREE.Box3();
ball.position.set(0, 0, 0);
scene.add(ball);
const ballLight = new THREE.PointLight(BALL_COLOR, 1, 10, 0.5); // (color, intensity, distance, decay)
ballLight.position.copy(ball.position);
scene.add(ballLight);


/*---- LOOP ------------------------------------------------------------------*/

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

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);


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
    ballBox.setFromObject(ball);
    paddle1Box.setFromObject(paddle1);
    paddle2Box.setFromObject(paddle2);
    leftWallBox.setFromObject(leftSideWall);
    rightWallBox.setFromObject(rightSideWall);
    let newPosX = ball.position.x + ballSpeedX;
    let newPosZ = ball.position.z + ballSpeedZ;
    
    if (ballBox.intersectsBox(paddle1Box))
    {
        adjustAngle(paddle1);
        ballSpeedZ = -ballSpeedZ;
        ball.position.x += ballSpeedX;
        ball.position.z += ballSpeedZ;
    }
    else if (ballBox.intersectsBox(paddle2Box))
    {
        adjustAngle(paddle2)
        ballSpeedX = -ballSpeedX;
        ballSpeedZ = -ballSpeedZ;
        ball.position.x += ballSpeedX;
        ball.position.z += ballSpeedZ;
    }
    else if (ballBox.intersectsBox(leftWallBox) || ballBox.intersectsBox(rightWallBox))
    {
        ballSpeedZ = -ballSpeedZ;
        ball.position.x += ballSpeedX;
        ball.position.z += ballSpeedZ;
    }
    else
    {
        ball.position.x = newPosX;
        ball.position.z = newPosZ;
    }
    ballLight.position.copy(ball.position);
}

function adjustAngle(paddle)
{
    const incomingAngle = vector2DToAngle(ballSpeedX, ballSpeedZ);
    let impactPoint = ball.position.z - paddle.position.z;
    let normalizedImpact = impactPoint / (paddleLength / 2);
    angle = lerp(normalizedImpact, -1, 1, minAngle, maxAngle);
    speed = calculate2DSpeed(ballSpeedX, ballSpeedZ);
    speed = speedUp(speed, speedIncrement);
    ballSpeedX = deriveXspeed(speed, angle);
    ballSpeedZ = deriveZspeed(speed, angle);
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