import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';

export class Pusher
{
    constructor(player)
    {
        this.size = player.boostAmount;
        this.geometry = new THREE.BoxGeometry(G.paddleThickness * player.boostAmount, G.paddleHeight * player.boostAmount, G.paddleLength * player.boostAmount);
        this.material = new THREE.MeshStandardMaterial({color: player.color, emissive: player.color});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(player.paddle.position.x, player.paddle.position.y, player.paddle.position.z);
        this.Box3
        // this.light = new THREE.PointLight(player.color, 1, 0.1, 0);
        player.scene.add(this.mesh);
        player.scene.add(this.light);
    }
}

export class Player
{
    constructor(scene, pos, name, color)
    {
        this.scene = scene;
        this.name = name;
        this.sign = (pos.x > 0) ? 1 : -1;
        this.color = color;
        this.geometry = new THREE.BoxGeometry(G.paddleThickness, G.paddleHeight, G.paddleLength);
        this.material = new THREE.MeshStandardMaterial({color: color, emissive: color});
        this.paddle = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.light = new THREE.RectAreaLight(color, G.paddleLightIntensity, G.paddleLength, G.paddleHeight);
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
        this.currentLane = 1;
        this.setPos(pos.x, pos.y, G.lanePositions[this.currentLane]);
        this.light.lookAt(0, 0, 0);
        this.addToScene(scene);
        this.pushers = [];
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
        this.boostMeter.position.set(x, y, z);
    }
    movePushers()
    {
        let pusher;
        for (let i = 0; i < this.pushers.length; i++)
        {
            pusher = this.pushers[i];
            pusher.mesh.position.set(pusher.mesh.position.x - G.pusherSpeed * this.sign, pusher.mesh.position.y, pusher.mesh.position.z);
            // pusher.light.position.copy(pusher.mesh.position);

        }
    }
    move()
    {
        this.movePushers();
        if (this.moveRight) {
            this.moveRight = false;
            this.currentLane++;
        }
        else if (this.moveLeft) {
            this.moveLeft = false;
            this.currentLane--;
        }
        if (this.currentLane < 0) {
            this.currentLane = 2;
        }
        else if (this.currentLane > 2) {
            this.currentLane = 0
        }
        this.paddle.position.z = G.lanePositions[this.currentLane];
        // this.light.position.copy(this.paddle.position);
        this.boostMeter.position.z = this.paddle.position.z;
        this.boostMeter.position.y = this.paddle.position.y + (G.paddleHeight / 2) + (G.boostMeterThickness / 2);
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
            this.boostGeometry = new THREE.BoxGeometry(G.paddleLength * this.boostAmount, G.boostMeterThickness, this.paddleLength * this.boostAmount);
            this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostMaterial);
            this.boostMeter.position.set(this.paddle.position.x, this.paddle.position.y, this.paddle.position.z + 2);
            this.scene.add(this.boostMeter);
        }
    }

    increaseBoost()
    {
        if (this.boostAmount < G.maxBoost)
        {
            this.boostAmount += G.boostIncrement;
        }
        this.updateBoostMeter();
    }
    spawnPusher()
    {
        this.pushers.push(new Pusher(this));
        // G.paddleLength * this.boostAmount, G.boostMeterThickness, this.paddleLength * this.boostAmount
    }
    resetBoost()
    {
        if (this.boostAmount > 0.2) {
            this.spawnPusher();
        }
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
