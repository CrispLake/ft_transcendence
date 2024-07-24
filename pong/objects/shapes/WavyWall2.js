import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';
import { Arrow } from './Arrow.js';

export class WavyWall2
{
    constructor()
    {
        // ----Sphere----
        const sphereGeometry = new THREE.SphereGeometry(G.powerupSphereRadius, G.powerupSphereSegments, G.powerupSphereSegments);
        const pointsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: G.powerupSphereOpacity, transparent: true, wireframe: false });
        const auraSphere = new THREE.Mesh(sphereGeometry, pointsMaterial);

        // ----Vectors----
        let totalHeight = G.wavyFloorThickness + G.wavyWallHeight;
        const center = new THREE.Vector3(0, 0, 0);
        const boxSize = new THREE.Vector3(G.wavyLength, totalHeight, G.wavyWidth);
        const longestBoxVector = center.distanceTo(boxSize) / 2;
        let ratio = G.powerupSphereRadius / longestBoxVector;

        // ----Add margin----
        ratio *= 0.95;

        // ----Set sizes----
        totalHeight = totalHeight * ratio;
        const floorThickness = G.wavyFloorThickness * ratio;
        const floorWidth = G.wavyWidth * ratio;
        const floorLength = G.wavyLength * ratio;
        const wallHeight = G.wavyWallHeight * ratio;
        let wallThickness = G.wavyWallThickness * ratio;
        if (wallThickness > floorWidth / 2)
            wallThickness = floorWidth / 2;

        // ----Floor----
        const floorGeometry = new THREE.BoxGeometry(floorLength, floorThickness, floorWidth);
        const floorMaterial = new THREE.MeshBasicMaterial({color: COLOR.POWER_WAVY_FLOOR});
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);

        // ----Walls----
        const wallGeometry = new THREE.BoxGeometry(floorLength, wallHeight, wallThickness);
        const wallMaterial = new THREE.MeshBasicMaterial({color: COLOR.POWER_WAVY_WALLS});
        const wallLeft = new THREE.Mesh(wallGeometry, wallMaterial);
        const wallRight = new THREE.Mesh(wallGeometry, wallMaterial);

        // ----Arrows----
        const sizeMultiplier = 0.3
        const thickness = 0.8;
        const bevelThickness = 0.2;
        const arrow1 = new Arrow(sizeMultiplier * ratio, thickness, COLOR.POWER_WAVY_ARROWS);
        const arrow2 = new Arrow(sizeMultiplier * ratio, thickness, COLOR.POWER_WAVY_ARROWS);
        arrow2.mesh.rotation.z = Math.PI;
        arrow1.mesh.position.x += floorLength * 0.2;
        arrow2.mesh.position.x -= floorLength * 0.2;
        arrow1.mesh.position.y -= totalHeight / 2;
        arrow2.mesh.position.y -= totalHeight / 2;
        arrow1.mesh.position.y += floorThickness / 2;
        arrow2.mesh.position.y += floorThickness / 2;
        arrow1.mesh.position.y += thickness * sizeMultiplier * ratio / 2;
        arrow2.mesh.position.y += thickness * sizeMultiplier * ratio / 2;
        arrow1.mesh.position.y += bevelThickness * sizeMultiplier * ratio;
        arrow2.mesh.position.y += bevelThickness * sizeMultiplier * ratio;


        // ----Positions----
        floor.position.set(0, (floorThickness - totalHeight) / 2, 0);
        wallLeft.position.set(0, (totalHeight - wallHeight) / 2, (floorWidth - wallThickness) / 2);
        wallRight.position.set(0, (totalHeight - wallHeight) / 2, (wallThickness - floorWidth) / 2);

        
        // ----Hitbox----
        this.box = new THREE.Box3();
        this.box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(floorLength, totalHeight, floorWidth));

        // ----HitSphere----
        this.hitSphere = new THREE.Sphere(auraSphere.position, G.powerupSphereRadius);

        // ----Group----
        this.mesh = new THREE.Group();
        this.mesh.add(floor);
        this.mesh.add(wallLeft);
        this.mesh.add(wallRight);
        this.mesh.add(arrow1.mesh);
        this.mesh.add(arrow2.mesh);
        this.mesh.add(auraSphere);
    }
}
