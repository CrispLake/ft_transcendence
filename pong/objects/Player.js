import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';

export class Player
{
    constructor(scene, pos, name)
    {
        this.scene = scene;
        this.name = name;
        this.sign = (pos.x > 0) ? 1 : -1;
        this.geometry = new THREE.BoxGeometry(G.paddleThickness, G.wallHeight, G.paddleLength);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.PADDLE, emissive: COLOR.PADDLE});
        this.paddle = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.light = new THREE.RectAreaLight(COLOR.PADDLE, G.paddleLightIntensity, G.paddleLength, G.paddleHeight);
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
        this.addToScene(scene);
    }

    addToScene(scene)
    {
        scene.add(this.paddle);
        scene.add(this.light);
        // scene.add(this.boostMeter);
    }

    setPos(x, y, z)
    {
        this.paddle.position.set(x, y, z);
        this.light.position.copy(this.paddle.position);
        this.boostMeter.position.set(x + this.boostOffset, y, z);
    }

    move(movement)
    {
        this.paddle.position.z += movement;
        this.light.position.copy(this.paddle.position);
        this.boostMeter.position.z = this.paddle.position.z;
    }

    removeBoostMeter()
    {
        this.scene.remove(this.boostMeter);
        this.boostGeometry.dispose();
    }

    updateBoostMeter()
    {
        if (this.boostAmount == 0)
        {
            this.scene.remove(this.boostMeter);
            this.boostGeometry.dispose();
        }
        else
        {
            this.scene.remove(this.boostMeter);
            this.boostGeometry.dispose();
            this.boostGeometry = new THREE.BoxGeometry(G.boostMeterWidth, G.boostMeterThickness, this.paddleLength * this.boostAmount);
            this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostMaterial);
            this.boostMeter.position.set(this.paddle.position.x + this.boostOffset, this.paddle.position.y, this.paddle.position.z);
            this.scene.add(this.boostMeter);
        }
    }

    increaseBoost()
    {
        this.boostAmount += G.boostIncrement;
        if (this.boostAmount > G.maxBoost)
        {
            this.boostAmount = 0;
        }
        this.updateBoostMeter();
    }

    resetBoost()
    {
        this.boostAmount = 0;
        this.updateBoostMeter();
    }

    reset()
    {
        this.setPos((G.arenaLength / 2 - G.paddleThickness / 2) * this.sign, 0, 0);
        this.boostAmount = 0;
        this.updateBoostMeter();
    }
};
