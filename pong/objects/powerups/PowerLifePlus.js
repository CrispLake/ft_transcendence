import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';

export class PowerLifePlus
{
    constructor(game)
    {
        this.game = game;
        this.power = G.POWER_LIFE_PLUS;
        this.message = "Life Plus";

        this.createPlus();
        this.createLight();
        this.createHitbox();
        this.adjustPositions();
        this.createMesh();
    }

    //--------------------------------------------------------------------------
    //  INITIALIZE
    //--------------------------------------------------------------------------

    createPlus()
    {
        this.thickness = G.plusThickness * G.plusMultiplier;
        this.width = G.plusWidth * G.plusMultiplier;
        this.length = G.plusLength * G.plusMultiplier;

        const w = this.width / 2;
        const l = this.length / 2;
        const r = this.width / 2 * (G.plusRoundnessPercentage / 100);

        const maxBevelThickness = this.thickness / 2;
        this.bevelThickness = Math.min(r, maxBevelThickness);
        const bevelSize = 0.3 * G.plusMultiplier;
        const depth = this.thickness - r * 2;

        const extrudeSettings = {
            steps: 1,
            depth: depth,
            bevelEnabled: true,
            bevelThickness: this.bevelThickness,
            bevelSize: bevelSize,
            bevelOffset: 0,
            bevelSegments: G.plusSegments,
            curveSegments: G.plusSegments
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
    }

    createLight()
    {
        this.light = new THREE.PointLight(COLOR.POWER_LIFE_PLUS, 1, 5, 0.5);
        this.light.position.set(0, 0, 0);
    }

    createHitbox()
    {
        const boxGeometry = new THREE.BoxGeometry(this.length + this.bevelThickness * 2, this.length + this.bevelThickness * 2, this.thickness);
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, visible: false }); // Set visible to true to visualize
        this.boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        
        this.box = new THREE.Box3();
        this.box.setFromObject(this.boxMesh);
    }

    adjustPositions()
    {
        this.plus.position.z -= this.thickness / 2 - this.bevelThickness;
        this.plus.position.y += this.length / 2;
        this.light.position.y += this.length / 2;
        this.boxMesh.position.y += this.length / 2;
    }

    createMesh()
    {
        this.mesh = new THREE.Group();
        this.mesh.add(this.plus);
        this.mesh.add(this.light);
        this.mesh.add(this.boxMesh);
    }

    //--------------------------------------------------------------------------
    //  PUBLIC FUNCTIONS
    //--------------------------------------------------------------------------

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.boxMesh);
    }

    activate(player)
    {
        console.log(this.message);
        if (player.lives < G.lives)
        {
            player.lives++;
            player.setLife(player.lives);
        }
    }
}