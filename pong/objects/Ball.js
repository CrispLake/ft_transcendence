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

        // this.material = new THREE.MeshBasicMaterial({color: COLOR.BALL});

        // This shader segments the ball into 4 vertical slices, edit any of the colors below to visally represent spin.
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                color1: { value: new THREE.Color(COLOR.WHITE) },
                color2: { value: new THREE.Color(COLOR.WHITE) },
                color3: { value: new THREE.Color(COLOR.WHITE) },
                color4: { value: new THREE.Color(COLOR.WHITE) },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                uniform vec3 color4;
                varying vec2 vUv;
                void main() {
                    vec3 mixedColor;
                    if (vUv.x < 0.25) {
                        mixedColor = mix(color1, color2, smoothstep(0.0, 0.25, vUv.x));
                    } else if (vUv.x < 0.5) {
                        mixedColor = mix(color2, color3, smoothstep(0.25, 0.5, vUv.x));
                    } else if (vUv.x < 0.75) {
                        mixedColor = mix(color3, color4, smoothstep(0.5, 0.75, vUv.x));
                    } else {
                        mixedColor = mix(color4, color1, smoothstep(0.75, 1.0, vUv.x));
                    }
                    gl_FragColor = vec4(mixedColor, 1.0);
                }
            `,
        });
        //----------
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.light = new THREE.PointLight(COLOR.BALL, 1, 10, 0.5);
        this.setPos(pos.x, pos.y, pos.z);
        this.light.position.copy(this.mesh.position);
        this.speed = G.initialBallSpeed;
        this.spinRotationAngle = 0;
        this.angle = PongMath.degToRad(G.initialStartingAngle);
        this.speedX = PongMath.deriveXspeed(this.speed, this.angle);
        this.speedZ = PongMath.deriveZspeed(this.speed, this.angle);
        this.spin = 0;
        this.spinSetting = spinSetting;
        this.addToScene(scene);
        this.box.setFromObject(this.mesh);
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
        this.box.setFromObject(this.mesh);
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
        this.spinRotationSpeed = PongMath.lerp(this.spin, -G.maxSpin, G.maxSpin, -G.maxBallRotationSpeed, G.maxBallRotationSpeed);
        this.spinRotationAngle += this.spinRotationSpeed;
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
        this.box.setFromObject(this.mesh);
        this.mesh.rotation.set(0, this.spinRotationAngle, 0);

    }

    updateAngle()
    {
        this.angle = PongMath.vector2DToAngle(this.speedX, this.speedZ);
    }
        
    bounceFromPlayer(player)
    {
        let impactPoint;
        if (player.alignment == G.vertical)
            impactPoint = this.mesh.position.z - player.paddle.position.z;
        else
            impactPoint = this.mesh.position.x - player.paddle.position.x;
        let normalizedImpact = impactPoint / (G.paddleLength / 2);
        if (player.playerNum == 1)
            this.angle = PongMath.lerp(normalizedImpact, -1, 1, PongMath.degToRad(180) - G.minAngle, G.minAngle);
        else if (player.playerNum == 2)
            this.angle = PongMath.lerp(normalizedImpact, -1, 1, PongMath.degToRad(180) + G.minAngle, PongMath.degToRad(360) - G.minAngle);
        else if (player.playerNum == 3)
        {
            this.angle = PongMath.lerp(normalizedImpact, -1, 1, PongMath.degToRad(270) + G.minAngle, PongMath.degToRad(450) - G.minAngle);
            this.angle = PongMath.within2Pi(this.angle);
        }
        else if (player.playerNum == 4)
        {
            this.angle = PongMath.lerp(normalizedImpact, -1, 1, PongMath.degToRad(270) - G.minAngle, PongMath.degToRad(90) + G.minAngle);
        }
    }

    wallUp(wall)
    {
        return (wall.alignment == G.horizontal && this.speedZ < 0);
    }

    wallDown(wall)
    {
        return (wall.alignment == G.horizontal && this.speedZ > 0);
    }

    wallLeft(wall)
    {
        return (wall.alignment == G.vertical && this.speedX < 0);
    }

    wallRight(wall)
    {
        return (wall.alignment == G.vertical && this.speedX > 0);
    }

    getDirection(wall)
    {
        if (this.wallLeft(wall))
            return 1;
        if (this.wallRight(wall))
            return 2;
        if (this.wallUp(wall))
            return 3;
        if (this.wallDown(wall))
            return 4;
        return 0;
    }

    bounceFromWall(wall)
    {
        // Get direction to wall from center
        let direction = this.getDirection(wall);

        // Change direction based on wall alignment
        if (wall.alignment == G.vertical)
            this.speedX = -this.speedX;
        else
        this.speedZ = -this.speedZ;

        // Update angle based on the new direction
        this.updateAngle();

        // Change angle based on spin against the wall
        let angleIncrease = PongMath.lerp(this.spin, -G.maxSpin, G.maxSpin, -G.maxAngleIncreaseFromSpinBounce, G.maxAngleIncreaseFromSpinBounce);
        this.angle += angleIncrease;
        this.angle = PongMath.within2Pi(this.angle);

        // Keep angle within reasonable values
        this.angle = PongMath.radToDeg(this.angle);
        if (direction == 1)
        {
            if (this.angle < 270 && this.angle > 180 - G.minAngleFromWall)
                this.angle = 180 - G.minAngleFromWall;
            else if (this.angle > 270 && this.angle < G.minAngleFromWall)
                this.angle = G.minAngleFromWall;
        }
        else if (direction == 2)
        {
            if (this.angle > 90 && this.angle < 180 + G.minAngleFromWall)
                this.angle = 180 + G.minAngleFromWall;
            else if (this.angle < 90 && this.angle > 360 - G.minAngleFromWall)
                this.angle = 360 - G.minAngleFromWall;
        }
        else if (direction == 3)
        {
            if (this.angle > 180 && this.angle < 270 + G.minAngleFromWall)
                this.angle = 270 + G.minAngleFromWall;
            else if (this.angle < 180 && this.angle > 90 - G.minAngleFromWall)
                this.angle = 90 - G.minAngleFromWall;
        }
        else if (direction == 4)
        {
            if (this.angle < 360 && this.angle > 270 - G.minAngleFromWall)
                this.angle = 270 - G.minAngleFromWall;
            else if (this.angle > 0 && this.angle < 90 + G.minAngleFromWall)
                this.angle = 90 + G.minAngleFromWall;
        }
        this.angle = PongMath.degToRad(this.angle);

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