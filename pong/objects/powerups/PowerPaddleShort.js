import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';
import { Arrow } from '../Arrow.js';

export class PowerPaddleShort
{
    constructor(game)
    {
        this.game = game;
        
        const arrow1 = new Arrow(COLOR.POWER_PADDLE_SHORT);
        const arrow2 = new Arrow(COLOR.POWER_PADDLE_SHORT);

        arrow1.mesh.rotation.z = Math.PI;
        arrow1.mesh.position.z += G.headLength * 1.8;
        arrow2.mesh.position.z -= G.headLength * 1.8;

        this.mesh = new THREE.Group();
        this.mesh.add(arrow1.mesh);
        this.mesh.add(arrow2.mesh);
        this.mesh.position.y += G.arrowThickness * G.sizeMultiplier;

        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_PADDLE_LONG;
        this.message = "Shrink paddle";
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        if (player.paddleLength > G.minPaddleLength)
        {
            let newPaddleLength = player.paddleLength - G.paddleSizeIncrement;
            if (newPaddleLength < G.minPaddleLength)
                newPaddleLength = G.minPaddleLength;
            player.resize(newPaddleLength);
        }
    }
}