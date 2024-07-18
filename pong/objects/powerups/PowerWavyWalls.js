import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';

export class PowerWavyWalls
{
    constructor(game)
    {
        this.game = game;
        this.geometry = new THREE.BoxGeometry(G.powerupSize, G.powerupSize, G.powerupSize);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.POWER_WAVY_WALLS, emissive: COLOR.POWER_WAVY_WALLS});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_WAVY_WALLS;
        this.message = "Wavy Walls";
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