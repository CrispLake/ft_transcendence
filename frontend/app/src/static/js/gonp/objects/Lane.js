import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';

export class Lane extends THREE.Object3D {
	constructor(posZ) {
		super();
		this.colors = [
			new THREE.Color(COLOR.PLAYER2LANE),
			new THREE.Color(COLOR.FLOOR),
			new THREE.Color(COLOR.PLAYER1LANE)
		];
		this.sectionPositions = [
			G.laneOriginX - G.laneLength / 2,
			G.laneOriginX + G.laneLength / 2
		];
		this.geometry = new THREE.BoxGeometry(G.laneLength, G.laneHeight, G.laneThickness);
		this.material = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: COLOR.FLOOR, wireframe: false});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(G.laneOriginX, G.laneY, posZ);
		this.add(this.mesh);
		this.updateSectionPositions();
	}

	setSectionPos(leftPos, rightPos) {
		this.sectionPositions[0] = leftPos;
		this.sectionPositions[1] = rightPos;
		this.updateSectionPositions();
	}

	updateSectionPositions() {
		const leftPos = this.sectionPositions[0];
		const rightPos = this.sectionPositions[1];
		const leftLength = leftPos - (G.laneOriginX - G.laneLength / 2);
		const rightLength = (G.laneOriginX + G.laneLength / 2) - rightPos;
		const middleLength = G.laneLength - leftLength - rightLength;

		this.clear();
		if (leftLength > 0) {
			const leftGeometry = new THREE.BoxGeometry(leftLength, G.laneHeight, G.laneThickness);
			const leftMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: this.colors[0], wireframe: false});
			const leftMesh = new THREE.Mesh(leftGeometry, leftMaterial);
			leftMesh.position.set(G.laneOriginX - G.laneLength / 2 + leftLength / 2, G.laneY, this.mesh.position.z);
			this.add(leftMesh);
		}
		if (middleLength > 0) {
			const middleGeometry = new THREE.BoxGeometry(middleLength, G.laneHeight, G.laneThickness);
			const middleMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: this.colors[1], wireframe: false});
			const middleMesh = new THREE.Mesh(middleGeometry, middleMaterial);
			const middlePositionX = (leftPos + rightPos) / 2; // Corrected middle position
			middleMesh.position.set(middlePositionX, G.laneY, this.mesh.position.z);
			this.add(middleMesh);
		}
		if (rightLength > 0) {
			const rightGeometry = new THREE.BoxGeometry(rightLength, G.laneHeight, G.laneThickness);
			const rightMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: this.colors[2], wireframe: false});
			const rightMesh = new THREE.Mesh(rightGeometry, rightMaterial);
			rightMesh.position.set(G.laneOriginX + G.laneLength / 2 - rightLength / 2, G.laneY, this.mesh.position.z);
			this.add(rightMesh);
		}
	}	

	player1scored(amount) {
		amount *= 5;
		if (this.sectionPositions[1] - amount < G.laneOriginX - G.laneLength / 2) {
			this.setSectionPos(G.laneOriginX - G.laneLength / 2, G.laneOriginX - G.laneLength / 2);
			return;
		}
		if (this.sectionPositions[0] > this.sectionPositions[1] - amount) {
			this.setSectionPos(this.sectionPositions[1] - amount, this.sectionPositions[1] - amount);
		} else {
			this.setSectionPos(this.sectionPositions[0], this.sectionPositions[1] - amount);
		}
	}

	player2scored(amount) {
		amount *= 5;
		if (this.sectionPositions[0] + amount > G.laneOriginX + G.laneLength / 2) {
			this.setSectionPos(G.laneOriginX + G.laneLength / 2, G.laneOriginX + G.laneLength / 2);
			return;
		}
		if (this.sectionPositions[0] + amount > this.sectionPositions[1]) {
			this.setSectionPos(this.sectionPositions[0] + amount, this.sectionPositions[0] + amount);
		} else {
			this.setSectionPos(this.sectionPositions[0] + amount, this.sectionPositions[1]);
		}
	}
}
