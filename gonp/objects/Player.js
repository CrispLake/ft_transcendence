import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';

export class Pusher {
    constructor(player) {
        this.player = player;
        this.lane = player.currentLane;
        this.size = player.boostAmount;
        this.geometry = new THREE.BoxGeometry(
            G.paddleThickness * player.boostAmount,
            G.paddleHeight * player.boostAmount,
            G.paddleLength * player.boostAmount
        );
        this.material = new THREE.MeshStandardMaterial({
            color: player.color,
            emissive: player.color
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(
            player.paddle.position.x,
            player.paddle.position.y,
            player.paddle.position.z
        );
        this.colliding = false;
        this.box = new THREE.Box3().setFromObject(this.mesh);
        // Ensure the mesh is added to the scene
        player.scene.add(this.mesh);
    }
    updateBoundingBox() {
        this.box.setFromObject(this.mesh);
    }
    downSize() {
        this.size -= 0.001;
        console.log(this.size);
        if (this.size < G.pusherMinSize) {
            // Remove the pusher from the pushers array and the scene
            this.player.pushers = this.player.pushers.filter(obj => obj !== this);
            this.player.scene.remove(this.mesh);
            console.log("removed pusher");
            return;
        }
        this.mesh.scale.set(
            G.paddleThickness * this.size / this.mesh.geometry.parameters.width,
            G.paddleHeight * this.size / this.mesh.geometry.parameters.height,
            G.paddleLength * this.size / this.mesh.geometry.parameters.depth
        );
        this.mesh.position.y = G.laneY + (this.box.max.y / 2) + (G.laneThickness / 2);
        this.updateBoundingBox();
    }
}

export class Player {
    constructor(scene, pos, name, color) {
        this.scene = scene;
        this.name = name;
        this.sign = pos.x > 0 ? 1 : -1;
        this.color = color;
        this.geometry = new THREE.BoxGeometry(G.paddleThickness, G.paddleHeight, G.paddleLength);
        this.material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color
        });
        this.paddle = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3().setFromObject(this.paddle);
        this.light = new THREE.RectAreaLight(color, G.paddleLightIntensity, G.paddleLength, G.paddleHeight);
        this.boostGeometry = new THREE.BoxGeometry(G.boostMeterWidth, G.boostMeterThickness, 0);
        this.boostMaterial = new THREE.MeshStandardMaterial({
            color: COLOR.BOOSTMETER,
            emissive: COLOR.BOOSTMETER
        });
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

    addToScene(scene) {
        scene.add(this.paddle);
        scene.add(this.light);
        // scene.add(this.boostMeter);
    }

    setPos(x, y, z) {
        this.paddle.position.set(x, y, z);
        this.light.position.copy(this.paddle.position);
        this.boostMeter.position.set(x, y, z);
    }

    movePushers() {
        for (let i = 0; i < this.pushers.length; i++) {
            this.movePusher(this.pushers[i]);
        }
    }
    movePusher(pusher) {
        if (pusher.colliding == true) {
            return ;
        }
        pusher.mesh.position.x -= G.pusherSpeed * this.sign;
        pusher.mesh.position.y = G.laneY + (pusher.box.max.y / 2) + (G.laneThickness / 2);
        pusher.updateBoundingBox();
    }
    move() {
        this.movePushers();
        if (this.moveRight) {
            this.moveRight = false;
            this.currentLane++;
        } else if (this.moveLeft) {
            this.moveLeft = false;
            this.currentLane--;
        }
        if (this.currentLane < 0) {
            this.currentLane = 2;
        } else if (this.currentLane > 2) {
            this.currentLane = 0;
        }
        this.paddle.position.z = G.lanePositions[this.currentLane];
        this.boostMeter.position.z = this.paddle.position.z;
        this.boostMeter.position.y = this.paddle.position.y + G.paddleHeight / 2 + G.boostMeterThickness / 2;
    }

    removeBoostMeter() {
        this.scene.remove(this.boostMeter);
        this.boostGeometry.dispose();
    }

    updateBoostMeter() {
        if (this.boostAmount == 0) {
            this.removeBoostMeter();
        } else {
            this.removeBoostMeter();
            this.boostGeometry = new THREE.BoxGeometry(
                G.paddleLength * this.boostAmount,
                G.boostMeterThickness,
                this.paddleLength * this.boostAmount
            );
            this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostMaterial);
            this.boostMeter.position.set(
                this.paddle.position.x,
                this.paddle.position.y,
                this.paddle.position.z + 2
            );
            this.scene.add(this.boostMeter);
        }
    }

    increaseBoost() {
        if (this.boostAmount < G.maxBoost) {
            this.boostAmount += G.boostIncrement;
        }
        this.updateBoostMeter();
    }

    spawnPusher() {
        this.pushers.push(new Pusher(this));
    }

    resetBoost() {
        if (this.boostAmount > G.pusherMinSize) {
            this.spawnPusher();
        }
        this.boostAmount = 0;
        this.updateBoostMeter();
    }

    reset() {
        this.setPos(
            (G.arenaLength / 2 - G.paddleThickness / 2) * this.sign,
            0,
            0
        );
        this.boostAmount = 0;
        this.updateBoostMeter();
    }
}