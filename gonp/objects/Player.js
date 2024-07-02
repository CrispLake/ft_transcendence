import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';

export class Pusher {
    constructor(player) {
        this.player = player;
        this.lane = player.currentLane;
        this.size = player.boostAmount;
        this.geometry = new THREE.BoxGeometry(
            G.playerThickness * player.boostAmount,
            G.playerHeight * player.boostAmount,
            G.playerLength * player.boostAmount
        );
        this.material = new THREE.MeshStandardMaterial({
            color: player.color,
            emissive: player.color
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(
            player.mesh.position.x,
            player.mesh.position.y,
            player.mesh.position.z
        );
        this.colliding = false;
        this.box = new THREE.Box3().setFromObject(this.mesh);
        player.scene.add(this.mesh);
    }
    updateBoundingBox() {
        this.box.setFromObject(this.mesh);
    }
    downSize() {
        this.size -= 0.001;
        console.log(this.size);
        if (this.size < G.pusherMinSize) {
            this.player.removePusher(this);
            return;
        }
        this.mesh.scale.set(
            G.playerThickness * this.size / this.mesh.geometry.parameters.width,
            G.playerHeight * this.size / this.mesh.geometry.parameters.height,
            G.playerLength * this.size / this.mesh.geometry.parameters.depth
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
        this.geometry = new THREE.BoxGeometry(G.playerThickness, G.playerHeight, G.playerLength);
        this.material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3().setFromObject(this.mesh);
        this.light = new THREE.RectAreaLight(color, G.playerLightIntensity, G.playerLength, G.playerHeight);
        this.boostGeometry = new THREE.BoxGeometry(G.boostMeterWidth, G.boostMeterThickness, 0);
        this.boostMaterial = new THREE.MeshStandardMaterial({
            color: COLOR.BOOSTMETER,
            emissive: COLOR.BOOSTMETER
        });
        this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostMaterial);
        this.meshLength = G.playerLength;
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
    removePusher(pusher)
    {
        this.pushers = this.pushers.filter(obj => obj !== pusher);
        this.scene.remove(pusher.mesh);
        console.log("removed pusher");
        return;

    }
    addToScene(scene) {
        scene.add(this.mesh);
        scene.add(this.light);
        scene.add(this.boostMeter);
    }

    setPos(x, y, z) {
        this.mesh.position.set(x, y, z);
        this.light.position.copy(this.mesh.position);
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
        this.mesh.position.z = G.lanePositions[this.currentLane];
        this.boostMeter.position.z = this.mesh.position.z;
        this.boostMeter.position.y = this.mesh.position.y + G.playerHeight / 2 + G.boostMeterThickness / 2;
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
                G.playerLength * this.boostAmount,
                G.boostMeterThickness,
                this.meshLength * this.boostAmount
            );
            this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostMaterial);
            this.boostMeter.position.set(
                this.mesh.position.x,
                this.mesh.position.y,
                this.mesh.position.z + 2
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
            (G.arenaLength / 2 - G.playerThickness / 2) * this.sign,
            0,
            0
        );
        this.boostAmount = 0;
        this.updateBoostMeter();
    }
}