import * as THREE from 'three';
import * as G from '../globals.js';
import {reduceRGB} from '../math.js'

export class Pusher {
	constructor(player) {
		this.sign = player.sign;
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
			emissive: player.color,
			side: THREE.DoubleSide
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(
			player.mesh.position.x,
			player.mesh.position.y,
			player.mesh.position.z
		);
		this.speed = G.pusherSpeed + (G.pusherSpeed - G.pusherSpeed * (player.boostAmount / 2));
		console.log(this.speed);
		this.mesh.rotation.set(0, (Math.PI / 2), 0);
		this.colliding = false;
		this.box = new THREE.Box3().setFromObject(this.mesh);
		this.boostCooldown = false;
		this.light = new THREE.PointLight(reduceRGB(this.player.color, 64), 5 * player.boostAmount, 4.2, 0.5);
		this.light.position.copy(this.mesh.position);
		this.light.position.y += this.box.getSize.y / 2
		this.light.lookAt(this.light.position.x, this.light.position.y - 1, this.light.position.x)
		player.scene.add(this.light);
		player.scene.add(this.mesh);
		this.collisionNumber = -1;
		this.collisionSpeed = 0;
		this.setFurtestX();
	}

	setFurtestX() {
		let size = new THREE.Vector3();
		this.box.getSize(size)
		if (this.sign > 0) {
			this.furtestX = this.mesh.position.x + size.x;
		}
		else {
			this.furtestX = this.mesh.position.x - size.x;
		}
	}

	updateBoundingBox() {
		this.box.setFromObject(this.mesh);
		this.setFurtestX();
	}

	downSize(value) {
		this.size -= value;
		if (this.size < G.pusherMinSize) {
			this.player.removePusher(this);
			return;
		}
		this.speed = G.pusherSpeed + (G.pusherSpeed - G.pusherSpeed * (this.size / 2));
		this.mesh.scale.set(
			G.playerThickness * this.size / this.mesh.geometry.parameters.width,
			G.playerHeight * this.size / this.mesh.geometry.parameters.height,
			G.playerLength * this.size / this.mesh.geometry.parameters.depth
		);
		this.light.distance = 5 * this.size;
		this.mesh.position.y = G.laneY + (this.box.max.y / 2) + (G.laneThickness / 2);
		this.updateBoundingBox();
	}

	upSize(value) {
		this.size += value;
		if (this.size > G.pusherMaxSize) {
			this.size = G.pusherMaxSize;
		}
		this.speed = G.pusherSpeed + (G.pusherSpeed - G.pusherSpeed * (this.size / 2));
		this.mesh.scale.set(
			G.playerThickness * this.size / this.mesh.geometry.parameters.width,
			G.playerHeight * this.size / this.mesh.geometry.parameters.height,
			G.playerLength * this.size / this.mesh.geometry.parameters.depth
		);
		this.mesh.position.y = G.laneY + (this.box.max.y / 2) + (G.laneThickness / 2);
		this.updateBoundingBox();
	}

	moveX(amount) {
		this.mesh.position.x += amount;
		this.mesh.position.y = G.laneY + (this.box.max.y / 2) + (G.laneThickness / 2);
		this.updateBoundingBox();
		this.light.position.copy(this.mesh.position);
		this.light.lookAt(this.mesh.position.x , this.mesh.position.y - 1, this.mesh.position.z);
	}
}
