import * as THREE from 'three';
import * as C from '../pong/colors.js';

export class Plus
{
    constructor(size, width, length, thickness, roundPercentage, segments, hitBoxVisible)
    {
        const multiplier = size;
        const adjustedThickness = thickness * multiplier;
        const adjustedWidth = width * multiplier;
        const adjustedLength = length * multiplier;

        const w = adjustedWidth / 2;
        const l = adjustedLength / 2;
        const r = adjustedWidth / 2 * (roundPercentage / 100);

        const maxBevelThickness = adjustedThickness / 2;
        const bevelThickness = Math.min(r, maxBevelThickness);
        const bevelSize = 0.3 * multiplier;
        const depth = adjustedThickness - r * 2;
    
        const extrudeSettings = {
            steps: 1,
            depth: depth,
            bevelEnabled: true,
            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelOffset: 0,
            bevelSegments: segments,
            curveSegments: segments
        };
    
        const shape = new THREE.Shape();
        shape.moveTo(-w + r, l);
        shape.lineTo(w - r, l);
        shape.quadraticCurveTo(w, l, w, l - r);
        shape.lineTo(w, w);
        shape.lineTo(l - r, w);
        shape.quadraticCurveTo(l, w, l, w - r);
        shape.lineTo(l, -w + r);
        shape.quadraticCurveTo(l, -w, l - r, -w);
        shape.lineTo(w, -w);
        shape.lineTo(w, -l + r);
        shape.quadraticCurveTo(w, -l, w - r, -l);
        shape.lineTo(-w + r, -l);
        shape.quadraticCurveTo(-w, -l, -w, -l + r);
        shape.lineTo(-w, -w);
        shape.lineTo(-l + r, -w);
        shape.quadraticCurveTo(-l, -w, -l, -w + r);
        shape.lineTo(-l, w - r);
        shape.quadraticCurveTo(-l, w, -l + r, w);
        shape.lineTo(-w, w);
        shape.lineTo(-w, l - r);
        shape.quadraticCurveTo(-w, l, -w + r, l);
    
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({color: C.GREEN});
        this.plus = new THREE.Mesh(geometry, material);
        this.plus.position.z -= adjustedThickness / 2 - bevelThickness;

        // Create the hitbox as a Box3
        const boxSize = new THREE.Vector3(adjustedLength + bevelThickness * 2, adjustedLength + bevelThickness * 2, adjustedThickness);
        this.box = new THREE.Box3();
        this.box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), boxSize);
        
        this.mesh = new THREE.Group();
        this.mesh.add(this.plus);

        if (hitBoxVisible)
        {
            const helper = new THREE.Box3Helper(this.box, C.PURPLE);
            this.mesh.add(helper);
        }

        console.log("---------------------------------");
        console.log("roundPerc = " + roundPercentage);
        console.log("---------------------------------");
        console.log("width     = " + adjustedWidth);
        console.log("length    = " + adjustedLength);
        console.log("thickness = " + adjustedThickness);
        console.log("---------------------------------");
        console.log("radius            = " + r);
        console.log("maxBevelThickness = " + maxBevelThickness);
        console.log("bevelThickness    = " + bevelThickness);
        console.log("depth             = " + depth);
        console.log("---------------------------------");
        console.log("");
    }
}
