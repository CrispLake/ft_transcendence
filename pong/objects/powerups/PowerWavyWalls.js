import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';
import { WavyWall } from '../shapes/WavyWall.js';
import { WavyWall2 } from '../shapes/WavyWall2.js';
import { Arrow } from '../shapes/Arrow.js';

export class PowerWavyWalls
{
    constructor(game)
    {
        this.game = game;
        this.power = G.POWER_WAVY_WALLS;
        this.message = "Wavy Walls";

        this.arenaModel = new WavyWall2();
        
        this.light = new THREE.PointLight(COLOR.POWER_WAVY_WALLS, 1, 5, 0.5);

        this.mesh = new THREE.Group();
        this.mesh.add(this.arenaModel.mesh);
        this.mesh.add(this.light);
        
        this.hitbox = new THREE.Sphere(this.mesh.position, G.powerupSphereRadius);
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
    }

    activate(player)
    {
        console.log(this.message);
        this.game.powerupManager.wavyWalls = true;
        this.game.powerupManager.wavyWallsTimer.start();
    }
}