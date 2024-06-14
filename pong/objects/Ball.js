import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
import * as PongMath from '../math.js';

export class Ball
{
    constructor(scene, pos)
    {
        this.radius = G.initialBallRadius;
        this.geometry = new THREE.SphereGeometry(G.initialBallRadius, 32, 16);
        this.material = new THREE.MeshBasicMaterial({color: COLOR.BALL});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.light = new THREE.PointLight(COLOR.BALL, 1, 10, 0.5);
        this.setPos(pos.x, pos.y, pos.z);
        this.light.position.copy(this.mesh.position);
        this.speed = G.initialBallSpeed;
        this.angle = G.initialStartingAngle;
        this.speedX = PongMath.deriveXspeed(this.speed, this.angle);
        this.speedZ = PongMath.deriveZspeed(this.speed, this.angle);
        this.addToScene(scene);
    }

    addToScene(scene)
    {
        scene.add(this.mesh);
        scene.add(this.light);
    }

    setPos(x, y, z)
    {
        this.mesh.position.set(x, y, z);
        this.light.position.copy(this.mesh.position);
    }

    setSpeed(speed)
    {
        this.speed = speed;
        this.speedX = PongMath.deriveXspeed(this.speed, this.angle);
        this.speedZ = PongMath.deriveZspeed(this.speed, this.angle);
    }
}