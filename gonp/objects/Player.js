import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
import {lerp} from '../math.js'

function reduceRGB(color, amount) {
    let r = (color >> 16) & 0xFF;
    let g = (color >> 8) & 0xFF;
    let b = color & 0xFF;
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);
   return (r << 16) | (g << 8) | b;
}

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
        // this.mesh.rotation.y = 30;
        this.colliding = false;
        this.box = new THREE.Box3().setFromObject(this.mesh);
		this.boostCooldown = false;
        // this.light = new THREE.RectAreaLight(player.color, 1, player.boostAmount * 2, player.boostAmount * 2);
		this.light = new THREE.PointLight(reduceRGB(this.player.color, 64), 5 * player.boostAmount, 4.2, 0.5);
		this.light.position.copy(this.mesh.position);
		this.light.position.y += this.box.getSize.y / 2
		this.light.lookAt(this.light.position.x, this.light.position.y - 1, this.light.position.x)
		player.scene.add(this.light);
		player.scene.add(this.mesh);
		this.setFurtestX();
	}
	setFurtestX() {
		let size = new THREE.Vector3();
		this.box.getSize(size)
		// console.log("meshPos: " + this.mesh.position.x);
		// console.log("meshSize: " + size.x);
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
}

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
            this.movePusher(this.pushers[i]);
        }
    }
	checkFurtestX(pusher) {
		if (pusher.sign < 0) {
			// console.log(pusher.sign + "sign")
			// console.log(this.arena.getSectionPositionByPusher(pusher))
			return (pusher.furtestX < this.arena.getSectionPositionByPusher(pusher));
		}
		else {
			// console.log(pusher.sign + "sign")
			// console.log(this.arena.getSectionPositionByPusher(pusher))
			return (pusher.furtestX > this.arena.getSectionPositionByPusher(pusher))
		}
	}
	calculateDownsize(pusher) {
		let pusherX = pusher.furtestX * pusher.sign;
		let laneEnd = G.laneEnd;
		let distanceModifier = 1;
		if (pusherX < 0) {
			laneEnd += -pusherX;
			// laneEnd *= 2;
			// pusherX = 0;
		} else {
			laneEnd -= pusherX;
			// pusherX = 0;
		}
		distanceModifier = 1 - (((G.laneLength / 2) - pusherX) / G.laneLength);

		// let result = lerp(pusher.speed, pusherX, laneEnd, G.pusherMinSize, pusher.size);
		let result = pusher.speed / laneEnd;
		if (result > 0.99) {
			result = 0.99;
		}
		result *= (pusher.size - (G.pusherMinSize + G.pusherMinSize / 3));//lerp(result, 0, 1, G.pusherMinSize, pusher.size)
		// console.log("pusherX: " + pusherX + " laneEnd: " + laneEnd + " result: " +  result);
		// console.log("distanceModifier: " + distanceModifier);
		return (result * (distanceModifier * distanceModifier));
	}
	movePusher(pusher) {
		let speedModifier = 1;
		// for (let i = this.pushers.length - 1; i >= 0; i--)
		let secondPusher;
		for (let i =  0; i < this.pushers.length; i++)
		{
			secondPusher = this.pushers[i]; 
			if (pusher == secondPusher) {
				break ;
			}
			if (pusher.box.intersectsBox(secondPusher.box)) {
				this.feedPusher(pusher, secondPusher)
				const overlapX = Math.min(pusher.box.max.x, secondPusher.box.max.x) - Math.max(pusher.box.min.x, secondPusher.box.min.x);
				let mtv = new THREE.Vector3(overlapX, 0, 0);
				pusher.mesh.position.x -= (mtv.x / 2 - 0.005) * this.sign;
				pusher.updateBoundingBox()
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
		// console.log("x: " + pusher.mesh.position.x);
		
		// console.log("furtest x" + pusher.furtestX)
		// pusher.furtestX -= (pusher.speed * speedModifier) * this.sign;
		pusher.mesh.position.y = G.laneY + (pusher.box.max.y / 2) + (G.laneThickness / 2);
		pusher.light.position.copy(pusher.mesh.position);
		// pusher.light.position.y += pusher.box.getSize.y / 2
		pusher.light.lookAt(pusher.mesh.position.x , pusher.mesh.position.y - 1, pusher.mesh.position.z);
        pusher.updateBoundingBox();
		// console.log(this.arena.getSectionPositionByPusher(pusher))
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
        this.pushers.push(new Pusher(this));
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