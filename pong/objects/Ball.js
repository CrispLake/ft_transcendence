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
        this.angle = PongMath.degToRad(G.initialStartingAngle);
        this.speedX = PongMath.deriveXspeed(this.speed, this.angle);
        this.speedZ = PongMath.deriveZspeed(this.speed, this.angle);
        console.log("angle = " + G.initialStartingAngle);
        console.log("ballX = " + this.speedX);
        console.log("ballZ = " + this.speedZ);

        // spinLight
        this.spinLight = new THREE.SpotLight(COLOR.WALL);
        this.spinLight.position.set(0, 0, 0);
        this.spinLight.castShadow = true;
        this.spinLight.angle = Math.PI / 4;
        this.spinLight.intensity = 0.5;
        // this.spinLight.penumbra = 0.01;
        scene.add(this.spinLight);
        this.spinLight2 = new THREE.SpotLight(COLOR.PADDLE);
        this.spinLight2.position.set(0, 0, 0);
        this.spinLight2.castShadow = true;
        this.spinLight2.angle = Math.PI / 4;
        this.spinLight2.intensity = 0.5;
        // this.spinLight2.penumbra = 0.01;
        scene.add(this.spinLight);
        scene.add(this.spinLight2);

        this.spinLightTarget = new THREE.Object3D();
        this.spinLightTarget.position.set(10, -100, 10);
        this.spinLightTarget2 = new THREE.Object3D();
        this.spinLightTarget2.position.set(-10, -100, -10);
        this.spinLight.target = this.spinLightTarget;
        this.spinLight2.target = this.spinLightTarget2;
        scene.add(this.spinLightTarget);
        scene.add(this.spinLightTarget2);
        this.spinRotationAngle = 10;
        //----------
        this.spin = 0;

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

        // spinLight rotation
        this.spinLightRotationSpeed = PongMath.lerp(this.spin, -G.maxSpin, G.maxSpin, -G.maxBallLightRotation, G.maxBallLightRotation);
        this.spinRotationAngle += this.spinLightRotationSpeed;
        if (this.spinRotationAngle > 360) {
            this.spinRotationAngle -= 360;
        }
        this.spinLightTarget.position.x = Math.sin(this.spinRotationAngle) * 360;
        this.spinLightTarget.position.z = Math.cos(this.spinRotationAngle) * 360;        
        this.spinLightTarget2.position.x = -(Math.sin(this.spinRotationAngle) * 360);
        this.spinLightTarget2.position.z = -(Math.cos(this.spinRotationAngle) * 360);        

        //---------

        this.speedX = PongMath.deriveXspeed(this.speed, this.angle);
        this.speedZ = PongMath.deriveZspeed(this.speed, this.angle);
        this.mesh.position.x += this.speedX;
        this.mesh.position.z += this.speedZ;
        this.light.position.copy(this.mesh.position);

        // spinLight position

        this.spinLight.position.copy(this.mesh.position);
        this.spinLight2.position.copy(this.mesh.position);
        this.spinLight.position.y = 0;
        this.spinLight2.position.y = 0;

        // this.spinLight.position.y - 10;
        // this.spinLight2.position.y - 10;
        // this.spinLight.position.y += 1;
        //----------

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