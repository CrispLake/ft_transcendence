import * as THREE from 'three';
import * as G from '../../globals.js';

export class Arrow
{
    constructor(sizeMultiplier, thickness, color)
    {
        // Implement multiplier
        let headWidth = G.arrowHeadWidth * sizeMultiplier;
        let headLength = G.arrowHeadLength * sizeMultiplier;
        let shaftWidth = G.arrowShaftWidth * sizeMultiplier;
        let shaftLength = G.arrowShaftLength * sizeMultiplier;
        const adjustedThickness = thickness * sizeMultiplier;

        // Make sure values are plausible
        if (headWidth < 0) {headWidth = 0;}
        if (headLength < 0) {headLength = 0;}
        if (shaftWidth < 0) {shaftWidth = 0;}
        if (shaftLength < 0) {shaftLength = 0;}
        if (headWidth < shaftWidth)
            headWidth = shaftWidth;
        let radius = Math.min((headWidth - shaftWidth) / 2, shaftWidth / 2);
        radius = Math.min(radius, G.arrowRadius);

        // Calculate coordinates for Bezier curves for the head triangle
        const tipAngle = Math.atan2(headWidth / 2, headLength);
        const tipRadiusX = radius * Math.sin(tipAngle);
        const tipRadiusY = radius * Math.cos(tipAngle);

        const sideAngle = Math.atan2(headLength, headWidth / 2);
        const sideRadiusY = radius * Math.sin(sideAngle);
        const sideRadiusX = radius * Math.cos(sideAngle);

        // Create arrow shape with rounded corners
        const shape = new THREE.Shape();
        shape.moveTo(-shaftWidth/2, 0);
        shape.lineTo(-headWidth/2 + radius, 0);
        shape.quadraticCurveTo(-headWidth/2, 0, -headWidth/2 + sideRadiusX, sideRadiusY);
        shape.lineTo(-tipRadiusX, headLength - tipRadiusY);
        shape.quadraticCurveTo(0, headLength, tipRadiusX, headLength - tipRadiusY);
        shape.lineTo(headWidth/2 - sideRadiusX, sideRadiusY);
        shape.quadraticCurveTo(headWidth/2, 0, headWidth/2 - radius, 0);
        shape.lineTo(shaftWidth/2, 0);
        shape.lineTo(shaftWidth/2, -(shaftLength - radius));
        shape.quadraticCurveTo(shaftWidth/2, -shaftLength, shaftWidth/2 - radius, -shaftLength);
        shape.lineTo(-(shaftWidth/2 - radius), -shaftLength);
        shape.quadraticCurveTo(-shaftWidth/2, -shaftLength, -shaftWidth/2, -(shaftLength - radius));
        shape.lineTo(-shaftWidth/2, 0);

        // Calculate bevel sizes
        const maxBevelThickness = adjustedThickness / 2;
        const adjustedBevelThickness = Math.min(G.arrowBevelThickness, maxBevelThickness);
        const bevelSize = 0.3 * sizeMultiplier;
        const depth = adjustedThickness - radius * 2;
        
        const extrudeSettings = {
            steps: 1,
            depth: depth,
            bevelEnabled: true,
            bevelThickness: adjustedBevelThickness,
            bevelSize: bevelSize,
            bevelOffset: 0,
            bevelSegments: G.arrowBevelSegments,
            curveSegments: G.arrowBevelSegments
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshBasicMaterial({color: color});
        const arrow = new THREE.Mesh(geometry, material);
        arrow.position.y = (shaftLength - headLength) / 2;
        arrow.position.z -= depth / 2;
        

        // ----Light----

        const light = new THREE.PointLight(color, 1, 5, 0.5);
        light.position.set(0, 0, 0);

        // ----Group----

        this.mesh = new THREE.Group();
        this.mesh.add(arrow);
        this.mesh.add(light);
        this.mesh.rotation.x = -(Math.PI / 2);
    }
}