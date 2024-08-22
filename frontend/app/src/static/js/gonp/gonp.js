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

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
window.addEventListener( 'resize', onWindowResize, false );

// update();


export class Game {
	constructor (time, powerups) {
		
		this.scene = new THREE.Scene();
		this.arena = new Arena(this.scene, powerups);
		this.player1 = new Player(this.scene, G.p1StartPos, 'BLU', COLOR.PLAYER1, this.arena);
		this.player2 = new Player(this.scene, G.p2StartPos, 'RED', COLOR.PLAYER2, this.arena);
		
		// ----Camera Setup----
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
		this.camera.lookAt(0, 0, 0);
		this.camera.position.set(0, 25, 20);
		
		// ----Renderer Setup----
		this.renderer = new THREE.WebGLRenderer( {antialias:true} );
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		
		document.body.appendChild(this.renderer.domElement);
		
		// ----Orbit Controls----
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.scene, this.camera));
		
		const effectFXAA = new ShaderPass(FXAAShader);
		effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
		this.composer.addPass(effectFXAA);
		
		this.text = new TextManager(this.scene, this.composer, this.renderer, this.camera, "./resources/font.json", "GONP", 0XFFFFFF, 0X000000);
		
		this.timer = new Timer();
		
		this.timer.start(time * 60);
		this.powerups = powerups;
		this.update = this.update.bind(this);
	}
		
	getHtml() {
		return (this.renderer.domElement);
	}

	update() {
		setTimeout(() => { requestAnimationFrame(this.update); }, 1000 / G.fps);
		playersLogic();
		pushersLogic();
		this.arena.checkPowerupSpawn();
		this.text.updateText(this.timer.toString());
		this.composer.render();
	}
}

	export let game = new Game(3, true);
	game.update();
