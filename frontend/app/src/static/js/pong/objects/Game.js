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
import { Results } from './Results.js';
import { Text2D } from './Text2D.js';

export class Game
{
	constructor(params)
	{
		this.resolve = null;
		this.playerList = params.players;
		this.settings = new Settings(params.settings);
		this.results = new Results();
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
		this.initializeGameClock();
		this.cameraRotate = false;
		this.pause = false;
		this.update = this.update.bind(this);
		this.initializeCountDown();
		this.animateStart = true;
		this.gameEnded = false;
		this.update();

		this.endGame = this.endGame.bind(this);
		this.update = this.update.bind(this);
		this.createPlayers = this.createPlayers.bind(this);
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
		this.playerAmount = 0;

		for (let i = 0; i < maxPlayers; i++)
		{
			const playerId = "p" + (i + 1);
			
			if (i < this.playerList.length && this.playerList[i].username !== 'AI')
			{
				this.players[playerId] = new Player(this, this.gameScene, this.settings, i + 1, this.playerList[i].username, this.playerList[i].id);
				this.playerAmount++;
			}
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
		if (this.cameraRotate || this.gameEnded)
		{
			this.rotateCamera();
		}
	}

	toggleCameraRotation()
	{
		this.cameraRotate = !this.cameraRotate;
	}


	//--------------------------------------------------------------------------
	//	PAUSE & TIME
	//--------------------------------------------------------------------------

	togglePause()
	{
		if (!this.pause)
		{
			this.pauseStart = this.gameClock.getElapsedTime();
			this.elapsedTime += this.pauseStart;
		}
		else
		{
			this.gameClock.start();
		}
		this.pause = !this.pause;
	}

	time()
	{
		if (this.pause)
			return this.elapsedTime;
		else
			return this.elapsedTime + this.gameClock.getElapsedTime();
	}

	initializeGameClock()
	{
		this.gameClock = new THREE.Clock();
		this.gameClock.start();
		this.pause = false;
		this.elapsedTime = 0;
		this.pauseStart = 0;
	}


	//--------------------------------------------------------------------------
	//	START ANIMATION
	//--------------------------------------------------------------------------

	createCountDownText(text)
	{
		this.countDownText = new Text2D(this.uiScene, text, G.countDownMaxSize, COLOR.UI_COUNTDOWN_TEXT, this.fontLoader, window.innerWidth, (mesh) => {
			mesh.position.set(-this.countDownText.textWidth / 2, -this.countDownText.textHeight / 2, 0);
			this.uiScene.add(mesh);
		});
	}

	initializeCountDown()
	{
		this.gameClock.start();
		this.countDown = 3;
		this.createCountDownText(this.countDown.toString());
		console.log(this.countDown);
	}
	
	startAnimation()
	{
		if (this.gameClock.getElapsedTime() >= 1)
		{
			this.countDown--;
			if (this.countDown > 0)
			{
				this.countDownText.update2DText(this.countDown.toString());
			}
			else if (this.countDown == 0)
			{
				this.countDownText.update2DText("START");
			}
			else
			{
				this.animateStart = false;
				this.uiScene.remove(this.countDownText.mesh);
			}
			this.gameClock.elapsedTime--;
		}
	}


	//--------------------------------------------------------------------------
	//	UPDATE
	//--------------------------------------------------------------------------

	update()
	{
		setTimeout(() => { requestAnimationFrame(this.update); }, 1000 / G.fps);
		
		if (this.gameEnded)
		{
			this.updateCamera();
			this.render();
			return;
		}
		if (this.animateStart)
		{
			this.startAnimation();
			this.render();
			return;
		}
		if (this.pause)
			return;
		this.powerupManager.update();
		for (let player in this.players)
			this.players[player].update();
		this.updateBallPosition();
		this.arena.update();
		if (this.goal())
		{
			if (this.endingConditionFilled())
			{
				this.gameEnded = true;
				this.saveResults();
				this.endGame();
			}
			else
				this.resetPositions();
			this.powerupManager.reset();
		}
		this.render();
	}

	updateBallPosition()
	{
		for (let player in this.players)
		{
			if (this.ball.box.intersectsBox(this.players[player].box))
			{
				for (let p in this.players)
					this.players[p].active = false;
				this.players[player].setActive();
				
				this.players[player].lightEffect();
				this.ball.adjustSpin(this.players[player]);
				this.players[player].resetBoost();
				this.ball.bounceFromPlayer(this.players[player]);
				this.ball.speedUp();
				this.ball.affectBySpin();
				this.ball.move();
				return ;
			}
		}
		for (let wall in this.arena.walls)
		{
			if (this.ball.box.intersectsBox(this.arena.walls[wall].box))
			{
				this.arena.walls[wall].lightEffect();
				this.ball.reduceSpin();
				this.ball.bounceFromWall(this.arena.walls[wall]);
				this.ball.affectBySpin();
				this.ball.move();
				return ;
			}
		}
		if (this.powerupManager.powerup != null)
		{
			if (this.ball.box.intersectsSphere(this.powerupManager.powerup.hitbox))
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
		this.ball.affectBySpin();
		this.ball.move();
	}

	render()
	{
		// Render game scene
		this.composer.render();

		// Render UI scene
		this.renderer.autoClear = false;
    	this.renderer.clearDepth();
		this.renderer.render(this.uiScene, this.uiCamera);
		this.renderer.autoClear = true;
	}


	//--------------------------------------------------------------------------
	//	GAME FUNCTIONS
	//--------------------------------------------------------------------------

	goal()
	{
		if (this.ball.mesh.position.x <= this.players["p1"].paddle.position.x - G.goalOffset)
		{
			this.players["p1"].loseLife(1);
			this.ui.playerCards[this.players["p1"].name].decreaseLife(1);
			return (true);
		}
		else if (this.ball.mesh.position.x >= this.players["p2"].paddle.position.x + G.goalOffset)
		{
			this.players["p2"].loseLife(1);
			this.ui.playerCards[this.players["p2"].name].decreaseLife(1);
			return (true);
		}
		if (this.settings.multiMode)
		{
			if (this.ball.mesh.position.z <= this.players["p3"].paddle.position.z - G.goalOffset)
			{
				this.players["p3"].loseLife(1);
				this.ui.playerCards[this.players["p3"].name].decreaseLife(1);
				return (true);
			}
			else if (this.ball.mesh.position.z >= this.players["p4"].paddle.position.z + G.goalOffset)
			{
				this.players["p4"].loseLife(1);
				this.ui.playerCards[this.players["p4"].name].decreaseLife(1);
				return (true);
			}
		}
		return (false)
	}

	endingConditionFilled()
	{
		for (let player in this.players)
		{
			if (this.players[player].lives == 0)
				return (true);
		}
		return (false);
	}

	endGame()
	{
		if (!this.resolve)
			return;
		this.resolve(this.results);
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
		// this.resetBounces();
		this.sleepMillis(1000);
	}


	sleepMillis(millis)
	{
		var date = new Date();
		var curDate = null;
		do { curDate = new Date(); }
		while(curDate-date < millis);
	}

	saveResults()
	{
		if (this.settings.multiMode)
			this.results.setResult4p(this.players["p1"], this.players["p2"], this.players["p3"], this.players["p4"]);
		else
			this.results.setResult2p(this.players["p1"], this.players["p2"]);

	}
}
