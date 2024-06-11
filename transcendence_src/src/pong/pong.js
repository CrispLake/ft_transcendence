import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { lerp, degToRad, radToDeg, calculate2DSpeed, vector2DToAngle, deriveXspeed, deriveZspeed, setMinAngle, setMaxAngle } from './math.js';
import { speedUp } from './utilities.js';
import * as COLOR from './colors.js'


/*---- INITIALIZE ------------------------------------------------------------*/

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


// ----Font----
let textMesh;
let composer;
const fontLoader = new FontLoader();
fontLoader.load('./resources/font.json', function (font)
{
    const textGeometry = new TextGeometry( 'PONG', 
    {
		font: font,
		size: 6,
        height: 1,
		depth: 0.1,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.5,
		bevelSize: 0.2,
		bevelOffset: 0,
		bevelSegments: 3
	});
    const textMaterial = new THREE.MeshBasicMaterial({color: COLOR.PONG});
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.computeBoundingBox();
    const boundingBox = textGeometry.boundingBox;
    const textWidth = boundingBox.max.x - boundingBox.min.x;
    textMesh.position.set(-textWidth / 2, 0, -10);
    scene.add(textMesh);

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    // Create the OutlinePass
    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera, [textMesh]);
    outlinePass.edgeStrength = 10; // Increase to make the edges glow more
    outlinePass.edgeGlow = 1; // Increase to make the glow wider
    outlinePass.visibleEdgeColor.set(COLOR.PONG_AURA); // Neon color
    outlinePass.hiddenEdgeColor.set(COLOR.PONG_AURA); // Neon color
    composer.addPass(outlinePass);

    // Add FXAA for better smoothing of edges
    const effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    composer.addPass(effectFXAA);
});


// ----Scene----
const scene = new THREE.Scene();

// -----Camera Setup----
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.lookAt(0, 0, 0);
camera.position.set(-22, 25, 23);

// ----Renderer Setup----
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ----Orbit Control----
const controls = new OrbitControls(camera, renderer.domElement);

// ----Back Wall----
const backWallGeometry = new THREE.BoxGeometry(25, 15, 2);
const backWallMeshMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: COLOR.BACKWALL});
const backWall = new THREE.Mesh(backWallGeometry, backWallMeshMaterial);
backWall.position.set(0, 0, -10.5);
scene.add(backWall);

// ----Light----
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

// ----Floor----
const floorGeometry = new THREE.BoxGeometry(arenaLength, floorThickness, floorWidth);
const floorMeshMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: COLOR.FLOOR, wireframe: false});
const floor = new THREE.Mesh(floorGeometry, floorMeshMaterial);
floor.position.set(0, -(wallHeight / 2 + floorThickness / 2), 0);
scene.add(floor);

// ----Walls----
const sideWallGeometry = new THREE.BoxGeometry(arenaLength, wallHeight, wallThickness);
const wallMeshMaterial = new THREE.MeshStandardMaterial({color: COLOR.WALL, emissive: COLOR.WALL, wireframe: false});

const leftSideWall = new THREE.Mesh(sideWallGeometry, wallMeshMaterial);
leftSideWall.position.set(0, 0, -(arenaWidth / 2 + wallThickness / 2))
scene.add(leftSideWall);

const rightSideWall = new THREE.Mesh(sideWallGeometry, wallMeshMaterial);
rightSideWall.position.set(0, 0, (arenaWidth / 2 + wallThickness / 2))
scene.add(rightSideWall);

// ----Wall Lights----
RectAreaLightUniformsLib.init();
const wallLightLeft = new THREE.RectAreaLight(COLOR.WALL, wallLightIntensity, arenaLength, wallHeight);
wallLightLeft.position.copy(leftSideWall.position);
wallLightLeft.lookAt(0, 0, 0);
scene.add(wallLightLeft);

const wallLightRight = new THREE.RectAreaLight(COLOR.WALL, wallLightIntensity, arenaLength, wallHeight);
wallLightRight.position.copy(rightSideWall.position);
wallLightRight.lookAt(0, 0, 0);
scene.add(wallLightRight);

// ----Paddles----
const paddleGeometry = new THREE.BoxGeometry(paddleThickness, wallHeight, paddleLength);
const paddleMaterial = new THREE.MeshStandardMaterial({color: COLOR.PADDLE, emissive: COLOR.PADDLE, wireframe: false});
const paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle1Box = new THREE.Box3();
paddle1.position.set(-(arenaLength / 2 - paddleThickness / 2), 0, 0);
scene.add(paddle1);

const paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
const paddle2Box = new THREE.Box3();
paddle2.position.set((arenaLength / 2 - paddleThickness / 2), 0, 0);
scene.add(paddle2);


// ----Paddle Light----
const paddleLight1 = new THREE.RectAreaLight(COLOR.PADDLE, paddleLightIntensity, paddleLength, paddleHeight);
paddleLight1.position.copy(paddle1.position);
paddleLight1.lookAt(0, 0, 0);
scene.add(paddleLight1);

const paddleLight2 = new THREE.RectAreaLight(COLOR.PADDLE, paddleLightIntensity, paddleLength, paddleHeight);
paddleLight2.position.copy(paddle2.position);
paddleLight2.lookAt(0, 0, 0);
scene.add(paddleLight2);


// ----Ball----
const ballRadius = 0.2;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 16);
const ballMaterial = new THREE.MeshBasicMaterial({color: COLOR.BALL, wireframe: false});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
const ballBox = new THREE.Box3();
ball.position.set(0, 0, 0);
scene.add(ball);
const ballLight = new THREE.PointLight(COLOR.BALL, 1, 10, 0.5); // (color, intensity, distance, decay)
ballLight.position.copy(ball.position);
scene.add(ballLight);


/*---- LOOP ------------------------------------------------------------------*/

// ----Update and render----
function update()
{
    requestAnimationFrame(update);
    updatePaddlePosition();
    updateBallPosition();
    if (composer)
    {
        composer.render();
    }
    else
    {
        renderer.render(scene, camera);
    }
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