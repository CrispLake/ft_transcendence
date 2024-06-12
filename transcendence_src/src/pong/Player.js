import * as THREE from 'three';
import * as COLOR from './colors.js';
import * as G from './globals.js';

export class Player
{
    constructor(x, y, z, name)
    {
        this.name = name;
        this.geometry = new THREE.BoxGeometry(G.paddleThickness, G.wallHeight, G.paddleLength);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.PADDLE, emissive: COLOR.PADDLE, wireframe: false});
        this.paddle = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.light = new THREE.RectAreaLight(COLOR.PADDLE, G.paddleLightIntensity, G.paddleLength, G.paddleHeight);
        this.score = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.speed = G.initialPaddleSpeed;
        this.setPos(x, y, z);
        this.light.lookAt(0, 0, 0);
    }

    setPos(x, y, z)
    {
        this.paddle.position.set(x, y, z);
        this.light.position.copy(this.paddle.position);
    }

    move(movement)
    {
        this.paddle.position.z += movement;
        this.light.position.copy(this.paddle.position);
    }
};
