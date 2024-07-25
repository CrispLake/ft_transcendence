import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';

export class Arrow
{
    constructor(sizeMultiplier, color, intensity)
    {
        // ----Light----

        const light = new THREE.PointLight(color, intensity, 5, 0.5);
        light.position.set(0, 0, 0);


        // ----Head----

        const head = new THREE.Shape();
        const material = new THREE.MeshBasicMaterial({color: color});

        head.moveTo( 0, G.headLength * sizeMultiplier );
        head.lineTo( -G.headWidthOffset * sizeMultiplier, 0 );
        head.lineTo( G.headWidthOffset * sizeMultiplier, 0 );
        head.lineTo( 0, G.headLength * sizeMultiplier );

        const headGeometry = new THREE.ExtrudeGeometry(head, G.extrudeSettings);
        const headMesh = new THREE.Mesh(headGeometry, material);


        // ----Shaft----

        const shaft = new THREE.Shape();

        shaft.moveTo( -G.shaftWidthOffset * sizeMultiplier, 0 );
        shaft.lineTo( G.shaftWidthOffset * sizeMultiplier, 0 );
        shaft.lineTo( G.shaftWidthOffset * sizeMultiplier, -G.shaftLength * sizeMultiplier );
        shaft.lineTo( -G.shaftWidthOffset * sizeMultiplier, -G.shaftLength * sizeMultiplier );
        shaft.lineTo( -G.shaftWidthOffset * sizeMultiplier, 0 );

        const shaftGeometry = new THREE.ExtrudeGeometry(shaft, G.extrudeSettings);
        const shaftMesh = new THREE.Mesh(shaftGeometry, material);


        // ----Group----

        this.mesh = new THREE.Group();
        this.mesh.add(light);
        this.mesh.add(headMesh);
        this.mesh.add(shaftMesh);
        this.mesh.rotation.x = Math.PI / 2;
    }
}