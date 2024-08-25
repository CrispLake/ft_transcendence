import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
// import * as SETTINGS from '../gameSetting.js';
import * as PongMath from '../math.js';

export class Player
{
    constructor(game, scene, settings, playerNum, name, id)
    {
        this.game = game;
        this.scene = scene;
        this.settings = settings;
        this.spin = this.settings.spin;
        this.playerNum = playerNum;
        this.name = name;
        this.setAlignment();
        this.setStartPos();
        this.setPlayerColor();
        this.sign = (this.playerNum % 2 == 0) ? 1 : -1;
        this.geometry = new THREE.BoxGeometry(G.paddleThickness, G.wallHeight, G.paddleLength);
        this.material = new THREE.MeshStandardMaterial({color: this.color, emissive: this.color});
        this.paddle = new THREE.Mesh(this.geometry, this.material);
        this.light = new THREE.RectAreaLight(this.color, G.paddleLightIntensity, G.paddleLength, G.paddleHeight);
        this.boostGeometry = new THREE.BoxGeometry(G.boostMeterWidth, G.boostMeterThickness, 0);
        this.boostMaterial = new THREE.MeshStandardMaterial({color: COLOR.BOOSTMETER, emissive: COLOR.BOOSTMETER})
        this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostMaterial);
        this.box = new THREE.Box3();
        this.paddleLength = G.paddleLength;
        this.lives = G.lives;
        this.moveLeft = false;
        this.moveRight = false;
        this.setMovingBoundaries();
        this.boostPressed = false;
        this.boostReleased = false;
        this.boostAmount = 0;
        this.speed = G.initialPaddleSpeed;
        this.boostOffset = G.boostOffset * this.sign;
        this.setPos(this.startPos.x, this.startPos.y, this.startPos.z);
        this.light.lookAt(0, 0, 0);
        this.addToScene();
        this.clockLight = new THREE.Clock();
        this.clockBoostMeter = new THREE.Clock();
        this.effect = false;
        this.boostMeterAnimation = false;
        this.stunTimer = new THREE.Clock();
        this.stunned = false;
        this.stunPosition = new THREE.Vector3();
        this.active = false;
        this.bounce = false;
        this.box.setFromObject(this.paddle);
    }
    

    //--------------------------------------------------------------------------
    //  INITIALIZE
    //--------------------------------------------------------------------------
    
    addToScene()
    {
        this.scene.add(this.paddle);
        this.scene.add(this.light);
    }

    setStartPos()
    {
        if (this.settings.multiMode)
        {
            if (this.playerNum == 1)
                this.startPos = G.startPos4P.p1;
            else if (this.playerNum == 2)
                this.startPos = G.startPos4P.p2;
            else if (this.playerNum == 3)
                this.startPos = G.startPos4P.p3;
            else if (this.playerNum == 4)
                this.startPos = G.startPos4P.p4;
        }
        else
        {
            if (this.playerNum == 1)
                this.startPos = G.startPos2P.p1;
            else if (this.playerNum == 2)
                this.startPos = G.startPos2P.p2;
        }
    }

    setPos(x, y, z)
    {
        this.paddle.position.set(x, y, z);
        this.light.position.copy(this.paddle.position);
        this.boostMeter.position.set(x + this.boostOffset, y, z);
        this.box.setFromObject(this.paddle);
    }

    setAlignment()
    {
        if (this.playerNum < 3)
            this.alignment = G.vertical;
        else
            this.alignment = G.horizontal;
    }

    setPlayerColor()
    {
        if (this.playerNum == 1)
        {
            this.color = COLOR.PADDLE1;
            this.colorLight = COLOR.PADDLE1_LIGHT;
        }
        else if (this.playerNum == 2)
        {
            this.color = COLOR.PADDLE2;
            this.colorLight = COLOR.PADDLE2_LIGHT;
        }
        else if (this.playerNum == 3)
        {
            this.color = COLOR.PADDLE3;
            this.colorLight = COLOR.PADDLE3_LIGHT;
        }
        else if (this.playerNum == 4)
        {
            this.color = COLOR.PADDLE4;
            this.colorLight = COLOR.PADDLE4_LIGHT;
        }
    }


    //--------------------------------------------------------------------------
    //  BOOST METER
    //--------------------------------------------------------------------------

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
            if (this.playerNum < 3)
                this.boostMeter.position.set(this.paddle.position.x + this.boostOffset, this.paddle.position.y, this.paddle.position.z);
            else
            {
                this.boostMeter.position.set(this.paddle.position.x, this.paddle.position.y, this.paddle.position.z + this.boostOffset);
                this.boostMeter.rotation.y += Math.PI / 2;
            }
            this.scene.add(this.boostMeter);
        }
    }

    resetBoostAnimation()
    {
        if (this.alignment == G.vertical)
            this.boostMeter.position.set(this.paddle.position.x + this.boostOffset, this.paddle.position.y, this.paddle.position.z);
        else
            this.boostMeter.position.set(this.paddle.position.x, this.paddle.position.y + this.boostOffset, this.paddle.position.z);
        this.boostMeter.material.emissive.set(COLOR.BOOSTMETER);
        this.boostMeterAnimation = false;
        this.boostAmount = 0;
        this.updateBoostMeter();
    }

    startBoostMeterAnimation()
    {
        this.boostMeterAnimation = true;
        this.clockBoostMeter.start();
    }

    animateBoostMeter()
    {
        let elapsedTime = this.clockBoostMeter.getElapsedTime();
        let color = PongMath.colorLerp(elapsedTime, 0, G.boostMeterAnimationTime, COLOR.BOOSTMETER, COLOR.BOOSTMETER_FULL);
        this.boostMeter.material.emissive.set(color);
        let movementMultiplier = PongMath.lerp(elapsedTime, 0, G.boostMeterAnimationTime, 0, G.boostAnimationMaxMovement);
        if (this.alignment == G.vertical)
        {
            this.boostMeter.position.x = (this.paddle.position.x + this.boostOffset) + Math.random() * movementMultiplier;
            this.boostMeter.position.z = this.paddle.position.z + Math.random() * movementMultiplier;
        }
        else
        {
            this.boostMeter.position.z = (this.paddle.position.z + this.boostOffset) + Math.random() * movementMultiplier;
            this.boostMeter.position.x = this.paddle.position.x + Math.random() * movementMultiplier;
        }

        if (elapsedTime >= G.boostMeterAnimationTime)
        {
            this.resetBoostAnimation();
            this.stunPosition = this.paddle.position.clone();
            this.paddle.material.emissive.set(COLOR.STUNNED);
            this.light.color.set(COLOR.STUNNED);
            this.stunned = true;
            this.stunTimer.start();
        }
    }


    //--------------------------------------------------------------------------
    //  BOOST
    //--------------------------------------------------------------------------

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


    //--------------------------------------------------------------------------
    //  LIGHT
    //--------------------------------------------------------------------------

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


    //--------------------------------------------------------------------------
    //  LIFE
    //--------------------------------------------------------------------------

    loseLife(lifeAmount)
    {
        this.lives -= lifeAmount;
        if (this.lives < 0)
            this.lives == 0;
    }

    setLife(lives)
    {
        this.lives = lives;
        this.game.ui.playerCards[this.name].setLife(this.lives);
    }

    resetLife()
    {
        this.lives = G.lives;
    }


    //--------------------------------------------------------------------------
    //  PADDLE
    //--------------------------------------------------------------------------

    resize(length)
    {
        this.paddleLength = length;
        const newGeometry = new THREE.BoxGeometry(G.paddleThickness, G.wallHeight, length);
        this.paddle.geometry.dispose();
        this.paddle.geometry = newGeometry;
        this.light.width = length;
        this.setMovingBoundaries();
        this.move(0);   // We use this function to correct possible resizing ouutside boundaries. Here we also set boostMeter, light and box position.
    }


    //--------------------------------------------------------------------------
    //  BOUNDARIES
    //--------------------------------------------------------------------------

    setMovingBoundaries()
    {
        if (this.settings.multiMode)
            this.movementBoundary = this.game.arena.width / 2 - G.wallLength4Player - this.paddleLength / 2;
        else
            this.movementBoundary = this.game.arena.width / 2 - G.wallThickness - this.paddleLength / 2;
    }

    stayWithinBoundaries()
    {
        if (this.alignment == G.vertical)
        {
            if (this.paddle.position.z < -this.movementBoundary)
                this.paddle.position.z = -this.movementBoundary;
            if (this.paddle.position.z > this.movementBoundary)
                this.paddle.position.z = this.movementBoundary;
            this.boostMeter.position.z = this.paddle.position.z;
        }
        else
        {
            if (this.paddle.position.x < -this.movementBoundary)
                this.paddle.position.x = -this.movementBoundary;
            if (this.paddle.position.x > this.movementBoundary)
                this.paddle.position.x = this.movementBoundary;
            this.boostMeter.position.x = this.paddle.position.x;
        }
        this.light.position.copy(this.paddle.position);
        this.box.setFromObject(this.paddle);
    }


    //--------------------------------------------------------------------------
    //  PLAYER FUNCTIONS
    //--------------------------------------------------------------------------

    setActive()
    {
        this.active = true;
    }

    move(movement)
    {
        if (this.alignment == G.vertical)
            this.paddle.position.z += movement;
        else
            this.paddle.position.x += movement;
        this.stayWithinBoundaries();
    }

    reset()
    {
        if (this.paddleLength != G.paddleLength)
            this.resize(G.paddleLength);
        this.setPos(this.startPos.x, this.startPos.y, this.startPos.z);
        this.boostAmount = 0;
        this.updateBoostMeter();
        this.stunned = false;
        this.stunTimer.stop();
        this.paddle.material.emissive.set(this.color);
        this.light.color.set(this.color);
    }

    update()
    {
        if (this.effect)
            this.updateLightEffect();
        if (this.stunned)
        {
            let elapsedTime = this.stunTimer.getElapsedTime();
            if (elapsedTime >= G.stunTime)
            {
                this.paddle.position.copy(this.stunPosition);
                this.paddle.material.emissive.set(this.color);
                this.light.color.set(this.color);
                this.stunned = false;
                this.stunTimer.stop();
            }
            else
            {
                const maxShake = G.maxStunShake * ((G.stunTime - elapsedTime) / G.stunTime);
                const randomX = Math.random() * maxShake;
                const randomZ = Math.random() * maxShake;
                this.paddle.position.set(this.stunPosition.x + randomX, this.stunPosition.y, this.stunPosition.z + randomZ);
                return;
            }
        }
        if (this.moveLeft)
            this.move(-this.speed);
        if (this.moveRight)
            this.move(this.speed);
        if (this.spin == true)
            this.updateBoost();
    }
};
