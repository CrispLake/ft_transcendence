import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { Settings } from './Settings.js';
import { UserInterface } from './UserInterface.js';
import { Arena } from './Arena.js';
import { Arena4Player } from './Arena4Player.js';
import { Player } from './Player.js';
import { AI } from './AI.js';
import { Ball } from './Ball.js';
import * as PongMath from '../math.js';

export class Game
{
	constructor()
	{
		console.log("Creating Game Object...");
		this.settings = new Settings();
		this.scene = new THREE.Scene();
		this.players = [];
		this.createPlayers();
		this.ball = new Ball(this.scene, G.ballStartPos, this.settings.spin);
		this.fontLoader = new FontLoader();
		this.ui = new UserInterface(this.scene, this.fontLoader);
		this.initializeUI();
		this.camera = this.createCamera();
		this.renderer = this.createRenderer();
		this.composer = new EffectComposer(this.renderer);
		this.createArena();
		this.update = this.update.bind(this);
		this.cameraRotate = false;
		console.log("Game Object Created!");

		this.update();
	}

	// ----Initialization Functions----

	initializeUI()
	{
		this.scene2D = new THREE.Scene();
		this.camera2D = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0.1, 1000);
		this.camera2D.position.z = 4;
		this.ui = new UserInterface(this.scene2D, this.fontLoader);
		this.ui.addTextObject(this.scene2D, 'p1', this.players["p1"].name, new THREE.Vector3(-800, 500, 0), 40, COLOR.UI_NAMES);
		this.ui.addTextObject(this.scene2D, 'p2', this.players["p2"].name, new THREE.Vector3(600, 500, 0), 40, COLOR.UI_NAMES);
		this.ui.addTextObject(this.scene2D, 'score', '0 - 0', new THREE.Vector3(-50, 500, 0), 50, COLOR.UI_SCORE);
	}

	createCamera()
	{
		const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
		camera.position.set(-22, 25, 23);
		camera.lookAt(0, 0, 0);
		return (camera);
	}

	createRenderer()
	{
		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		return (renderer);
	}

	createArena()
	{
		if (this.settings.multiMode == false)
			this.arena = new Arena(
				this.scene,
				this.fontLoader,
				this.renderer,
				this.composer,
				this.camera);
		else
			this.arena = new Arena4Player(
				this.scene,
				this.fontLoader,
				this.renderer,
				this.composer,
				this.camera);
	}

	createPlayers()
	{
		if (this.settings.multiMode == false)
		{
			this.players["p1"] = new Player(this.scene, this.settings, 1, "Player1");
			if (this.settings.players == 2)
				this.players["p2"] = new Player(this.scene, this.settings, 2, "Player2");
			else
				this.players["p2"] = new AI(this, 2, "AI");
		}
		else
		{
			if (this.settings.players > 3)
				this.players["p4"] = new Player(this.scene, this.settings, 4, "Player4");
			else
				this.players["p4"] = new AI(this, 4, "AI4");
			if (this.settings.players > 2)
				this.players["p3"] = new Player(this.scene, this.settings, 3, "Player3");
			else
				this.players["p3"] = new AI(this, 3, "AI3");
			if (this.settings.players > 2)
				this.players["p2"] = new Player(this.scene, this.settings, 2, "Player2");
			else
				this.players["p2"] = new AI(this, 2, "AI2");
			this.players["p1"] = new Player(this.scene, this.settings, 1, "Player1");

			this.rotatePlayers();
		}
	}

	rotatePlayers()
	{
		this.players["p3"].paddle.rotation.y = Math.PI / 2;
		this.players["p4"].paddle.rotation.y = Math.PI / 2;
		this.players["p3"].light.lookAt(0, 0, 0);
		this.players["p4"].light.lookAt(0, 0, 0);
	}

	// ----Game Functions----

	rotateCamera()
	{
		let x = this.camera.position.x;
		let z = this.camera.position.z;
		let radius = Math.sqrt(x * x + z * z);
		let angle = PongMath.vector2DToAngle(x, z);

		angle += (Math.PI * 2) / (G.cameraOrbitTimeSec * G.fps);
		angle = PongMath.within2Pi(angle);

		this.camera.position.x = radius * Math.sin(angle);
		this.camera.position.z = radius * Math.cos(angle);
		this.camera.lookAt(0, 0, 0);
	}

	updateCamera()
	{
		if (this.cameraRotate)
		{
			this.rotateCamera();
		}
	}

	toggleCameraRotation()
	{
		this.cameraRotate = !this.cameraRotate;
	}

	update()
	{
		setTimeout(() => { requestAnimationFrame(this.update); }, 1000 / G.fps);
		this.updateCamera();
		this.players["p1"].update();
		this.players["p2"].update();
		if (this.settings.multiMode == true)
		{
			this.players["p3"].update();
			this.players["p4"].update();
		}
		this.updateBallPosition();
		this.arena.update();
		if (this.goal())
			{
				if (this.gameEnded())
					this.resetGame();
				else
				this.updateScore();
		}
		this.composer.render();
		this.renderer.autoClear = false;
    	this.renderer.clearDepth();
		this.renderer.render(this.scene2D, this.camera2D);
	}

	updateBallPosition()
	{
		// Set hitboxes
		this.ball.box.setFromObject(this.ball.mesh);
		for (let player in this.players)
			this.players[player].box.setFromObject(this.players[player].paddle);
		for (let wall in this.arena.walls)
			this.arena.walls[wall].box.setFromObject(this.arena.walls[wall].mesh);

		// Check collisions
		for (let player in this.players)
		{
			if (this.ball.box.intersectsBox(this.players[player].box) && !this.players[player].bounce)
			{
				this.players[player].lightEffect();
				this.ball.adjustSpin(this.players[player]);
				this.players[player].resetBoost();
				this.ball.bounceFromPlayer(this.players[player]);
				this.ball.speedUp();
				this.resetBounces();
				this.players[player].bounce = true;
			}
		}

		for (let wall in this.arena.walls)
		{
			if (this.ball.box.intersectsBox(this.arena.walls[wall].box) && !this.arena.walls[wall].bounce)
			{
				this.arena.walls[wall].lightEffect();
				this.ball.reduceSpin();
				this.ball.bounceFromWall(this.arena.walls[wall]);
				this.resetBounces();
				this.arena.walls[wall].bounce = true;
			}
		}
		this.ball.affectBySpin();
		this.ball.move();
	}

	goal()
	{
		let goalOffSet = 1;
		if (this.settings.multiMode)
		{
			if (this.ball.mesh.position.x <= this.players["p1"].paddle.position.x - goalOffSet)
			{
				this.players["p2"].score++;
				return (true);
			}
			else if (this.ball.mesh.position.x >= this.players["p2"].paddle.position.x + goalOffSet)
			{
				this.players["p1"].score++;
				return (true);
			}
			else if (this.ball.mesh.position.z <= this.players["p3"].paddle.position.z - goalOffSet)
			{
				this.players["p3"].score++;
				return (true);
			}
			else if (this.ball.mesh.position.z >= this.players["p4"].paddle.position.z + goalOffSet)
			{
				this.players["p4"].score++;
				return (true);
			}
		}
		else
		{
			if (this.ball.mesh.position.x <= this.players["p1"].paddle.position.x - goalOffSet)
			{
				this.players["p2"].score++;
				return (true);
			}
			else if (this.ball.mesh.position.x >= this.players["p2"].paddle.position.x + goalOffSet)
			{
				this.players["p1"].score++;
				return (true);
			}
		}
		return (false)
	}

	gameEnded()
	{
		return (this.players["p1"].score == G.winningScore || this.players["p2"].score == G.winningScore);
	}

	resetGame()
	{
		this.players["p1"].score = 0;
		this.players["p2"].score = 0;
		this.updateScore();
	}

	updateScore()
	{
		this.ui.updateTextObject("score", this.players["p1"].score + " - " + this.players["p2"].score);
		this.ball.reset();
		for (let player in this.players)
			this.players[player].reset();
		this.resetBounces();
		this.sleepMillis(1000);
	}

	resetBounces()
	{
		for (let wall in this.arena.walls)
			this.arena.walls[wall].bounce = false;
		for (let player in this.players)
			this.players[player].bounce = false;
	}

	sleepMillis(millis)
	{
		var date = new Date();
		var curDate = null;
		do { curDate = new Date(); }
		while(curDate-date < millis);
	}
}