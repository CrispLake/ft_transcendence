import * as THREE from 'three';
import * as COLOR from '../pong/colors.js';
import { Arrow } from './Arrow.js';

export class WavyWall
{
    constructor(sphereRadius, size, width, length, floorThickness, wallHeight, wallThickness, widthSegments, heightSegments, dotSize, hitBoxVisible)
    {
        // ----Sphere----
        const sphereGeometry = new THREE.SphereGeometry(sphereRadius, widthSegments, heightSegments);
        const pointsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: dotSize * size });
        const spherePoints = new THREE.Points(sphereGeometry, pointsMaterial);
        
        // ----HitSphere----
        const boundingSphere = new THREE.Sphere(spherePoints.position, radius);

        // ----Set sizes----
        const totalHeight = adjustedFloorThickness + adjustedWallHeight;
        
        const adjustedFloorThickness = floorThickness * size;
        const adjustedWidth = width * size;
        const adjustedLength = length * size;
        const adjustedWallHeight = wallHeight * size;
        let adjustedWallThickness = wallThickness * size;
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
        this.arrow1 = new Arrow(sizeMultiplier * size, thickness, headWidth, headLength, shaftWidth, shaftLength, radius, bevelThickness, bevelSegments, COLOR.WHITE, arrowLightIntensity);
        this.arrow2 = new Arrow(sizeMultiplier * size, thickness, headWidth, headLength, shaftWidth, shaftLength, radius, bevelThickness, bevelSegments, COLOR.WHITE, arrowLightIntensity);
        this.arrow2.mesh.rotation.z = Math.PI;
        this.arrow1.mesh.position.x += adjustedLength * 0.2;
        this.arrow2.mesh.position.x -= adjustedLength * 0.2;
        this.arrow1.mesh.position.y -= totalHeight / 2;
        this.arrow2.mesh.position.y -= totalHeight / 2;
        this.arrow1.mesh.position.y += adjustedFloorThickness / 2;
        this.arrow2.mesh.position.y += adjustedFloorThickness / 2;
        this.arrow1.mesh.position.y += thickness * sizeMultiplier / 2;
        this.arrow2.mesh.position.y += thickness * sizeMultiplier / 2;
        this.arrow1.mesh.position.y += bevelThickness * sizeMultiplier;
        this.arrow2.mesh.position.y += bevelThickness * sizeMultiplier;


        // ----Positions----
        floor.position.set(0, (adjustedFloorThickness - totalHeight) / 2, 0);
        wallLeft.position.set(0, (totalHeight - adjustedWallHeight) / 2, (adjustedWidth - adjustedWallThickness) / 2);
        wallRight.position.set(0, (totalHeight - adjustedWallHeight) / 2, (adjustedWallThickness - adjustedWidth) / 2);

        // ----Vectors----
        const center = new THREE.Vector3(0, 0, 0);
        const boxSize = new THREE.Vector3(adjustedLength, totalHeight, adjustedWidth);
        
        // ----Hitbox----
        this.box = new THREE.Box3();
        this.box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), boxSize);

        // ----Group----
        this.mesh = new THREE.Group();
        this.mesh.add(floor);
        this.mesh.add(wallLeft);
        this.mesh.add(wallRight);
        this.mesh.add(this.arrow1.mesh);
        this.mesh.add(this.arrow2.mesh);
        this.mesh.add(spherePoints);



        if (hitBoxVisible)
        {
            const helper = new THREE.Box3Helper(this.box, COLOR.GREEN);
            this.mesh.add(helper);
        }
    }
}
