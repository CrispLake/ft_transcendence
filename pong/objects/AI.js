import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
// import * as SETTINGS from '../gameSetting.js';
import * as PongMath from '../math.js';

export class AI
{
    constructor(game, pos, name)
    {
		this.game = game;
        this.scene = game.scene;
        this.name = name;
        this.sign = (pos.x > 0) ? 1 : -1;
        this.color = (this.sign == -1) ? COLOR.PADDLE1 : COLOR.PADDLE2;
        this.colorLight = (this.sign == -1) ? COLOR.PADDLE1_LIGHT : COLOR.PADDLE2_LIGHT;
        this.geometry = new THREE.BoxGeometry(G.paddleThickness, G.wallHeight, G.paddleLength);
        this.material = new THREE.MeshStandardMaterial({color: this.color, emissive: this.color});
        this.paddle = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.light = new THREE.RectAreaLight(this.color, G.paddleLightIntensity, G.paddleLength, G.paddleHeight);
        this.boostGeometry = new THREE.BoxGeometry(G.boostMeterWidth, G.boostMeterThickness, 0);
        this.boostMaterial = new THREE.MeshStandardMaterial({color: COLOR.BOOSTMETER, emissive: COLOR.BOOSTMETER})
        this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostMaterial);
        this.paddleLength = G.paddleLength;
        this.score = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.boostPressed = false;
        this.boostAmount = 0;
        this.speed = G.initialPaddleSpeed;
        this.boostOffset = G.boostOffset * this.sign;
        this.setPos(pos.x, pos.y, pos.z);
        this.light.lookAt(0, 0, 0);
        this.addToScene();
        this.clockLight = new THREE.Clock();
        this.effect = false;
    }
        

    // ----Boost Meter----

    removeBoostMeter()
    {
        this.scene.remove(this.boostMeter);
        this.boostGeometry.dispose();
    }

    updateBoostMeter()
    {
        this.removeBoostMeter();
        if (this.boostAmount != 0)
        {
            this.boostGeometry = new THREE.BoxGeometry(G.boostMeterWidth, G.boostMeterThickness, this.paddleLength * this.boostAmount);
            this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostMaterial);
            this.boostMeter.position.set(this.paddle.position.x + this.boostOffset, this.paddle.position.y, this.paddle.position.z);
            this.scene.add(this.boostMeter);
        }
    }

    resetBoostAnimation()
    {
        console.log("Resetting boost animation");
        this.boostMeter.position.set(this.paddle.position.x + this.boostOffset, this.paddle.position.y, this.paddle.position.z);
        this.boostMeter.material.emissive.set(COLOR.BOOSTMETER);
        this.boostMeterAnimation = false;
        this.boostAmount = 0;
        this.updateBoostMeter();
    }

    startBoostMeterAnimation()
    {
        console.log("Starting boost animation");
        this.boostMeterAnimation = true;
        this.clockBoostMeter.start();
    }

    animateBoostMeter()
    {
        let elapsedTime = this.clockBoostMeter.getElapsedTime();
        let color = PongMath.colorLerp(elapsedTime, 0, G.boostMeterAnimationTime, COLOR.BOOSTMETER, COLOR.BOOSTMETER_FULL);
        this.boostMeter.material.emissive.set(color);
        let movementMultiplier = PongMath.lerp(elapsedTime, 0, G.boostMeterAnimationTime, 0, G.boostAnimationMaxMovement);
        this.boostMeter.position.x = (this.paddle.position.x + this.boostOffset) + Math.random() * movementMultiplier;
        this.boostMeter.position.z = this.paddle.position.z + Math.random() * movementMultiplier;

        if (elapsedTime >= G.boostMeterAnimationTime)
        {
            this.resetBoostAnimation();
        }
    }


    // ----Boost----

    increaseBoost()
    {
        this.boostAmount += G.boostIncrement;
        if (this.boostAmount > G.maxBoost)
        {
            this.boostAmount = G.maxBoost;
            this.startBoostMeterAnimation();
        }
        this.updateBoostMeter();
    }

    resetBoost()
    {
        this.resetBoostAnimation();
        this.boostAmount = 0;
        this.updateBoostMeter();
    }

    updateBoost()
    {
        if (this.boostPressed)
        {
            if (this.boostMeterAnimation)
                this.animateBoostMeter();
            else
                this.increaseBoost();
        }
        else if (this.boostReleased)
        {
            this.resetBoost();
            this.boostReleased = false;
        }
    }


    // ----Light----

    resetLightEffect()
    {
        this.paddle.material.emissive.set(this.color);
        this.light.color.set(this.color);
        this.effect = false;
    }

    lightEffect()
    {
        this.effect = true;
        this.paddle.material.emissive.set(this.colorLight);
        this.light.color.set(this.colorLight);
        this.clockLight.start();
    }

    updateLightEffect()
    {
        let elapsedTime = this.clockLight.getElapsedTime();
        let color = PongMath.colorLerp(elapsedTime, 0, G.fadeTimeSec, this.colorLight, this.color);
        
        this.paddle.material.emissive.set(color);
        this.light.color.set(color);
        if (elapsedTime >= G.fadeTimeSec)
            this.resetLightEffect();
    }


    // ----AI----

    addToScene()
    {
        this.scene.add(this.paddle);
        this.scene.add(this.light);
    }

    setPos(x, y, z)
    {
        this.paddle.position.set(x, y, z);
        this.light.position.copy(this.paddle.position);
        this.boostMeter.position.set(x + this.boostOffset, y, z);
    }

    update()
    {
        this.paddle.position.z = this.game.ball.mesh.position.z;
    }
};