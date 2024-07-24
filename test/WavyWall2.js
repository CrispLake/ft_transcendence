import * as THREE from 'three';
import * as COLOR from '../pong/colors.js';
import { Arrow } from './Arrow.js';

export class WavyWall2
{
    constructor(sphereRadius, width, length, floorThickness, wallHeight, wallThickness, widthSegments, heightSegments, opacity)
    {
        // ----Sphere----
        const sphereGeometry = new THREE.SphereGeometry(sphereRadius, widthSegments, heightSegments);
        const pointsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: opacity, transparent: true, wireframe: false });
        const auraSphere = new THREE.Mesh(sphereGeometry, pointsMaterial);

        // ----Vectors----
        let totalHeight = floorThickness + wallHeight;
        const center = new THREE.Vector3(0, 0, 0);
        const boxSize = new THREE.Vector3(length, totalHeight, width);
        const longestBoxVector = center.distanceTo(boxSize) / 2;
        let ratio = sphereRadius / longestBoxVector;

        // ----Add margin----
        ratio *= 0.95;

        // ----Set sizes----
        totalHeight = totalHeight * ratio;
        const adjustedFloorThickness = floorThickness * ratio;
        const adjustedWidth = width * ratio;
        const adjustedLength = length * ratio;
        const adjustedWallHeight = wallHeight * ratio;
        let adjustedWallThickness = wallThickness * ratio;
        if (adjustedWallThickness > adjustedWidth / 2)
            adjustedWallThickness = adjustedWidth / 2;

        // ----Floor----
        const floorGeometry = new THREE.BoxGeometry(adjustedLength, adjustedFloorThickness, adjustedWidth);
        const floorMaterial = new THREE.MeshStandardMaterial({color: COLOR.GRAY});
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);

        // ----Walls----
        const wallGeometry = new THREE.BoxGeometry(adjustedLength, adjustedWallHeight, adjustedWallThickness);
        const wallMaterial = new THREE.MeshStandardMaterial({color: COLOR.PURPLE});
        const wallLeft = new THREE.Mesh(wallGeometry, wallMaterial);
        const wallRight = new THREE.Mesh(wallGeometry, wallMaterial);

        // ----Arrows----
        const sizeMultiplier = 0.3
        const thickness = 1;
        const arrowLightIntensity = 10;
        const headWidth = 3;
        const headLength = 1.5;
        const shaftWidth = 1;
        const shaftLength = 1.5;
        const radius = 0.1;
        const bevelThickness = 0.2;
        const bevelSegments = 8;
        const arrow1 = new Arrow(sizeMultiplier * ratio, thickness, headWidth, headLength, shaftWidth, shaftLength, radius, bevelThickness, bevelSegments, COLOR.WHITE, arrowLightIntensity);
        const arrow2 = new Arrow(sizeMultiplier * ratio, thickness, headWidth, headLength, shaftWidth, shaftLength, radius, bevelThickness, bevelSegments, COLOR.WHITE, arrowLightIntensity);
        arrow2.mesh.rotation.z = Math.PI;
        arrow1.mesh.position.x += adjustedLength * 0.2;
        arrow2.mesh.position.x -= adjustedLength * 0.2;
        arrow1.mesh.position.y -= totalHeight / 2;
        arrow2.mesh.position.y -= totalHeight / 2;
        arrow1.mesh.position.y += adjustedFloorThickness / 2;
        arrow2.mesh.position.y += adjustedFloorThickness / 2;
        arrow1.mesh.position.y += thickness * sizeMultiplier * ratio / 2;
        arrow2.mesh.position.y += thickness * sizeMultiplier * ratio / 2;
        arrow1.mesh.position.y += bevelThickness * sizeMultiplier * ratio;
        arrow2.mesh.position.y += bevelThickness * sizeMultiplier * ratio;


        // ----Positions----
        floor.position.set(0, (adjustedFloorThickness - totalHeight) / 2, 0);
        wallLeft.position.set(0, (totalHeight - adjustedWallHeight) / 2, (adjustedWidth - adjustedWallThickness) / 2);
        wallRight.position.set(0, (totalHeight - adjustedWallHeight) / 2, (adjustedWallThickness - adjustedWidth) / 2);

        
        // ----Hitbox----
        this.box = new THREE.Box3();
        this.box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), boxSize);

        // ----HitSphere----
        this.hitSphere = new THREE.Sphere(auraSphere.position, sphereRadius);

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
