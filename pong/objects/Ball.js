import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
import * as PongMath from '../math.js';

export class Ball
{
    constructor(scene, pos, spinSetting)
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
        this.spin = 0;
        this.spinSetting = spinSetting;
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
        this.speedX = PongMath.deriveXspeed(this.speed, this.angle);
        this.speedZ = PongMath.deriveZspeed(this.speed, this.angle);
        this.mesh.position.x += this.speedX;
        this.mesh.position.z += this.speedZ;
        this.light.position.copy(this.mesh.position);
    }

    updateAngle()
    {
        this.angle = PongMath.vector2DToAngle(this.speedX, this.speedZ);
    }
        
    adjustAngle(paddle)
    {
        const incomingAngle = PongMath.vector2DToAngle(this.speedX, this.speedZ);
        let impactPoint = this.mesh.position.z - paddle.position.z;
        let normalizedImpact = impactPoint / (G.paddleLength / 2);
        this.angle = PongMath.lerp(normalizedImpact, -1, 1, G.minAngle, G.maxAngle);
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

    adjustSpin(player)
    {
        if (this.spinSetting == false) return ;

        if (!player.moveLeft && !player.moveRight)
            this.reduceSpin();
        else
        {
            let spinPower = ((player.moveLeft) ? 1 : -1) * player.sign * player.boostAmount;
            spinPower = PongMath.lerp(spinPower, -G.maxBoost, G.maxBoost, -G.maxSpin, G.maxSpin);
            this.addSpin(spinPower);
        }
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