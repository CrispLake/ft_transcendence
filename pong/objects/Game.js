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
import { PowerupManager } from './PowerupManager.js';

export class Game
{
	constructor()
	{
		console.log("Creating Game Object...");
		this.settings = new Settings();
		this.gameScene = new THREE.Scene();
		this.fontLoader = new FontLoader();
		this.gameCamera = this.createCamera();
		this.renderer = this.createRenderer();
		this.composer = new EffectComposer(this.renderer);
		this.createArena();
		this.createPlayers();
		this.ball = new Ball(this.gameScene, G.ballStartPos, this.settings.spin);
		this.initializeUI();
		this.powerupManager = new PowerupManager(this);
		this.update = this.update.bind(this);
		this.cameraRotate = false;
		console.log("Game Object Created!");
		this.update();
	}

	
	//--------------------------------------------------------------------------
	//	INITIALIZE
	//--------------------------------------------------------------------------

	initializeUI()
	{
		this.uiScene = new THREE.Scene();
		this.uiCamera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 0.1, 1000);
		this.uiCamera.position.z = 4;
		this.ui = new UserInterface(this.uiScene, this.fontLoader);

		this.ui.addPlayerCard(this.players["p1"]);
		this.ui.addPlayerCard(this.players["p2"]);
		if (this.settings.multiMode)
		{
			this.ui.addPlayerCard(this.players["p3"]);
			this.ui.addPlayerCard(this.players["p4"]);
		}
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
				this.gameScene,
				this.fontLoader,
				this.renderer,
				this.composer,
				this.gameCamera);
		else
			this.arena = new Arena4Player(
				this.gameScene,
				this.fontLoader,
				this.renderer,
				this.composer,
				this.gameCamera);
	}

	createPlayers()
	{
		this.players = [];
		const maxPlayers = this.settings.multiMode ? 4 : 2;

		for (let i = 0; i < maxPlayers; i++)
		{
			const playerId = "p" + (i + 1);

			if (i < this.settings.players)
				this.players[playerId] = new Player(this, this.gameScene, this.settings, i + 1, "Player" + (i + 1));
			else
				this.players[playerId] = new AI(this, i + 1, "AI" + (i + 1));
		}
		if (this.settings.multiMode)
			this.rotatePlayers();
	}

	rotatePlayers()
	{
		this.players["p3"].paddle.rotation.y = Math.PI / 2;
		this.players["p4"].paddle.rotation.y = Math.PI / 2;
		this.players["p3"].light.lookAt(0, 0, 0);
		this.players["p4"].light.lookAt(0, 0, 0);
	}


	//--------------------------------------------------------------------------
	//	CAMERA ROTATION
	//--------------------------------------------------------------------------

	rotateCamera()
	{
		let x = this.gameCamera.position.x;
		let z = this.gameCamera.position.z;
		let radius = Math.sqrt(x * x + z * z);
		let angle = PongMath.vector2DToAngle(x, z);

		angle += (Math.PI * 2) / (G.cameraOrbitTimeSec * G.fps);
		angle = PongMath.within2Pi(angle);

		this.gameCamera.position.x = radius * Math.sin(angle);
		this.gameCamera.position.z = radius * Math.cos(angle);
		this.gameCamera.lookAt(0, 0, 0);
	}

	updateCamera()
	{
		if (this.cameraRotate)
		{
			// this.rotateCamera();
		}
	}

	toggleCameraRotation()
	{
		this.cameraRotate = !this.cameraRotate;
	}


	//--------------------------------------------------------------------------
	//	UPDATE
	//--------------------------------------------------------------------------

	update()
	{
		setTimeout(() => { requestAnimationFrame(this.update); }, 1000 / G.fps);
		this.powerupManager.update();
		this.updateCamera();

		// Debug
		if (this.cameraRotate)
			return;

		for (let player in this.players)
			this.players[player].update();
		this.updateBallPosition();
		this.arena.update();
		if (this.goal())
		{
			if (this.gameEnded())
				this.resetGame();
			else
				this.resetPositions();
			this.powerupManager.reset();
		}
		this.composer.render();
		this.renderer.autoClear = false;
    	this.renderer.clearDepth();
		this.renderer.render(this.uiScene, this.uiCamera);
	}

	updateBallPosition()
	{
		for (let player in this.players)
		{
			if (this.ball.box.intersectsBox(this.players[player].box))
			{
				if (this.players[player].bounce == true)
					continue ;

				// Set player who touched the ball to active, rest to inactive.
				for (let p in this.players)
					this.players[p].active = false;
				this.players[player].active = true;
				
				this.players[player].lightEffect();
				this.ball.adjustSpin(this.players[player]);
				this.players[player].resetBoost();
				this.ball.bounceFromPlayer(this.players[player]);
				this.ball.speedUp();
				this.resetBounces();
				this.players[player].bounce = true;
				this.ball.affectBySpin();
				this.ball.move();
				return ;
			}
		}
		for (let wall in this.arena.walls)
		{
			if (this.ball.box.intersectsBox(this.arena.walls[wall].box))
			{
				if (this.arena.walls[wall].bounce == true)
					continue ;
				this.arena.walls[wall].lightEffect();
				this.ball.reduceSpin();
				this.ball.bounceFromWall(this.arena.walls[wall]);
				this.resetBounces();
				this.arena.walls[wall].bounce = true;
				this.ball.affectBySpin();
				this.ball.move();
				return ;
			}
		}
		if (this.powerupManager.powerup != null)
		{
			if (this.ball.box.intersectsBox(this.powerupManager.powerup.box))
			{
				for (let player in this.players)
				{
					if (this.players[player].active)
					{
						this.powerupManager.powerup.activate(this.players[player]);
						break;
					}
				}
				this.powerupManager.removePowerup();
			}
		}
		this.resetBounces();
		this.ball.affectBySpin();
		this.ball.move();
	}


	//--------------------------------------------------------------------------
	//	GAME FUNCTIONS
	//--------------------------------------------------------------------------

	goal()
	{
		let goalOffSet = 1;
		if (this.ball.mesh.position.x <= this.players["p1"].paddle.position.x - goalOffSet)
		{
			this.players["p1"].loseLife(1);
			this.ui.playerCards[this.players["p1"].name].decreaseLife(1);
			return (true);
		}
		else if (this.ball.mesh.position.x >= this.players["p2"].paddle.position.x + goalOffSet)
		{
			console.log("P2, lose life");
			this.players["p2"].loseLife(1);
			this.ui.playerCards[this.players["p2"].name].decreaseLife(1);
			return (true);
		}
		if (this.settings.multiMode)
		{
			if (this.ball.mesh.position.z <= this.players["p3"].paddle.position.z - goalOffSet)
			{
				this.players["p3"].loseLife(1);
				this.ui.playerCards[this.players["p3"].name].decreaseLife(1);
				return (true);
			}
			else if (this.ball.mesh.position.z >= this.players["p4"].paddle.position.z + goalOffSet)
			{
				this.players["p4"].loseLife(1);
				this.ui.playerCards[this.players["p4"].name].decreaseLife(1);
				return (true);
			}
		}
		return (false)
	}

	gameEnded()
	{
		for (let player in this.players)
		{
			if (this.players[player].lives == 0)
				return (true);
		}
		return (false);
	}

	resetGame()
	{
		for (let player in this.players)
			this.players[player].resetLife();
		for (let playerCard in this.ui.playerCards)
			this.ui.playerCards[playerCard].resetLife();
		this.resetPositions();
	}

	resetPositions()
	{
		for (let player in this.players)
			this.players[player].reset();
		this.ball.reset();
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
