import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { Settings } from './Settings.js';
import { UserInterface } from './UserInterface.js';
import { Arena } from './Arena.js';
import { Arena4Player } from './Arena4Player.js';
import { Player } from './Player.js';
import { AI } from './AI.js';
import { Ball } from './Ball.js';

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
		this.lastBounce = this.createBounceCheck();
		this.fontLoader = new FontLoader();
		this.ui = new UserInterface(this.scene, this.fontLoader);
		this.initializeUI();
		this.camera = this.createCamera();
		this.renderer = this.createRenderer();
		this.composer = new EffectComposer(this.renderer);
		this.arena = this.createArena(this.scene, this.fontLoader, this.renderer, this.composer);
		this.update = this.update.bind(this);
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
			return (new Arena(this.scene, this.composer));
		else
			return (new Arena4Player(this.scene));
	}

	createPlayers()
	{
		if (this.settings.multiMode == false)
		{
			this.players["p1"] = new Player(this.scene, this.settings.spin, G.p1StartPos, "Player1");
			if (this.settings.players == 2)
				this.players["p2"] = new Player(this.scene, this.settings.spin, G.p2StartPos, "Player2");
			else
				this.players["p2"] = new AI(this.settings.spin, G.p2StartPos, "AI");
		}
		else
		{
			if (this.settings.players == 4)
				this.players["p4"] = new Player(this.scene, this.settings.spin, G.p4StartPos4Player, "Player4");
			else
				this.players["p4"] = new AI(this.settings.spin, G.p4StartPos4Player, "AI4");
			if (this.settings.players == 3)
				this.players["p3"] = new Player(this.scene, this.settings.spin, G.p3StartPos4Player, "Player3");
			else
				this.players["p3"] = new AI(this.settings.spin, G.p3StartPos4Player, "AI3");
			if (this.settings.players == 2)
				this.players["p2"] = new Player(this.scene, this.settings.spin, G.p2StartPos4Player, "Player2");
			else
				this.players["p2"] = new AI(this.settings.spin, G.p2StartPos4Player, "AI2");
			this.players["p1"] = new Player(this.scene, this.settings.spin, G.p1StartPos4Player, "Player1");
		}
	}
	
	createBounceCheck()
	{
		if (this.settings.multiMode == false)
		{
			return {
				wallLeft: false,
				wallRight: false,
				paddle1: false,
				paddle2: false
			};
		}
		else
		{
			return {
				leftWallUp: false,
				leftWallDown: false,
				rightWallUp: false,
				rightWallDown: false,
				topWallLeft: false,
				topWallRight: false,
				bottomWallLeft: false,
				bottomWallRight: false,
				paddle1: false,
				paddle2: false,
				paddle3: false,
				paddle4: false
			};
		}
	}

	// ----Game Functions----

	update()
	{
		console.log("Updating Game...");
		setTimeout(() => { requestAnimationFrame(this.update); }, 1000 / G.fps);
		this.players["p1"].update();
		if (this.settings.multiMode == false)
			this.players["p2"].update();
		else
		{
			this.players["p2"].update();
			this.players["p3"].update();
			this.players["p4"].update();
		}
		// this.ball.update();
		this.updateBallPosition();
		if (this.composer)
		{
			console.log("Rendering with composer");
			this.composer.render();
		}
		else
		{
			console.log("Rendering with renderer");
			this.renderer.render(this.scene, this.camera);
		}
		if (this.goal())
		{
			if (this.gameEnded())
				this.resetGame();
			else
				this.updateScore();
		}
		// this.renderer.autoClear = false;
		// this.renderer.clearDepth();
		// this.renderer.render(this.scene2D, this.camera2D);
	}

	updateBallPosition()
	{
		this.ball.box.setFromObject(this.ball.mesh);
		this.players["p1"].box.setFromObject(this.players["p1"].paddle);
		this.players["p2"].box.setFromObject(this.players["p2"].paddle);
		this.arena.leftWall.box.setFromObject(this.arena.leftWall.mesh);
		this.arena.rightWall.box.setFromObject(this.arena.rightWall.mesh);
		
		if (this.ball.box.intersectsBox(this.players["p1"].box) && !this.lastBounce.paddle1)
		{
			this.players["p1"].lightEffect();
			this.ball.adjustSpin(this.players["p1"]);
			this.players["p1"].resetBoost();
			this.ball.adjustAngle(this.players["p1"].paddle);
			this.ball.speedUp();
			this.ball.speedZ = -this.ball.speedZ;
			this.ball.updateAngle();
			this.resetBounces();
			this.lastBounce.paddle1 = true;
		}
		else if (this.ball.box.intersectsBox(this.players["p2"].box) && !this.lastBounce.paddle2)
		{
			this.players["p2"].lightEffect();
			this.ball.adjustSpin(this.players["p2"]);
			this.players["p2"].resetBoost();
			this.ball.adjustAngle(this.players["p2"].paddle);
			this.ball.speedUp();
			this.ball.speedX = -this.ball.speedX;
			this.ball.speedZ = -this.ball.speedZ;
			this.ball.updateAngle();
			this.resetBounces();
			this.lastBounce.paddle2 = true;
		}
		else if (this.ball.box.intersectsBox(this.arena.leftWall.box) && !this.lastBounce.wallLeft)
		{
			this.arena.leftWall.lightEffect();
			this.ball.reduceSpin();
			this.ball.speedZ = -this.ball.speedZ;
			this.ball.updateAngle();
			this.resetBounces();
			this.lastBounce.wallLeft = true;
		}
		else if (this.ball.box.intersectsBox(this.arena.rightWall.box) && !this.lastBounce.wallRight)
		{
			this.arena.rightWall.lightEffect();
			this.ball.reduceSpin();
			this.ball.speedZ = -this.ball.speedZ;
			this.ball.updateAngle();
			this.resetBounces();
			this.lastBounce.wallRight = true;
		}
		this.ball.affectBySpin();
		this.ball.move();
	}

	goal()
	{
		let goalOffSet = 1;
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
		this.players["p1"].reset();
		this.players["p2"].reset();
		this.resetBounces();
		this.sleepMillis(1000);
	}

	resetBounces()
	{
		if (this.settings.multiMode == false)
		{
			this.lastBounce.wallLeft = false;
			this.lastBounce.wallRight = false;
			this.lastBounce.paddle1 = false;
			this.lastBounce.paddle2 = false;
		}
		else
		{
			this.lastBounce.leftWallUp = false;
			this.lastBounce.leftWallDown = false;
			this.lastBounce.rightWallUp = false;
			this.lastBounce.rightWallDown = false;
			this.lastBounce.topWallLeft = false;
			this.lastBounce.topWallRight = false;
			this.lastBounce.bottomWallLeft = false;
			this.lastBounce.bottomWallRight = false;
			this.lastBounce.paddle1 = false;
			this.lastBounce.paddle2 = false;
			this.lastBounce.paddle3 = false;
			this.lastBounce.paddle4 = false;
		}
	}

	sleepMillis(millis)
	{
		var date = new Date();
		var curDate = null;
		do { curDate = new Date(); }
		while(curDate-date < millis);
	}
}