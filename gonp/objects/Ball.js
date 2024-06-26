import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
import * as PongMath from '../math.js';

const PENUMBRA = 0.1;
const INTENSITY = 5;
const ANGLE = 0.9;
const QUARTER = Math.PI / 2; 

class SpinLight {
    constructor(color, angle, intensity, penumbra, position, targetPosition, scene) {
        this.light = new THREE.SpotLight(color);
        this.light.position.set(...position);
        this.light.castShadow = true;
        this.light.angle = angle;
        this.light.intensity = intensity;
        this.light.penumbra = penumbra;

        this.target = new THREE.Object3D();
        this.target.position.set(...targetPosition);
        this.light.target = this.target;

        scene.add(this.light);
        scene.add(this.target);
    }
}

export class Ball
{
    constructor(scene, pos)
    {
        this.radius = G.initialBallRadius;
        this.geometry = new THREE.SphereGeometry(G.initialBallRadius, 32, 16);
        this.material = new THREE.MeshBasicMaterial({color: COLOR.BALL});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.light = new THREE.PointLight(COLOR.BALL, 1, 0.1, 0);
        this.setPos(pos.x, pos.y, pos.z);
        this.light.position.copy(this.mesh.position);
        this.speed = G.initialBallSpeed;
        this.angle = PongMath.degToRad(G.initialStartingAngle);
        this.speedX = PongMath.deriveXspeed(this.speed, this.angle);
        this.speedZ = PongMath.deriveZspeed(this.speed, this.angle);
        console.log("angle = " + G.initialStartingAngle);
        console.log("ballX = " + this.speedX);
        console.log("ballZ = " + this.speedZ);


        // spinLight
        const positions = [
            [0, -0.24, 0],
            [0, -0.24, 0],
            [0, -0.24, 0],
            [0, -0.24, 0]
        ];
        const targetPositions = [
            [1, -0.24, 0],
            [0, -0.24, -1],
            [0, -0.24, 1],
            [-1, -0.24, 0]
        ];
        this.spinLights = [];
        const colors = [COLOR.WALL, COLOR.PADDLE, COLOR.WALL, COLOR.PADDLE];
        for (let i = 0; i < positions.length; i++) {
            this.spinLights.push(new SpinLight(colors[i], ANGLE, INTENSITY, PENUMBRA, positions[i], targetPositions[i], scene));
        }
        //----------
        this.spin = 0;
        this.spinRotationAngle = 0;
        
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

    speedUp()
    {
        this.speed = PongMath.calculate2DSpeed(this.speedX, this.speedZ);
        this.setSpeed(this.speed + G.speedIncrement);
    }
    move()
    {
        // return ;
        // spinLight rotation
        this.spinLightRotationSpeed = PongMath.lerp(this.spin, -G.maxSpin, G.maxSpin, -G.maxBallLightRotation, G.maxBallLightRotation);
        this.spinRotationAngle += this.spinLightRotationSpeed;
        if (this.spinRotationAngle > Math.PI * 2) {
            this.spinRotationAngle -= Math.PI * 2;
        }
        else if (this.spinRotationAngle < Math.PI * 2) {
            this.spinRotationAngle += Math.PI * 2;
        }
        
        this.speedX = PongMath.deriveXspeed(this.speed, this.angle);
        this.speedZ = PongMath.deriveZspeed(this.speed, this.angle);
        this.mesh.position.x += this.speedX;
        this.mesh.position.z += this.speedZ;
        this.light.position.copy(this.mesh.position);
        
        for (let i = 0; i < this.spinLights.length; i++) {
            this.spinLights[i].target.position.x = Math.sin(this.spinRotationAngle + (QUARTER * i)) * 360;
            this.spinLights[i].target.position.z = Math.cos(this.spinRotationAngle + (QUARTER * i)) * 360;        
            this.spinLights[i].light.position.copy(this.mesh.position);
            this.spinLights[i].light.position.y = -0.24;
        }

    }

    updateAngle()
    {
        this.angle = PongMath.vector2DToAngle(this.speedX, this.speedZ);
    }

    addSpin(power)
    {
        if ((this.spin < 0 && power < 0) || (this.spin > 0 && power > 0))
            this.spin += power;
        else
            this.spin = power;
        if (this.spin > G.maxSpin)
            this.spin = G.maxSpin;
        else if (this.spin < -G.maxSpin)
            this.spin = -G.maxSpin;
    }

    reduceSpin()
    {
        this.spin *= (100 - G.spinReduction) / 100;
        // if (this.spin < 0.05)
        //     this.spin = 0;
    }

    affectBySpin()
    {
        this.angle += this.spin;
        this.angle = PongMath.within2Pi(this.angle);
    }

    reset()
    {
        this.setPos(0, 0, 0);
        this.angle = PongMath.degToRad(G.initialStartingAngle);
        this.setSpeed(G.initialBallSpeed);
        this.spin = 0;
    }
}