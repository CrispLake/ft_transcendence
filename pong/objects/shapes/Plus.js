import * as THREE from 'three';
import * as COLOR from '../../colors.js';
import * as G from '../../globals.js';

export class Plus
{
    constructor()
    {
        const w = G.plusWidth / 2;
        const l = G.plusLength / 2;
        const r = G.plusWidth / 2 * (G.plusRoundnessPercentage / 100);

        const maxBevelThickness = G.plusThickness / 2;
        const bevelThickness = Math.min(r, maxBevelThickness);
        const bevelSize = 0.3;
        const depth = G.plusThickness - r * 2;
    
        const extrudeSettings = {
            steps: 1,
            depth: depth,
            bevelEnabled: true,
            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelOffset: 0,
            bevelSegments: G.plusBevelSegments,
            curveSegments: G.plusBevelSegments
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
        const material = new THREE.MeshBasicMaterial({color: COLOR.POWER_LIFE_PLUS});
        this.plus = new THREE.Mesh(geometry, material);
        this.plus.position.z -= G.plusThickness / 2 - bevelThickness;

        this.light = new THREE.PointLight(COLOR.POWER_LIFE_PLUS, 1, 5, 0.5);
        this.light.position.set(0, 0, 0);

        this.mesh = new THREE.Group();
        this.mesh.add(this.plus);
        this.mesh.add(this.light);
    }
}
