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
import * as G from './globals.js';
import { speedUp } from './utilities.js';
import * as COLOR from './colors.js';
import { Player } from './Player.js';
import { Ball } from './Ball.js';

/*---- INITIALIZE ------------------------------------------------------------*/

// ----Scene----
const scene = new THREE.Scene();

// ----Players----
let player1 = new Player(-(G.arenaLength / 2 - G.paddleThickness / 2), 0, 0, 'Emil');
scene.add(player1.paddle);
scene.add(player1.light);
let player2 = new Player((G.arenaLength / 2 - G.paddleThickness / 2), 0, 0, 'Jonathan');
scene.add(player2.paddle);
scene.add(player2.light);

// ----Ball----
let ball = new Ball(0, 0, 0);
scene.add(ball.mesh);
scene.add(ball.light);


// ----Boxes----
const leftWallBox = new THREE.Box3();
const rightWallBox = new THREE.Box3();

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
const floorGeometry = new THREE.BoxGeometry(G.arenaLength, G.floorThickness, G.floorWidth);
const floorMeshMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: COLOR.FLOOR, wireframe: false});
const floor = new THREE.Mesh(floorGeometry, floorMeshMaterial);
floor.position.set(0, -(G.wallHeight / 2 + G.floorThickness / 2), 0);
scene.add(floor);

// ----Walls----
const sideWallGeometry = new THREE.BoxGeometry(G.arenaLength, G.wallHeight, G.wallThickness);
const wallMeshMaterial = new THREE.MeshStandardMaterial({color: COLOR.WALL, emissive: COLOR.WALL, wireframe: false});

const leftSideWall = new THREE.Mesh(sideWallGeometry, wallMeshMaterial);
leftSideWall.position.set(0, 0, -(G.arenaWidth / 2 + G.wallThickness / 2))
scene.add(leftSideWall);

const rightSideWall = new THREE.Mesh(sideWallGeometry, wallMeshMaterial);
rightSideWall.position.set(0, 0, (G.arenaWidth / 2 + G.wallThickness / 2))
scene.add(rightSideWall);

// ----Wall Lights----
RectAreaLightUniformsLib.init();
const wallLightLeft = new THREE.RectAreaLight(COLOR.WALL, G.wallLightIntensity, G.arenaLength, G.wallHeight);
wallLightLeft.position.copy(leftSideWall.position);
wallLightLeft.lookAt(0, 0, 0);
scene.add(wallLightLeft);

const wallLightRight = new THREE.RectAreaLight(COLOR.WALL, G.wallLightIntensity, G.arenaLength, G.wallHeight);
wallLightRight.position.copy(rightSideWall.position);
wallLightRight.lookAt(0, 0, 0);
scene.add(wallLightRight);


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
    if (goal())
    {
        updateScore();
        let winners = ['player1'];
        let losers = ['player2'];

        sendGameResults(winners, losers);
    }
}
update();

function sleepMillis(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

function resetPaddles()
{
    player1.setPos(-(G.arenaLength / 2 - G.paddleThickness / 2), 0, 0);
    player2.setPos((G.arenaLength / 2 - G.paddleThickness / 2), 0, 0);
}

function resetBall()
{
    ball.setPos(0, 0, 0);
    ball.angle = G.initialStartingAngle;
    ball.setSpeed(G.initialBallSpeed);
    sleepMillis(1000);
}

function goal()
{
    let goalOffSet = 1;
    if (ball.mesh.position.x <= player1.paddle.position.x - goalOffSet)
    {
        console.log("player2 scored");
        G.scores.player1++;
        return (true);
    }
    else if (ball.mesh.position.x >= player2.paddle.position.x + goalOffSet)
    {
        console.log("player1 scored");
        G.scores.player2++;
        return (true);
    }
    return (false);
}

function updateScore()
{
    resetBall();
    resetPaddles();
}

// ----Key Input----
function handleKeyDown(event)
{
    switch (event.key)
    {
        case 'ArrowLeft':
            player2.moveLeft = true;
            break;
        case 'ArrowRight':
            player2.moveRight = true;
            break;
        case 'a':
            player1.moveLeft = true;
            break;
        case 'd':
            player1.moveRight = true;
            break;
    }
}

function handleKeyUp(event)
{
    switch (event.key)
    {
        case 'ArrowLeft':
            player2.moveLeft = false;
            break;
        case 'ArrowRight':
            player2.moveRight = false;
            break;
        case 'a':
            player1.moveLeft = false;
            break;
        case 'd':
            player1.moveRight = false;
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);


// ----Update Paddle----
function updatePaddlePosition()
{
    if (player1.moveLeft)
    {
        player1.move(-player1.speed);
        if (player1.paddle.position.z < -(G.arenaWidth / 2) + G.paddleLength / 2)
            player1.paddle.position.z = -(G.arenaWidth / 2) + G.paddleLength / 2;
    }
    if (player1.moveRight)
    {
        player1.move(player1.speed);
        if (player1.paddle.position.z > (G.arenaWidth / 2) - G.paddleLength / 2)
            player1.paddle.position.z = (G.arenaWidth / 2) - G.paddleLength / 2;
    }
    if (player2.moveLeft)
    {
        player2.move(-player2.speed);
        if (player2.paddle.position.z < -(G.arenaWidth / 2) + G.paddleLength / 2)
            player2.paddle.position.z = -(G.arenaWidth / 2) + G.paddleLength / 2;
    }
    if (player2.moveRight)
    {
        player2.move(player2.speed);
        if (player2.paddle.position.z > (G.arenaWidth / 2) - G.paddleLength / 2)
            player2.paddle.position.z = (G.arenaWidth / 2) - G.paddleLength / 2;
    }
}


const lastBounce = {
	wallLeft: false,
	wallRight: false,
	paddle1: false,
	paddle2: false
}

function resetBounces(bounces)
{
	bounces.wallLeft = false;
	bounces.wallRight = false;
	bounces.paddle1 = false;
	bounces.paddle2 = false;
}

// ----Update Ball----
function updateBallPosition()
{
    ball.box.setFromObject(ball.mesh);
    player1.box.setFromObject(player1.paddle);
    player2.box.setFromObject(player2.paddle);
    leftWallBox.setFromObject(leftSideWall);
    rightWallBox.setFromObject(rightSideWall);
    let newPosX = ball.mesh.position.x + ball.speedX;
    let newPosZ = ball.mesh.position.z + ball.speedZ;
    
    if (ball.box.intersectsBox(player1.box) && !lastBounce.paddle1)
    {
        adjustAngle(player1.paddle);
        ball.speedZ = -ball.speedZ;
        ball.mesh.position.x += ball.speedX;
        ball.mesh.position.z += ball.speedZ;
		resetBounces(lastBounce);
		lastBounce.paddle1 = true;
    }
    else if (ball.box.intersectsBox(player2.box) && !lastBounce.paddle2)
    {
        adjustAngle(player2.paddle)
        ball.speedX = -ball.speedX;
        ball.speedZ = -ball.speedZ;
        ball.mesh.position.x += ball.speedX;
        ball.mesh.position.z += ball.speedZ;
		resetBounces(lastBounce);
		lastBounce.paddle2 = true;
    }
    else if (ball.box.intersectsBox(leftWallBox) && !lastBounce.wallLeft)
    {
        ball.speedZ = -ball.speedZ;
        ball.mesh.position.x += ball.speedX;
        ball.mesh.position.z += ball.speedZ;
		resetBounces(lastBounce);
		lastBounce.wallLeft = true;
    }
    else if (ball.box.intersectsBox(rightWallBox) && !lastBounce.wallRight)
    {
        ball.speedZ = -ball.speedZ;
        ball.mesh.position.x += ball.speedX;
        ball.mesh.position.z += ball.speedZ;
		resetBounces(lastBounce);
		lastBounce.wallRight = true;
    }
    else
    {
        ball.mesh.position.x = newPosX;
        ball.mesh.position.z = newPosZ;
    }
    ball.light.position.copy(ball.mesh.position);
}

function adjustAngle(paddle)
{
    const incomingAngle = vector2DToAngle(ball.speedX, ball.speedZ);
    let impactPoint = ball.mesh.position.z - paddle.position.z;
    let normalizedImpact = impactPoint / (G.paddleLength / 2);
    ball.angle = lerp(normalizedImpact, -1, 1, G.minAngle, G.maxAngle);
    ball.speed = calculate2DSpeed(ball.speedX, ball.speedZ);
    ball.setSpeed(ball.speed + G.speedIncrement);
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


/*
    TODO: Send post request when game ends. Might need to add axios path to html file.
*/

import axios from 'axios';

function sendGameResults(winners, losers)
{
    const data = {
        winners: winners,
        losers: losers,
    };

    axios.post('localhost:8000/matches', data)
        .then(response => {
            console.log('Success:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}