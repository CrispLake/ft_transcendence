import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';
import { WavyWall } from '../shapes/WavyWall.js';
import { Arrow } from '../shapes/Arrow.js';

export class PowerWavyWalls
{
    constructor(game)
    {
        this.game = game;
        this.power = G.POWER_WAVY_WALLS;
        this.message = "Wavy Walls";

        this.arenaModel = new WavyWall();
        
        this.light = new THREE.PointLight(COLOR.POWER_WAVY_WALLS, 1, 5, 0.5);

        this.mesh = new THREE.Group();
        this.mesh.add(this.arenaModel.mesh);
        this.mesh.add(this.light);
        
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        this.game.powerupManager.wavyWalls = true;
        this.game.powerupManager.wavyWallsTimer.start();
    }
}