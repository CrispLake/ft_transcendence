import * as THREE from 'three';
import * as COLOR from '../../colors.js';
import * as G from '../../globals.js';
import { Arrow } from './Arrow.js';

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
        this.arrow1.mesh.position.y = -totalHeight / 2 + adjustedFloorThickness / 2 + (thickness + bevelThickness) / 2;
        this.arrow2.mesh.position.y = -totalHeight / 2 + adjustedFloorThickness / 2 + (thickness + bevelThickness) / 2;


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
            const helper = new THREE.Box3Helper(this.box, COLOR.GREEN);
            this.mesh.add(helper);
        }
    }
}

// export class WavyWall
// {
//     constructor()
//     {
//         const adjustedFloorThickness = G.wavyFloorThickness * G.wavyMultiplier;
//         const adjustedWidth = G.wavyWidth * G.wavyMultiplier;
//         const adjustedLength = G.wavyLength * G.wavyMultiplier;
//         const adjustedWallHeight = G.wavyWallHeight * G.wavyMultiplier;
//         let adjustedWallThickness = G.wavyWallThickness * G.wavyMultiplier;
//         if (adjustedWallThickness > adjustedWidth / 2)
//             adjustedWallThickness = adjustedWidth / 2;
//         const totalHeight = adjustedFloorThickness + adjustedWallHeight;

//         // ----Floor----
//         const floorGeometry = new THREE.BoxGeometry(adjustedLength, adjustedFloorThickness, adjustedWidth);
//         const floorMaterial = new THREE.MeshBasicMaterial({color: COLOR.GRAY});
//         const floor = new THREE.Mesh(floorGeometry, floorMaterial);

//         // ----Walls----
//         const wallGeometry = new THREE.BoxGeometry(adjustedLength, adjustedWallHeight, adjustedWallThickness);
//         const wallMaterial = new THREE.MeshBasicMaterial({color: COLOR.PURPLE});
//         const wallLeft = new THREE.Mesh(wallGeometry, wallMaterial);
//         const wallRight = new THREE.Mesh(wallGeometry, wallMaterial);

//         // ----Arrows----
//         const sizeMultiplier = 0.2
//         const thickness = 0.8;
//         const arrowLightIntensity = 10;
//         const headWidth = 3;
//         const headLength = 1.5;
//         const shaftWidth = 1;
//         const shaftLength = 1.5;
//         const radius = 0.1;
//         const bevelThickness = 0.2;
//         const bevelSegments = 8;
//         this.arrow1 = new Arrow(sizeMultiplier, thickness, headWidth, headLength, shaftWidth, shaftLength, radius, bevelThickness, bevelSegments, COLOR.WHITE, arrowLightIntensity);
//         this.arrow2 = new Arrow(sizeMultiplier, thickness, headWidth, headLength, shaftWidth, shaftLength, radius, bevelThickness, bevelSegments, COLOR.WHITE, arrowLightIntensity);


//         // ----Positions----
//         floor.position.set(0, (adjustedFloorThickness - totalHeight) / 2, 0);
//         wallLeft.position.set(0, (totalHeight - adjustedWallHeight) / 2, (adjustedWidth - adjustedWallThickness) / 2);
//         wallRight.position.set(0, (totalHeight - adjustedWallHeight) / 2, (adjustedWallThickness - adjustedWidth) / 2);

//         // ----Vectors----
//         const center = new THREE.Vector3(0, 0, 0);
//         const boxSize = new THREE.Vector3(adjustedLength, totalHeight, adjustedWidth);
        
//         // ----Hitbox----
//         this.box = new THREE.Box3();
//         this.box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), boxSize);

//         // ----Group----
//         this.mesh = new THREE.Group();
//         this.mesh.add(floor);
//         this.mesh.add(wallLeft);
//         this.mesh.add(wallRight);
//         this.mesh.add(this.arrow1.mesh);
//         this.mesh.add(this.arrow2.mesh);

//         if (G.dotsVisible)
//         {
//             // ----Sphere----
//             const radius = center.distanceTo(boxSize) / 2;
//             const sphereGeometry = new THREE.SphereGeometry(radius, G.wavyWidthSegments, G.wavyHeightSegments);
//             const pointsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: G.wavyDotSize * G.wavyMultiplier });
//             const spherePoints = new THREE.Points(sphereGeometry, pointsMaterial);
//             this.mesh.add(spherePoints);
            
//             // ----HitSphere----
//             const boundingSphere = new THREE.Sphere(spherePoints.position, radius);
//         }

//         if (G.hitBoxVisible)
//         {
//             const helper = new THREE.Box3Helper(this.box, COLOR.GREEN);
//             this.mesh.add(helper);
//         }
//     }
// }
