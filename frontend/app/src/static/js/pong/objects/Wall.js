import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import * as PongMath from '../math.js';

export class Wall
{
    constructor(alignment, length, height, thickness, x, y, z)
    {
        this.alignment = alignment;

        // Wall
        this.geometry = new THREE.BoxGeometry(length, height, thickness);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.WALL, emissive: COLOR.WALL});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(x, y, z);
        this.box = new THREE.Box3();

        if (this.alignment == G.vertical)
            this.geometry.rotateY(Math.PI / 2);

        // Light
        this.light = new THREE.RectAreaLight(COLOR.WALL, G.wallLightIntensity, length, height);
        this.light.position.copy(this.mesh.position);
        this.setLightDirection();

        // Time
        this.clock = new THREE.Clock();
        this.effect = false;

        this.bounce = false;
    }

    setLightDirection()
    {
        if (this.alignment == G.vertical)
        {
            if (this.mesh.position.x > 0)
                this.light.lookAt(this.mesh.position.x - 1, 0, this.mesh.position.z);
            else
                this.light.lookAt(this.mesh.position.x + 1, 0, this.mesh.position.z);
        }
        else
        {
            if (this.mesh.position.z > 0)
                this.light.lookAt(this.mesh.position.x, 0, this.mesh.position.z - 1);
            else
                this.light.lookAt(this.mesh.position.x, 0, this.mesh.position.z + 1);
        }
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