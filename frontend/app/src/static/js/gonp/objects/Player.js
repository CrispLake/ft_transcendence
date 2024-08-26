import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
import { Pusher } from './Pusher.js';

export class Player {
	constructor(scene, pos, name, color, arena) {
		this.scene = scene;
		this.name = name;
		this.sign = pos.x < 0 ? 1 : -1;
		this.color = color;
		this.arena = arena;
		this.geometry = new THREE.BoxGeometry(G.playerThickness, G.playerHeight, G.playerLength);
		this.material = new THREE.MeshStandardMaterial({
			color: color,
			emissive: color
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.box = new THREE.Box3().setFromObject(this.mesh);
		this.light = new THREE.RectAreaLight(color, 3, G.playerLength, G.playerHeight);
		this.boostGeometry = new THREE.BoxGeometry(G.boostMeterWidth, G.boostMeterThickness, 0);
		this.boostActiveMaterial = new THREE.MeshStandardMaterial({
			color: 0xffffffff,
			emissive: COLOR.BOOSTMETER
		});
		this.boostPassiveMaterial = new THREE.MeshStandardMaterial({
			color: 0xffffffff,
			emissive: COLOR.FLOOR
		});
		this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostPassiveMaterial);
		this.meshLength = G.playerLength;
		this.score = 0;
		this.moveLeft = false;
		this.moveRight = false;
		this.boostPressed = false;
		this.boostPaused = false;
		this.boostAmount = 0;
		this.speed = G.initialPaddleSpeed;
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
		this.scene.remove(pusher.light);
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
			if (this.sign < 0) {
				if (this.pushers[i].furtestX < this.mesh.position.x) {
					this.removePusher(this.pushers[i]);
					continue ;
				}
			}
			else {
				if (this.pushers[i].furtestX > this.mesh.position.x) {
					this.removePusher(this.pushers[i]);
					continue ;
				}
			}
			if (this.pushers[i]) {
				this.movePusher(this.pushers[i]);
			}
		}
	}

	checkFurtestX(pusher) {
		if (pusher.sign < 0) {
			return (pusher.furtestX < this.arena.getSectionPositionByPusher(pusher));
		}
		else {
			return (pusher.furtestX > this.arena.getSectionPositionByPusher(pusher))
		}
	}

	calculateDownsize(pusher) {
		let pusherX = pusher.furtestX * pusher.sign;
		let laneEnd = G.laneEnd;
		let distanceModifier = 1;
		if (pusherX < 0) {
			laneEnd += -pusherX;
		} else {
			laneEnd -= pusherX;
		}
		distanceModifier = 1 - (((G.laneLength / 2) - pusherX) / G.laneLength);
		let result = pusher.speed / laneEnd;
		if (result > 0.99) {
			result = 0.99;
		}
		result *= (pusher.size - (G.pusherMinSize + G.pusherMinSize / 3));
		return (Math.abs(result * (distanceModifier * distanceModifier)));
	}

	movePusher(pusher) {
		let speedModifier = 1;
		let secondPusher;

		for (let i =  0; i < this.pushers.length; i++) {
			secondPusher = this.pushers[i];
			if (pusher == secondPusher) {
				break ;
			}
			if (pusher.box.intersectsBox(secondPusher.box)) {
				this.feedPusher(pusher, secondPusher)
				const overlapX = Math.min(pusher.box.max.x, secondPusher.box.max.x) - Math.max(pusher.box.min.x, secondPusher.box.min.x);
				let mtv = new THREE.Vector3(overlapX, 0, 0);
				return ;
			}
		}
		if (pusher.colliding == true) {
			return ;
		}
		if (this.checkFurtestX(pusher)) {
			speedModifier = 0.5;
			if (!pusher.colliding)
			{
				let downSizeAmount = this.calculateDownsize(pusher);
				if (pusher.sign > 0) { 
					this.arena.lanes[pusher.lane].player1scored(downSizeAmount);
				} else {
					this.arena.lanes[pusher.lane].player2scored(downSizeAmount);
				}
				pusher.downSize(downSizeAmount);
			}
		}

		pusher.mesh.position.x += (pusher.speed * speedModifier) * this.sign;
		pusher.setFurtestX();
		pusher.mesh.position.y = G.laneY + (pusher.box.max.y / 2) + (G.laneThickness / 2);
		pusher.light.position.copy(pusher.mesh.position);
		pusher.light.lookAt(pusher.mesh.position.x , pusher.mesh.position.y - 1, pusher.mesh.position.z);
        pusher.updateBoundingBox();
	}

	feedPusher(feeder, reciever) {
		feeder.downSize(G.pusherFightValue * 2);
		reciever.upSize(G.pusherFightValue * 2);
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
		this.boostMeter.position.x = this.mesh.position.x;		
		this.boostMeter.position.y = this.mesh.position.y + G.playerHeight / 2 + G.boostMeterThickness / 2;
		this.light.position.copy(this.mesh.position);
	}

	removeBoostMeter() {
		this.scene.remove(this.boostMeter);
		this.boostGeometry.dispose();
	}

	logicLoop()
	{
		this.move();
		if (this.boostPaused) {
			return ;
		}
		else if (this.boostPressed && !this.boostCooldown) {
			this.increaseBoost();
		}
		else {
			this.decreaseBoost();
		}
	}

	updateBoostMeter() {
		if (this.boostAmount == 0) {
			this.boostCooldown = false;
			this.removeBoostMeter();
		} else {
			this.removeBoostMeter();
			this.boostGeometry = new THREE.BoxGeometry(
				G.playerLength * this.boostAmount,
				G.boostMeterThickness,
				this.meshLength * this.boostAmount
			);
			if (this.boostAmount < G.pusherMinSize || this.boostCooldown) {
				this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostPassiveMaterial);
			}
			else {
				this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostActiveMaterial);
			}
				this.boostMeter.position.set(
				this.mesh.position.x,
				this.mesh.position.y + G.playerHeight / 2 + G.boostMeterThickness / 2,
				this.mesh.position.z
			);
			this.scene.add(this.boostMeter);
		}
	}

	increaseBoost() {
		if (this.boostAmount < G.maxBoost && !this.boostCooldown) {
			this.boostAmount += G.boostIncrement;
		}
		this.updateBoostMeter();
	}

	spawnPusher() {
		let pusher = new Pusher(this);

		for (let i = 0; i < this.pushers.length; i++) {
			if (pusher.box.intersectsBox(this.pushers[i].box)) {
				return ;
			}
		}
		this.pushers.push(pusher);
	}

	resetBoost() {
		if (this.boostAmount > G.pusherMinSize) {
			this.spawnPusher();
		}
		this.boostAmount = 0;
		this.updateBoostMeter();
	}

	decreaseBoost() {
		if (this.boostAmount > G.pusherMinSize && !this.boostCooldown) {
			this.spawnPusher();
			this.boostCooldown = true;
		}
		if (this.boostAmount <= 0) {
			this.boostAmount = 0;
			this.boostCooldown = false;
		}
		else {
			this.boostAmount -= G.boostDecrement;
		}
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
