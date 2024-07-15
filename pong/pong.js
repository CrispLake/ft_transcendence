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


RectAreaLightUniformsLib.init();
const game = new Game();
const controls = new OrbitControls(game.gameCamera, game.renderer.domElement);


// ----Event Listeners----

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
        case KEY.P3_LEFT:
            game.players["p3"].moveLeft = true;
            break;
        case KEY.P3_RIGHT:
            game.players["p3"].moveRight = true;
            break;
        case KEY.P3_BOOST:
            game.players["p3"].boostPressed = true;
            break;
        case KEY.P4_LEFT:
            game.players["p4"].moveLeft = true;
            break;
        case KEY.P4_RIGHT:
            game.players["p4"].moveRight = true;
            break;
        case KEY.P4_BOOST:
            game.players["p4"].boostPressed = true;
            break;
        case "p":
            game.toggleCameraRotation();
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
            game.players["p1"].boostReleased = true;
            break;
        case KEY.P2_LEFT:
            game.players["p2"].moveLeft = false;
            break;
        case KEY.P2_RIGHT:
            game.players["p2"].moveRight = false;
            break;
        case KEY.P2_BOOST:
            game.players["p2"].boostPressed = false;
            game.players["p2"].boostReleased = true;
            break;
        case KEY.P3_LEFT:
            game.players["p3"].moveLeft = false;
            break;
        case KEY.P3_RIGHT:
            game.players["p3"].moveRight = false;
            break;
        case KEY.P3_BOOST:
            game.players["p3"].boostPressed = false;
            game.players["p3"].boostReleased = true;
            break;
        case KEY.P4_LEFT:
            game.players["p4"].moveLeft = false;
            break;
        case KEY.P4_RIGHT:
            game.players["p4"].moveRight = false;
            break;
        case KEY.P4_BOOST:
            game.players["p4"].boostPressed = false;
            game.players["p4"].boostReleased = true;
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
    game.gameCamera.aspect = width / height;
    game.gameCamera.updateProjectionMatrix();
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