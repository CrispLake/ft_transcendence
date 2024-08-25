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
// import { onWindowResize, handleKeyUp, handleKeyDown } from './events.js'

/*---- INITIALIZE ------------------------------------------------------------*/


// document.addEventListener('keydown', handleKeyDown);
// document.addEventListener('keyup', handleKeyUp);
// window.addEventListener( 'resize', onWindowResize, false );

// update();


export class Game {
	constructor (params) {
		RectAreaLightUniformsLib.init();

		this.gameEnded = false;
		this.scene = new THREE.Scene();
		this.arena = new Arena(this.scene, params.settings.powerups);
		this.player1 = new Player(this.scene, G.p1StartPos, 'BLU', COLOR.PLAYER1, this.arena);
		this.player2 = new Player(this.scene, G.p2StartPos, 'RED', COLOR.PLAYER2, this.arena);
		this.playerList = params.players;
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
	
		this.text = new TextManager(this.scene, this.composer, this.renderer, this.camera, '/static/fonts/font.json', "GONP", 0XFFFFFF, 0X000000);
	
		this.timer = new Timer();
		this.timer.start(params.settings.difficulty * 60);
		this.players = params.players;
		this.powerups = params.settings.powerups;
		this.resolve = null;
		this.update = this.update.bind(this);
		this.update();
		this.endGame = this.endGame.bind(this);
	}
	
	getHtml() {
		return (this.renderer.domElement);
	}
	
	endGame()
	{
		let player1Score = 0;
		let player2Score = 0;
		let result = { 
			"player1" : this.players[0].username,
			"player2" : this.players[1].username,
			"player1Score" : 0,
			"player2Score" : 0
		};
		if (!this.resolve)
			return ;
		for (let i = 0; i < this.arena.lanes.length; i++) {
			player1Score += this.arena.lanes[i].getPlayer1Score()
			player2Score += this.arena.lanes[i].getPlayer2Score()
		}
		if (player1Score > player2Score) {
			player1Score = 1;
			player2Score = 0;
		}
		else {
			player1Score = 0;
			player2Score = 1;
		}
		result["player1Score"] = player1Score;
		result["player2Score"] = player2Score;
		this.results = result;
		this.resolve(result);
	}

	update() {
		if (!this.gameEnded) {
			setTimeout(() => { requestAnimationFrame(this.update); }, 1000 / G.fps);
		}
		this.playersLogic();
		this.pushersLogic();
		this.arena.checkPowerupSpawn();
		this.text.updateText(this.timer.toString());
		this.composer.render();
		if (this.timer.getRemainingTime() <= 0) {
			this.gameEnded = true;
			this.endGame();
		}
	}
	setPushersColliding(colliding)
	{
		for (let i = 0; i < this.player1.pushers.length; i++) {
			this.player1.pushers[i].colliding = colliding;
			// this.player1.pushers[i].collisionNumber = -1;
		}
		for (let i = 0; i < this.player2.pushers.length; i++) {
			this.player2.pushers[i].colliding = colliding;
			// this.player2.pushers[i].collisionNumber = -1;
		}
	}
	
	checkPowerupCollision() {
		let speedup;
		let balance = Math.random();
		let player;
		let players = [
			this.player1,
			this.player2
		];
		if (balance < 0.5) {
			players[0] = this.player2;
			players[1] = this.player1;
		}
		for (let i = 0; i < players.length; i++) {
			player = players[i];
			for (let j = 0; j < player.pushers.length; j++) {
				if (this.arena.powerup) {
					if (player.pushers[j].box.intersectsBox(this.arena.powerup.box)) {
						this.scene.remove(this.arena.powerup.mesh)
						this.arena.powerup.remove();
						this.arena.powerup = null;
						speedup = player.pushers[j].size > G.pusherMaxSize * 0.9;
						player.pushers[j].upSize(G.pusherMaxSize);
						if (speedup) {
							player.pushers[j].speed *= 2;
						}
					}
				}
			}
		}
	}
	
	checkPushersCollision() {
		let collisionNumber = 0;
	
		for (let i = 0; i < this.player1.pushers.length; i++) {
			const pusher1 = this.player1.pushers[i];
			const box1 = pusher1.box;
			pusher1.collisionNumber = -1;
	
			for (let j = 0; j < this.player2.pushers.length; j++) {
				const pusher2 = this.player2.pushers[j];
				const box2 = pusher2.box;
				pusher2.collisionNumber = -1;
	
				if (box1.intersectsBox(box2)) {
					const overlapX = Math.min(box1.max.x, box2.max.x) - Math.max(box1.min.x, box2.min.x);
					let mtv = new THREE.Vector3(overlapX, 0, 0);
					if (pusher1.colliding == false) {
						pusher1.moveX -= (-(mtv.x / 2 - 0.005));
					}
					if (pusher2.colliding == false) {
						pusher2.moveX(mtv.x / 2 - 0.005);
					}
					pusher1.downSize(G.pusherFightValue);
					pusher2.downSize(G.pusherFightValue);
					pusher1.colliding = true;
					pusher2.colliding = true;
					pusher1.updateBoundingBox();
					pusher2.updateBoundingBox();
					pusher1.collisionNumber = collisionNumber;
					pusher2.collisionNumber = collisionNumber;
					collisionNumber++;
					continue ;
				}
			}
		}
	}
	
	// function moveCollisionGroups() {
	// 	let velocity = [];
	// 	let mass = [];
	// 	let momentum = [];
	// 	let collisionNumber = -1;
	// 	let i;
	
	
	// 	for (i = 0; i < this.player1.pushers.length; i++) {
	// 		collisionNumber = this.player1.pushers[i].collisionNumber;
	// 		if (collisionNumber >= 0) {
	// 			if (velocity[collisionNumber] === undefined) {
	// 				velocity[collisionNumber] = 0;
	// 			}
	// 			velocity[collisionNumber] -= this.player1.pushers[i].speed;
	// 			if (mass[collisionNumber] === undefined) {
	// 				mass[collisionNumber] = 0;
	// 			}
	// 			mass[collisionNumber] -= this.player1.pushers[i].size;
	// 		}
	// 	}
	// 	for (i = 0; i < this.player2.pushers.length; i++) {
	// 		collisionNumber = this.player2.pushers[i].collisionNumber;
	// 		if (collisionNumber >= 0) {
	// 			if (velocity[collisionNumber] === undefined) {
	// 				velocity[collisionNumber] = 0;
	// 			}
	// 			velocity[collisionNumber] += this.player2.pushers[i].speed;
	// 			if (mass[collisionNumber] === undefined) {
	// 				mass[collisionNumber] = 0;
	// 			}
	// 			mass[collisionNumber] += this.player2.pushers[i].size;
	// 		}
	// 	}
	// 	for (i = 0; i < mass.length; i++) {
	// 		momentum[i] = velocity[i];
	// 	}
	// 	for (i = 0; i < velocity.length; i++) {
	// 		momentum[i] -= mass[i] * (momentum[i] > 0 ? 1 : -1);
	// 	}
	// 	for (i = 0; i < this.player1.pushers.length; i++) {
	// 		if (this.player1.pushers[i].collisionNumber >= 0) {
	// 			this.player1.pushers[i].moveX(momentum[this.player1.pushers[i].collisionNumber]);
	// 		}
	// 	}
	// 	for (i = 0; i < this.player2.pushers.length; i++) {
	// 		if (this.player2.pushers[i].collisionNumber >= 0) {
	// 			this.player2.pushers[i].moveX(momentum[this.player2.pushers[i].collisionNumber]);
	// 		}
	// 	}
	// 	// console.log(velocity, mass, momentum);
	// }
	
	pushersLogic() {
		this.setPushersColliding(false);
		this.checkPowerupCollision();
		this.checkPushersCollision();
		this.movePushers();
		// moveCollisionGroups();
	}
	
	movePushers() {
		let pusher;
	
		for (let i = 0; i < this.player1.pushers.length; i++) {
			pusher = this.player1.pushers[i];
			this.player1.movePusher(pusher);
			if (pusher.furtestX > G.laneEnd) {
				this.arena.lanes[pusher.lane].player1scored(pusher.size - (G.pusherMinSize / 2));
				this.player1.removePusher(pusher);
			}
			else if (pusher.furtestX < this.arena.getOpposingSectionPositionByPusher(pusher)) {
				this.arena.lanes[pusher.lane].player1scored(G.passiveScore);
				pusher.downSize(G.passiveScore);
			}
		}
		for (let i = 0; i < this.player2.pushers.length; i++) {
			pusher = this.player2.pushers[i];
			this.player2.movePusher(pusher)
			if (pusher.furtestX < -G.laneEnd) {
				this.arena.lanes[pusher.lane].player2scored(pusher.size - (G.pusherMinSize / 2));
				this.player2.removePusher(pusher);
			}
			else if (pusher.furtestX > this.arena.getOpposingSectionPositionByPusher(pusher)) {
				this.arena.lanes[pusher.lane].player2scored(G.passiveScore);
				pusher.downSize(G.passiveScore);
			}
		}
	}
	
	playersLogic() {
		this.player1.logicLoop();
		this.player2.logicLoop();
	}
	
	updatePlayerPosition() {
		this.player1.move();
		this.player2.move();
	
	}
	
	updateBoost() {
		if (this.player1.boostPressed) {
			this.player1.increaseBoost();
		}
		else {
			this.player1.resetBoost();
		}
		if (this.player2.boostPressed) {
			this.player2.increaseBoost();
		}
		else {
			this.player2.resetBoost();
		}
	}
	
}
