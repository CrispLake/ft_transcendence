import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import * as PongMath from '../math.js';

export class Wall
{
    constructor(length, height, thickness, x, y, z)
    {
        // Wall
        this.geometry = new THREE.BoxGeometry(length, height, thickness);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.WALL, emissive: COLOR.WALL});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(x, y, z);
        this.box = new THREE.Box3();

        // Light
        this.light = new THREE.RectAreaLight(COLOR.WALL, G.wallLightIntensity, length, height);
        this.light.position.copy(this.mesh.position);
        this.light.lookAt(0, 0, 0);

        // Time
        this.clock = new THREE.Clock();
        this.effect = false;
    }

    lightEffect()
    {
        this.effect = true;
        this.mesh.material.emissive.set(COLOR.WALL_LIGHT);
        this.light.color.set(COLOR.WALL_LIGHT);
        this.clock.start();
    }

    updateLightEffect()
    {
        let elapsedTime = this.clock.getElapsedTime();
        let color = PongMath.colorLerp(elapsedTime, 0, G.fadeTimeSec, COLOR.WALL_LIGHT, COLOR.WALL);
        
        this.mesh.material.emissive.set(color);
        this.light.color.set(color);
        if (elapsedTime >= G.fadeTimeSec)
        {
            this.mesh.material.emissive.set(COLOR.WALL);
            this.light.color.set(COLOR.WALL);
            this.effect = false;
        }
    }
}