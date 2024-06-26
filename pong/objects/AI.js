import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
// import * as SETTINGS from '../gameSetting.js';
import * as PongMath from '../math.js';

export class AI
{
    constructor(game, pos, name)
    {
		this.game = game;
        this.scene = game.scene;
        this.name = name;
        this.sign = (pos.x > 0) ? 1 : -1;
        this.color = (this.sign == -1) ? COLOR.PADDLE1 : COLOR.PADDLE2;
        this.colorLight = (this.sign == -1) ? COLOR.PADDLE1_LIGHT : COLOR.PADDLE2_LIGHT;
        this.geometry = new THREE.BoxGeometry(G.paddleThickness, G.wallHeight, G.paddleLength);
        this.material = new THREE.MeshStandardMaterial({color: this.color, emissive: this.color});
        this.paddle = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.light = new THREE.RectAreaLight(this.color, G.paddleLightIntensity, G.paddleLength, G.paddleHeight);
        this.boostGeometry = new THREE.BoxGeometry(G.boostMeterWidth, G.boostMeterThickness, 0);
        this.boostMaterial = new THREE.MeshStandardMaterial({color: COLOR.BOOSTMETER, emissive: COLOR.BOOSTMETER})
        this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostMaterial);
        this.paddleLength = G.paddleLength;
        this.score = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.boostPressed = false;
        this.boostAmount = 0;
        this.speed = G.initialPaddleSpeed;
        this.boostOffset = G.boostOffset * this.sign;
        this.setPos(pos.x, pos.y, pos.z);
        this.light.lookAt(0, 0, 0);
        this.addToScene();
        this.clock = new THREE.Clock();
        this.effect = false;
    }

    addToScene()
    {
        this.scene.add(this.paddle);
        this.scene.add(this.light);
        // scene.add(this.boostMeter);
    }

    setPos(x, y, z)
    {
        this.paddle.position.set(x, y, z);
        this.light.position.copy(this.paddle.position);
        this.boostMeter.position.set(x + this.boostOffset, y, z);
    }
};