import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import * as G from './globals.js';
import * as COLOR from './colors.js';
import { Player } from './objects/Player.js';
import { Arena } from './objects/Arena.js';

import { TextManager } from './objects/TextManager.js'
import { Timer } from './objects/Timer.js'

import { playersLogic, pushersLogic } from './logicFunctions.js'
import { onWindowResize, handleKeyUp, handleKeyDown } from './events.js'

/*---- INITIALIZE ------------------------------------------------------------*/

RectAreaLightUniformsLib.init();
export const scene = new THREE.Scene();
export const arena = new Arena(scene);
export let player1 = new Player(scene, G.p1StartPos, 'BLU', COLOR.PLAYER1, arena);
export let player2 = new Player(scene, G.p2StartPos, 'RED', COLOR.PLAYER2, arena);

// ----Camera Setup----
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.lookAt(0, 0, 0);
camera.position.set(0, 25, 20);

// ----Renderer Setup----
export const renderer = new THREE.WebGLRenderer( {antialias:true} );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ----Orbit Controls----
const controls = new OrbitControls(camera, renderer.domElement);

let composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
composer.addPass(effectFXAA);

let text = new TextManager(scene, composer, renderer, camera, "./resources/font.json", "GONP", 0XFFFFFF, 0X000000);

let timer = new Timer();

timer.start(G.time * 60);

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
window.addEventListener( 'resize', onWindowResize, false );

update();

function update() {
	setTimeout(() => { requestAnimationFrame(update); }, 1000 / G.fps);
	playersLogic();
	pushersLogic();
	arena.checkPowerupSpawn();
	text.updateText(timer.toString());
	composer.render();
}
