import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';
import { Arrow } from '../shapes/Arrow.js';

export class PowerPaddleShort
{
    constructor(game)
    {
        this.game = game;
        this.power = G.POWER_PADDLE_SHORT;
        this.message = "Shrink paddle";
        
        // ----Arrows----
        const sizeMultiplier = 1;
        this.arrow1 = new Arrow(sizeMultiplier, G.arrowThickness, COLOR.POWER_PADDLE_SHORT);
        this.arrow2 = new Arrow(sizeMultiplier, G.arrowThickness, COLOR.POWER_PADDLE_SHORT);

        this.arrow1.mesh.rotation.z = Math.PI;
        this.arrow1.mesh.position.z -= G.arrowHeadLength * 1.3;
        this.arrow2.mesh.position.z += G.arrowHeadLength * 1.3;

        // ----Group arrows together----
        this.model = new THREE.Group();
        this.model.add(this.arrow1.mesh);
        this.model.add(this.arrow2.mesh);

        // ----Scale arrows to fit sphere----
        const boundingBox = new THREE.Box3().setFromObject(this.model);
        const modelSize = new THREE.Vector3();
        boundingBox.getSize(modelSize);
        const boundingBoxDiagonal = modelSize.length();
        const ratio = G.powerupSphereRadius * 2 / boundingBoxDiagonal;
        this.model.scale.set(ratio, ratio, ratio);

        // ----Sphere----
        const sphereGeometry = new THREE.SphereGeometry(G.powerupSphereRadius, G.powerupSphereSegments, G.powerupSphereSegments);
        const pointsMaterial = new THREE.MeshBasicMaterial({ color: COLOR.POWERUP_SPHERE, opacity: G.powerupSphereOpacity, transparent: true, wireframe: false });
        const auraSphere = new THREE.Mesh(sphereGeometry, pointsMaterial);
        
        // ----Group sphere with model----
        this.mesh = new THREE.Group();
        this.mesh.add(this.model);
        this.mesh.add(auraSphere);

        // ----Create hitbox----
        this.hitbox = new THREE.Sphere(this.mesh.position, G.powerupSphereRadius);
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
    }

    activate(player)
    {
        if (player.paddleLength > G.minPaddleLength)
        {
            let newPaddleLength = player.paddleLength - G.paddleSizeIncrement;
            if (newPaddleLength < G.minPaddleLength)
                newPaddleLength = G.minPaddleLength;
            player.resize(newPaddleLength);
        }
    }
}
