import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';
import { Plus } from '../shapes/Plus.js';

export class PowerLifePlus
{
    constructor(game)
    {
        this.game = game;
        this.power = G.POWER_LIFE_PLUS;
        this.message = "Life Plus";

        this.model = new Plus();

        // ----Scale model to fit sphere----
        const boundingBox = new THREE.Box3().setFromObject(this.model.mesh);
        const modelSize = new THREE.Vector3();
        boundingBox.getSize(modelSize);
        const boundingBoxDiagonal = modelSize.length();
        const ratio = G.powerupSphereRadius * 2 / boundingBoxDiagonal;
        this.model.mesh.scale.set(ratio, ratio, ratio);

        // ----Sphere----
        const sphereGeometry = new THREE.SphereGeometry(G.powerupSphereRadius, G.powerupSphereSegments, G.powerupSphereSegments);
        const pointsMaterial = new THREE.MeshBasicMaterial({ color: COLOR.POWERUP_SPHERE, opacity: G.powerupSphereOpacity, transparent: true, wireframe: false });
        const auraSphere = new THREE.Mesh(sphereGeometry, pointsMaterial);
        
        // ----Group sphere with model----
        this.mesh = new THREE.Group();
        this.mesh.add(this.model.mesh);
        this.mesh.add(auraSphere);

        this.mesh.position.set(0, G.powerupSphereRadius * 2, 0);

        // ----Create hitbox----
        this.hitbox = new THREE.Sphere(this.mesh.position, G.powerupSphereRadius);
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
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