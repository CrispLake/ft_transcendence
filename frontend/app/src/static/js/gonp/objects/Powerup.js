import * as THREE from 'three';
import * as G from '../globals.js';

export class Powerup
{
	constructor(scene, lane)
	{
		this.sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
		this.pointsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.8, transparent: true, wireframe: false });
		this.mesh = new THREE.Mesh(this.sphereGeometry, this.pointsMaterial);
		this.light = new THREE.PointLight(0xffffff, 1, 4);
		this.scene = scene;
		this.mesh.position.set(0, 0, G.lanePositions[lane]);
		this.box = new THREE.Box3().setFromObject(this.mesh);
		this.light.position.copy(this.mesh.position);
		scene.add(this.mesh);
		scene.add(this.light);
	}

	remove() {
		if (this.mesh) {
			this.mesh.geometry.dispose();
			this.mesh.material.dispose();
			this.scene.remove(this.mesh);
		}
		if (this.light) {
			this.scene.remove(this.light);
		}
		this.mesh = null;
		this.light = null;
		this.box = null;
	}
}
