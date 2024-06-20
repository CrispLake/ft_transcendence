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
import * as PongMath from './math.js';
import * as G from './globals.js';
import { speedUp } from './utilities.js';
import * as COLOR from './colors.js';
import { Player } from './objects/Player.js';
import { Ball } from './objects/Ball.js';
import { Arena } from './objects/Arena.js';
import { Text } from './objects/Text.js';
import { UserInterface } from './objects/UserInterface.js';
import * as KEY from './keys.js';
import * as SETTINGS from './gameSetting.js';


/*---- INITIALIZE ------------------------------------------------------------*/

RectAreaLightUniformsLib.init();
const scene = new THREE.Scene();
const arena = new Arena(scene);
let player1 = new Player(scene, G.p1StartPos, 'Jesse');
let player2 = new Player(scene, G.p2StartPos, 'James');
let ball = new Ball(scene, G.ballStartPos);

// -----Camera Setup----
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.lookAt(0, 0, 0);
camera.position.set(-22, 25, 23);

// ----Renderer Setup----
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ----Orbit Controls----
const controls = new OrbitControls(camera, renderer.domElement);

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


const scene2D = new THREE.Scene();

const camera2D = new THREE.OrthographicCamera(
    window.innerWidth / -2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / -2,
    0.1, 1000
);
camera2D.position.z = 4;

const UI = new UserInterface(scene, fontLoader);

UI.addTextObject(scene2D, 'p1', player1.name, new THREE.Vector3(-800, 500, 0), 40, COLOR.UI_NAMES);
UI.addTextObject(scene2D, 'p2', player2.name, new THREE.Vector3(600, 500, 0), 40, COLOR.UI_NAMES);
UI.addTextObject(scene2D, 'score', '0 - 0', new THREE.Vector3(-50, 500, 0), 50, COLOR.UI_SCORE);

const clock = new THREE.Clock();




function updateScore(player1Score, player2Score)
{
    UI.updateTextObject("score", player1Score + " - " + player2Score);
    ball.reset();
    player1.reset();
    player2.reset();
    resetBounces(lastBounce);
    sleepMillis(1000);
}

function gameEnded(score1, score2)
{
    return (score1 >= G.winningScore || score2 >= G.winningScore);
}

function resetGame(player1, player2)
{
    player1.score = 0;
    player2.score = 0;
    updateScore(player1.score, player2.score);
}


/*---- LOOP ------------------------------------------------------------------*/

// ----Update and render----
function update()
{
    setTimeout(() => { requestAnimationFrame(update); }, 1000 / G.fps);
    // const elapsedTime = clock.getElapsedTime();
    // material.uniforms.time.value = elapsedTime;
    arena.update();
    updateBoost();
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
        if (gameEnded(player1.score, player2.score))
        {
            let winner;
            let loser;
            if (player1.score >= G.winningScore)
            {
                winner = player1.name;
                loser = player2.name;
            }
            else
            {
                winner = player2.name;
                loser = player1.name;
            }
            // sendGameResults(winner, loser);
            resetGame(player1, player2);
        }
        else
        {
            updateScore(player1.score, player2.score);
        }
    }
    // Render the 2D scene
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(scene2D, camera2D);
}
update();

function sleepMillis(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

function goal()
{
    let goalOffSet = 1;
    if (ball.mesh.position.x <= player1.paddle.position.x - goalOffSet)
    {
        // console.log("player2 scored");
        player2.score++;
        return (true);
    }
    else if (ball.mesh.position.x >= player2.paddle.position.x + goalOffSet)
    {
        // console.log("player1 scored");
        player1.score++;
        return (true);
    }
    return (false);
}

// ----Key Input----
function handleKeyDown(event)
{
    switch (event.key)
    {
        case KEY.P1_LEFT:
            player1.moveLeft = true;
            break;
        case KEY.P1_RIGHT:
            player1.moveRight = true;
            break;
        case KEY.P1_BOOST:
            player1.boostPressed = true;
            break;
        case KEY.P2_LEFT:
            player2.moveLeft = true;
            break;
        case KEY.P2_RIGHT:
            player2.moveRight = true;
            break;
        case KEY.P2_BOOST:
            player2.boostPressed = true;
            break;
    }
}

function handleKeyUp(event)
{
    switch (event.key)
    {
        case KEY.P1_LEFT:
            player1.moveLeft = false;
            break;
        case KEY.P1_RIGHT:
            player1.moveRight = false;
            break;
        case KEY.P1_BOOST:
            player1.boostPressed = false;
            break;
        case KEY.P2_LEFT:
            player2.moveLeft = false;
            break;
        case KEY.P2_RIGHT:
            player2.moveRight = false;
            break;
        case KEY.P2_BOOST:
            player2.boostPressed = false;
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

console.log("PURPLE.red = " + COLOR.WALL.r);
console.log("WHITE.red  = " + COLOR.WALL_LIGHT.r);

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

function updateBoost()
{
    if (SETTINGS.spin == false)
        return ;
    if (player1.boostPressed)
        player1.increaseBoost();
    else
        player1.resetBoost();

    if (player2.boostPressed)
        player2.increaseBoost();
    else
        player2.resetBoost();
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
    arena.leftWall.box.setFromObject(arena.leftWall.mesh);
    arena.rightWall.box.setFromObject(arena.rightWall.mesh);
    
    if (ball.box.intersectsBox(player1.box) && !lastBounce.paddle1)
    {
        adjustSpin(player1);
        player1.resetBoost();
        adjustAngle(player1.paddle);
        ball.speedUp();
        ball.speedZ = -ball.speedZ;
        ball.updateAngle();
		resetBounces(lastBounce);
		lastBounce.paddle1 = true;
    }
    else if (ball.box.intersectsBox(player2.box) && !lastBounce.paddle2)
    {
        adjustSpin(player2);
        player2.resetBoost();
        adjustAngle(player2.paddle);
        ball.speedUp();
        ball.speedX = -ball.speedX;
        ball.speedZ = -ball.speedZ;
        ball.updateAngle();
		resetBounces(lastBounce);
		lastBounce.paddle2 = true;
    }
    else if (ball.box.intersectsBox(arena.leftWall.box) && !lastBounce.wallLeft)
    {
        arena.leftWall.lightEffect();
        ball.reduceSpin();
        ball.speedZ = -ball.speedZ;
        ball.updateAngle();
		resetBounces(lastBounce);
		lastBounce.wallLeft = true;
    }
    else if (ball.box.intersectsBox(arena.rightWall.box) && !lastBounce.wallRight)
    {
        arena.rightWall.lightEffect();
        ball.reduceSpin();
        ball.speedZ = -ball.speedZ;
        ball.updateAngle();
		resetBounces(lastBounce);
		lastBounce.wallRight = true;
    }
    ball.affectBySpin();
    ball.move();
}

function adjustSpin(player)
{
    if (SETTINGS.spin == false) return ;

    if (!player.moveLeft && !player.moveRight)
        ball.reduceSpin();
    else
    {
        let spinPower = ((player.moveLeft) ? 1 : -1) * player.sign * player.boostAmount;
        spinPower = PongMath.lerp(spinPower, -G.maxBoost, G.maxBoost, -G.maxSpin, G.maxSpin);
        ball.addSpin(spinPower);
    }
}

function adjustAngle(paddle)
{
    const incomingAngle = PongMath.vector2DToAngle(ball.speedX, ball.speedZ);
    let impactPoint = ball.mesh.position.z - paddle.position.z;
    let normalizedImpact = impactPoint / (G.paddleLength / 2);
    ball.angle = PongMath.lerp(normalizedImpact, -1, 1, G.minAngle, G.maxAngle);
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

// import axios from 'axios';

// function sendGameResults(winners, losers)
// {
//     const data = {
//         winners: winners,
//         losers: losers,
//     };

//     axios.post('localhost:8000/matches', data)
//         .then(response => {
//             console.log('Success:', response.data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// }