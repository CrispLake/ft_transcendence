import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
// import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
// import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
// import * as PongMath from './math.js';
// import * as G from './globals.js';
// import * as COLOR from './colors.js';
// import { Text2D } from './objects/Text2D.js';
// import { UserInterface } from './objects/UserInterface.js';
import * as KEY from './keys.js';
import { Game } from './objects/Game.js';


/*---- INITIALIZE ------------------------------------------------------------*/

RectAreaLightUniformsLib.init();
const game = new Game();
const controls = new OrbitControls(game.camera, game.renderer.domElement);

// ----Orbit Controls----

// ----Font----
// let textMesh;
// let composer;
// const fontLoader = new FontLoader();
// fontLoader.load('./resources/font.json', function (font)
// {
//     const textGeometry = new TextGeometry( 'PONG', 
//     {
// 		font: font,
// 		size: 6,
//         height: 1,
// 		depth: 0.1,
// 		curveSegments: 12,
// 		bevelEnabled: true,
// 		bevelThickness: 0.5,
// 		bevelSize: 0.2,
// 		bevelOffset: 0,
// 		bevelSegments: 3
// 	});
//     const textMaterial = new THREE.MeshBasicMaterial({color: COLOR.PONG});
//     textMesh = new THREE.Mesh(textGeometry, textMaterial);
//     textGeometry.computeBoundingBox();
//     const boundingBox = textGeometry.boundingBox;
//     const textWidth = boundingBox.max.x - boundingBox.min.x;
//     textMesh.position.set(-textWidth / 2, 0, -10);
//     game.scene.add(textMesh);

//     composer = new EffectComposer(game.renderer);
//     composer.addPass(new RenderPass(game.scene, game.camera));

//     // Create the OutlinePass
//     const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), game.scene, game.camera, [textMesh]);
//     outlinePass.edgeStrength = 10; // Increase to make the edges glow more
//     outlinePass.edgeGlow = 1; // Increase to make the glow wider
//     outlinePass.visibleEdgeColor.set(COLOR.PONG_AURA); // Neon color
//     outlinePass.hiddenEdgeColor.set(COLOR.PONG_AURA); // Neon color
//     composer.addPass(outlinePass);

//     // Add FXAA for better smoothing of edges
//     const effectFXAA = new ShaderPass(FXAAShader);
//     effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
//     composer.addPass(effectFXAA);
// });


// const scene2D = new THREE.Scene();

// const camera2D = new THREE.OrthographicCamera(
//     window.innerWidth / -2, window.innerWidth / 2,
//     window.innerHeight / 2, window.innerHeight / -2,
//     0.1, 1000
// );
// camera2D.position.z = 4;

// const UI = new UserInterface(game.scene, fontLoader);

// UI.addTextObject(scene2D, 'p1', game.player1.name, new THREE.Vector3(-800, 500, 0), 40, COLOR.UI_NAMES);
// UI.addTextObject(scene2D, 'p2', game.player2.name, new THREE.Vector3(600, 500, 0), 40, COLOR.UI_NAMES);
// UI.addTextObject(scene2D, 'score', '0 - 0', new THREE.Vector3(-50, 500, 0), 50, COLOR.UI_SCORE);



// const lastBounce = {
// 	wallLeft: false,
// 	wallRight: false,
// 	paddle1: false,
// 	paddle2: false
// }

// function resetBounces(bounces)
// {
// 	bounces.wallLeft = false;
// 	bounces.wallRight = false;
// 	bounces.paddle1 = false;
// 	bounces.paddle2 = false;
// }

// function updateScore(player1Score, player2Score)
// {
//     UI.updateTextObject("score", player1Score + " - " + player2Score);
//     game.ball.reset();
//     game.player1.reset();
//     game.player2.reset();
//     resetBounces(lastBounce);
//     sleepMillis(1000);
// }

// function gameEnded(score1, score2)
// {
//     return (score1 >= G.winningScore || score2 >= G.winningScore);
// }

// function resetGame(player1, player2)
// {
//     player1.score = 0;
//     player2.score = 0;
//     updateScore(player1.score, player2.score);
// }


/*---- LOOP ------------------------------------------------------------------*/

// ----Update and render----
// function update()
// {
//     setTimeout(() => { requestAnimationFrame(update); }, 1000 / G.fps);
//     game.arena.update();
//     game.player1.update();
//     game.player2.update();
//     updateBallPosition();
//     if (composer)
//     {
//         composer.render();
//     }
//     else
//     {
//         game.renderer.render(game.scene, game.camera);
//     }
//     if (goal())
//     {
//         if (gameEnded(game.player1.score, game.player2.score))
//         {
//             let winner;
//             let loser;
//             if (game.player1.score >= G.winningScore)
//             {
//                 winner = game.player1.name;
//                 loser = game.player2.name;
//             }
//             else
//             {
//                 winner = game.player2.name;
//                 loser = game.player1.name;
//             }
//             // sendGameResults(winner, loser);
//             resetGame(game.player1, game.player2);
//         }
//         else
//         {
//             updateScore(game.player1.score, game.player2.score);
//         }
//     }
//     // Render the 2D scene
//     game.renderer.autoClear = false;
//     game.renderer.clearDepth();
//     game.renderer.render(scene2D, camera2D);
// }
// game.update();

// function sleepMillis(millis)
// {
//     var date = new Date();
//     var curDate = null;
//     do { curDate = new Date(); }
//     while(curDate-date < millis);
// }

// function goal()
// {
//     let goalOffSet = 1;
//     if (game.ball.mesh.position.x <= game.player1.paddle.position.x - goalOffSet)
//     {
//         // console.log("player2 scored");
//         game.player2.score++;
//         return (true);
//     }
//     else if (game.ball.mesh.position.x >= game.player2.paddle.position.x + goalOffSet)
//     {
//         // console.log("player1 scored");
//         game.player1.score++;
//         return (true);
//     }
//     return (false);
// }

// ----Update Ball----
// function updateBallPosition()
// {
//     game.ball.box.setFromObject(game.ball.mesh);
//     game.player1.box.setFromObject(game.player1.paddle);
//     game.player2.box.setFromObject(game.player2.paddle);
//     game.arena.leftWall.box.setFromObject(game.arena.leftWall.mesh);
//     game.arena.rightWall.box.setFromObject(game.arena.rightWall.mesh);
    
//     if (game.ball.box.intersectsBox(game.player1.box) && !lastBounce.paddle1)
//     {
//         game.player1.lightEffect();
//         adjustSpin(game.player1);
//         game.player1.resetBoost();
//         adjustAngle(game.player1.paddle);
//         game.ball.speedUp();
//         game.ball.speedZ = -game.ball.speedZ;
//         game.ball.updateAngle();
// 		resetBounces(lastBounce);
// 		lastBounce.paddle1 = true;
//     }
//     else if (game.ball.box.intersectsBox(game.player2.box) && !lastBounce.paddle2)
//     {
//         game.player2.lightEffect();
//         adjustSpin(game.player2);
//         game.player2.resetBoost();
//         adjustAngle(game.player2.paddle);
//         game.ball.speedUp();
//         game.ball.speedX = -game.ball.speedX;
//         game.ball.speedZ = -game.ball.speedZ;
//         game.ball.updateAngle();
// 		resetBounces(lastBounce);
// 		lastBounce.paddle2 = true;
//     }
//     else if (game.ball.box.intersectsBox(game.arena.leftWall.box) && !lastBounce.wallLeft)
//     {
//         game.arena.leftWall.lightEffect();
//         game.ball.reduceSpin();
//         game.ball.speedZ = -game.ball.speedZ;
//         game.ball.updateAngle();
// 		resetBounces(lastBounce);
// 		lastBounce.wallLeft = true;
//     }
//     else if (game.ball.box.intersectsBox(game.arena.rightWall.box) && !lastBounce.wallRight)
//     {
//         game.arena.rightWall.lightEffect();
//         game.ball.reduceSpin();
//         game.ball.speedZ = -game.ball.speedZ;
//         game.ball.updateAngle();
// 		resetBounces(lastBounce);
// 		lastBounce.wallRight = true;
//     }
//     game.ball.affectBySpin();
//     game.ball.move();
// }

// function adjustSpin(player)
// {
//     if (game.settings.spin == false) return ;

//     if (!player.moveLeft && !player.moveRight)
//         game.ball.reduceSpin();
//     else
//     {
//         let spinPower = ((player.moveLeft) ? 1 : -1) * player.sign * player.boostAmount;
//         spinPower = PongMath.lerp(spinPower, -G.maxBoost, G.maxBoost, -G.maxSpin, G.maxSpin);
//         game.ball.addSpin(spinPower);
//     }
// }

// function adjustAngle(paddle)
// {
//     const incomingAngle = PongMath.vector2DToAngle(game.ball.speedX, game.ball.speedZ);
//     let impactPoint = game.ball.mesh.position.z - paddle.position.z;
//     let normalizedImpact = impactPoint / (G.paddleLength / 2);
//     game.ball.angle = PongMath.lerp(normalizedImpact, -1, 1, G.minAngle, G.maxAngle);
// }


// ----Key Input----
function handleKeyDown(event)
{
    switch (event.key)
    {
        case KEY.P1_LEFT:
            game.players["p1"].moveLeft = true;
            break;
        case KEY.P1_RIGHT:
            game.players["p1"].moveRight = true;
            break;
        case KEY.P1_BOOST:
            game.players["p1"].boostPressed = true;
            break;
        case KEY.P2_LEFT:
            game.players["p2"].moveLeft = true;
            break;
        case KEY.P2_RIGHT:
            game.players["p2"].moveRight = true;
            break;
        case KEY.P2_BOOST:
            game.players["p2"].boostPressed = true;
            break;
    }
}

function handleKeyUp(event)
{
    switch (event.key)
    {
        case KEY.P1_LEFT:
            game.players["p1"].moveLeft = false;
            break;
        case KEY.P1_RIGHT:
            game.players["p1"].moveRight = false;
            break;
        case KEY.P1_BOOST:
            game.players["p1"].boostPressed = false;
            break;
        case KEY.P2_LEFT:
            game.players["p2"].moveLeft = false;
            break;
        case KEY.P2_RIGHT:
            game.players["p2"].moveRight = false;
            break;
        case KEY.P2_BOOST:
            game.players["p2"].boostPressed = false;
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);


// ----Window resize----
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize( event )
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    game.renderer.setSize(width, height);
    game.camera.aspect = width / height;
    game.camera.updateProjectionMatrix();
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