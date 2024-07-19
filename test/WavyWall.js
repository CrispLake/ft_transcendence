import * as THREE from 'three';
import * as C from '../pong/colors.js';

export class WavyWall
{
    constructor(size, width, length, floorThickness, wallHeight, wallThickness, widthSegments, heightSegments, dotSize, hitBoxVisible, dotsVisible)
    {
        const adjustedFloorThickness = floorThickness * size;
        const adjustedWidth = width * size;
        const adjustedLength = length * size;
        const adjustedWallHeight = wallHeight * size;
        let adjustedWallThickness = wallThickness * size;
        if (adjustedWallThickness > adjustedWidth / 2)
            adjustedWallThickness = adjustedWidth / 2;
        const totalHeight = adjustedFloorThickness + adjustedWallHeight;

        // ----Floor----
        const floorGeometry = new THREE.BoxGeometry(adjustedLength, adjustedFloorThickness, adjustedWidth);
        const floorMaterial = new THREE.MeshStandardMaterial({color: C.GRAY});
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);

        // ----Walls----
        const wallGeometry = new THREE.BoxGeometry(adjustedLength, adjustedWallHeight, adjustedWallThickness);
        const wallMaterial = new THREE.MeshStandardMaterial({color: C.PURPLE});
        const wallLeft = new THREE.Mesh(wallGeometry, wallMaterial);
        const wallRight = new THREE.Mesh(wallGeometry, wallMaterial);

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

        if (dotsVisible)
        {
            // ----Sphere----
            const radius = center.distanceTo(boxSize) / 2;
            const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
            const pointsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: dotSize * size });
            const spherePoints = new THREE.Points(sphereGeometry, pointsMaterial);
            this.mesh.add(spherePoints);
            
            // ----HitSphere----
            const boundingSphere = new THREE.Sphere(spherePoints.position, radius);
        }

        if (hitBoxVisible)
        {
            const helper = new THREE.Box3Helper(this.box, C.GREEN);
            this.mesh.add(helper);
        }
    }
}
