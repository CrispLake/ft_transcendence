import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';

export class Arrow
{
    constructor(sizeMultiplier, thickness, headWidth, headLength, shaftWidth, shaftLength, radius, bevelThickness, bevelSegments)
    {
        // Implement multiplier
        let headW = headWidth * sizeMultiplier;
        let headL = headLength * sizeMultiplier;
        let shaftW = shaftWidth * sizeMultiplier;
        let shaftL = shaftLength * sizeMultiplier;
        const adjustedThickness = thickness * sizeMultiplier;

        // Make sure values are plausible
        if (headW < 0) {headW = 0;}
        if (headL < 0) {headL = 0;}
        if (shaftW < 0) {shaftW = 0;}
        if (shaftL < 0) {shaftL = 0;}
        if (headW < shaftW)
            headW = shaftW;
        let r = Math.min((headW - shaftW) / 2, shaftW / 2);
        r = Math.min(r, radius);

        // Calculate coordinates for Bezier curves for the head triangle
        const tipAngle = Math.atan2(headW / 2, headL);
        const tipRadiusX = r * Math.sin(tipAngle);
        const tipRadiusY = r * Math.cos(tipAngle);

        const sideAngle = Math.atan2(headL, headW / 2);
        const sideRadiusY = r * Math.sin(sideAngle);
        const sideRadiusX = r * Math.cos(sideAngle);

        // Create arrow shape with rounded corners
        const shape = new THREE.Shape();
        shape.moveTo(-shaftW/2, 0);
        shape.lineTo(-headW/2 + r, 0);
        shape.quadraticCurveTo(-headW/2, 0, -headW/2 + sideRadiusX, sideRadiusY);
        shape.lineTo(-tipRadiusX, headL - tipRadiusY);
        shape.quadraticCurveTo(0, headL, tipRadiusX, headL - tipRadiusY);
        shape.lineTo(headW/2 - sideRadiusX, sideRadiusY);
        shape.quadraticCurveTo(headW/2, 0, headW/2 - r, 0);
        shape.lineTo(shaftW/2, 0);
        shape.lineTo(shaftW/2, -(shaftL - r));
        shape.quadraticCurveTo(shaftW/2, -shaftL, shaftW/2 - r, -shaftL);
        shape.lineTo(-(shaftW/2 - r), -shaftL);
        shape.quadraticCurveTo(-shaftW/2, -shaftL, -shaftW/2, -(shaftL - r));
        shape.lineTo(-shaftW/2, 0);

        // Calculate bevel sizes
        const maxBevelThickness = adjustedThickness / 2;
        const adjustedBevelThickness = Math.min(bevelThickness, maxBevelThickness);
        const bevelSize = 0.3 * sizeMultiplier;
        const depth = adjustedThickness - r * 2;
        
        const extrudeSettings = {
            steps: 1,
            depth: depth,
            bevelEnabled: true,
            bevelThickness: adjustedBevelThickness,
            bevelSize: bevelSize,
            bevelOffset: 0,
            bevelSegments: bevelSegments,
            curveSegments: bevelSegments
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({color: COLOR.WHITE});
        const arrow = new THREE.Mesh(geometry, material);
        arrow.position.y = (shaftL - headL) / 2;
        arrow.position.z -= depth / 2;
        

        // ----Light----

        const light = new THREE.PointLight(COLOR.WHITE, 10, 5, 0.5);
        light.position.set(0, 0, 0);

        // ----Group----

        this.mesh = new THREE.Group();
        this.mesh.add(arrow);
        this.mesh.add(light);
        this.mesh.rotation.x = -(Math.PI / 2);

        // ----Hitbox----

        const boxSize = new THREE.Vector3(headW + bevelSize * 2, headL + shaftL + bevelSize * 2, depth + adjustedBevelThickness * 2);
        this.box = new THREE.Box3();
        this.box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), boxSize);

        const helper = new THREE.Box3Helper(this.box, COLOR.PURPLE);
        this.mesh.add(helper);
    }
}