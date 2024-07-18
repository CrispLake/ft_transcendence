import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';
import { Arrow } from '../Arrow.js';

export class PowerPaddleLong
{
    constructor(game)
    {
        this.game = game;
        
        this.arrow1 = new Arrow(COLOR.POWER_PADDLE_LONG, G.arrowEnlargeLightIntensity);
        this.arrow2 = new Arrow(COLOR.POWER_PADDLE_LONG, G.arrowEnlargeLightIntensity);

        this.arrow1.mesh.rotation.z = Math.PI;
        this.arrow1.mesh.position.z -= G.shaftLength * 1.1;
        this.arrow2.mesh.position.z += G.shaftLength * 1.1;

        this.mesh = new THREE.Group();
        this.mesh.add(this.arrow1.mesh);
        this.mesh.add(this.arrow2.mesh);
        this.mesh.position.y += G.arrowThickness * G.sizeMultiplier;

        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_PADDLE_LONG;
        this.message = "Enlarge paddle";
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        if (player.paddleLength < G.maxPaddleLength)
        {
            let newPaddleLength = player.paddleLength + G.paddleSizeIncrement;
            if (newPaddleLength > G.maxPaddleLength)
                newPaddleLength = G.maxPaddleLength;
            player.resize(newPaddleLength);
        }
    }
}