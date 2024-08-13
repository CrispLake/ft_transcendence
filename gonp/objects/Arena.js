import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';

export class Powerup
{
    constructor(scene, lane)
    {
        this.sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        this.pointsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.8, transparent: true, wireframe: false });
        this.auraSphere = new THREE.Mesh(this.sphereGeometry, this.pointsMaterial);
		this.light = new THREE.PointLight(0xffffff, 1, 4);
		this.scene = scene;

		const hitboxSize = 0.5;
		
		// Create a Box3 for the hitbox
		// this.box = new THREE.Box3();
		// Calculate the center of the object
		
		// Define the hitbox size around the center
		// Optionally, visualize the hitbox with a wireframe box (for debugging purposes)
		//------
		
        this.auraSphere.position.set(0, 0, G.lanePositions[lane]);
		const center = new THREE.Vector3();
		// this.auraSphere.geometry.computeBoundingBox();  // Ensure bounding box is computed
		// this.auraSphere.geometry.boundingBox.getCenter(center);
		// this.box.setFromCenterAndSize(center, new THREE.Vector3(hitboxSize, hitboxSize, hitboxSize));
		// this.box.position.copy(this.auraSphere.position);
        this.box = new THREE.Box3().setFromObject(this.auraSphere);
		this.light.position.copy(this.auraSphere.position);
		// this.box = new THREE.Sphere(this.mesh.position, 1);
		// const hitboxHelper = new THREE.Box3Helper(this.box, 0xff0000);  // Red color for visibility
		// scene.add(hitboxHelper);
		scene.add(this.auraSphere);
		scene.add(this.light);
	}
	remove() {
		if (this.auraSphere) {
			this.auraSphere.geometry.dispose();
			this.auraSphere.material.dispose();
			this.scene.remove(this.auraSphere);
		}
		if (this.light) {
			this.scene.remove(this.light);
		}
		this.auraSphere = null;
		this.light = null;
		this.box = null;
	}
}

export class Lane extends THREE.Object3D {
    constructor(posZ) {
        super();

        this.colors = [
            new THREE.Color(COLOR.PLAYER2LANE),
            new THREE.Color(COLOR.FLOOR),
            new THREE.Color(COLOR.PLAYER1LANE)
        ];
        this.sectionPositions = [
            G.laneOriginX - G.laneLength / 2, // Initial left section end
            G.laneOriginX + G.laneLength / 2  // Initial right section start
        ];

        this.geometry = new THREE.BoxGeometry(G.laneLength, G.laneHeight, G.laneThickness);

        // Initial material for the whole lane (middle color)
        this.material = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: COLOR.FLOOR, wireframe: false});

        // Create initial lane mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(G.laneOriginX, G.laneY, posZ);
        this.add(this.mesh);
        // Initial call to update section positions
        this.updateSectionPositions();
    }

    setSectionPos(leftPos, rightPos) {
        this.sectionPositions[0] = leftPos;
        this.sectionPositions[1] = rightPos;

        // Update the lane sections based on new positions
        this.updateSectionPositions();
    }

    updateSectionPositions() {
        const leftPos = this.sectionPositions[0];
        const rightPos = this.sectionPositions[1];

        // Calculate lengths
        const leftLength = leftPos - (G.laneOriginX - G.laneLength / 2);
        const rightLength = (G.laneOriginX + G.laneLength / 2) - rightPos;
        const middleLength = G.laneLength - leftLength - rightLength;

        // Remove existing lane sections
        this.clear();

        // Create left section
        if (leftLength > 0) {
            const leftGeometry = new THREE.BoxGeometry(leftLength, G.laneHeight, G.laneThickness);
            const leftMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: this.colors[0], wireframe: false});
            const leftMesh = new THREE.Mesh(leftGeometry, leftMaterial);
            leftMesh.position.set(G.laneOriginX - G.laneLength / 2 + leftLength / 2, G.laneY, this.mesh.position.z);
            this.add(leftMesh);
        }

        // Create middle section
        if (middleLength > 0) {
            const middleGeometry = new THREE.BoxGeometry(middleLength, G.laneHeight, G.laneThickness);
            const middleMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: this.colors[1], wireframe: false});
            const middleMesh = new THREE.Mesh(middleGeometry, middleMaterial);
            const middlePositionX = (leftPos + rightPos) / 2; // Corrected middle position
            middleMesh.position.set(middlePositionX, G.laneY, this.mesh.position.z);
            this.add(middleMesh);
        }

        // Create right section
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

export class Arena
{
    constructor(scene)
    {
		this.laneLeftX = G.laneOriginX - (G.laneLength / 2);
		this.laneRightX = G.laneOriginX + (G.laneLength / 2);
		this.scene = scene;
		this.lanes = [];
        this.lanes.push(new Lane(G.lanePositions[0]));
        this.lanes.push(new Lane(G.lanePositions[1]));
        this.lanes.push(new Lane(G.lanePositions[2]));
        this.ambientLight = new THREE.AmbientLight(COLOR.WHITE, 0.05);
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
		const minTime = 5000;  // 5 seconds in milliseconds
		const maxTime = 10000; // 10 seconds in milliseconds
		if (G.powerups == false) {
			return ;
		}
		if (!this.powerup && !this.powerupSpawning) {  // Assumes the powerup has a name 'powerup'
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