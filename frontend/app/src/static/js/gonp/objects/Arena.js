import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import { Lane } from './Lane.js';
import { Powerup } from './Powerup.js';

export class Arena
{
	constructor(scene, powerupsOn)
	{
		this.laneLeftX = G.laneOriginX - (G.laneLength / 2);
		this.laneRightX = G.laneOriginX + (G.laneLength / 2);
		this.scene = scene;
		this.lanes = [];
		this.lanes.push(new Lane(G.lanePositions[0]));
		this.lanes.push(new Lane(G.lanePositions[1]));
		this.lanes.push(new Lane(G.lanePositions[2]));
		this.ambientLight = new THREE.AmbientLight(COLOR.WHITE, 0.05);
		this.powerupsOn = powerupsOn;
		this.powerup = 0;
		this.powerupSpawning = false;
		this.checkPowerupSpawn();
		this.addToScene();
	}

	spawnPowerup() {
		this.powerupSpawning = false;
		if (this.powerup) {
			this.powerup.remove();
			this.powerup = null;
		}
		this.powerup = new Powerup(this.scene, Math.floor(Math.random() * 3));

	}	

	checkPowerupSpawn() {
		const minTime = 5000;
		const maxTime = 10000;
		if (this.powerupsOn == false) {
			return ;
		}
		if (!this.powerup && !this.powerupSpawning) {
			const spawnInterval = Math.random() * (maxTime - minTime) + minTime;
			this.powerupSpawning = true;
			setTimeout(() => {
					this.spawnPowerup();
				}, spawnInterval);
		}
	}

	getSectionPositionByPusher(pusher) {
		if (pusher.sign < 0)
		{
			return (this.lanes[pusher.lane].sectionPositions[0])
		}
		return (this.lanes[pusher.lane].sectionPositions[1])
	}

	getOpposingSectionPositionByPusher(pusher) {
		if (pusher.sign > 0)
		{
			return (this.lanes[pusher.lane].sectionPositions[0])
		}
		return (this.lanes[pusher.lane].sectionPositions[1])
	}

	addToScene()
	{
		this.scene.add(this.ambientLight);
		for (let i = 0; i < this.lanes.length; i++) {
			this.scene.add(this.lanes[i])
		}
	}
}
