import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
// import * as SETTINGS from '../gameSetting.js';
import * as PongMath from '../math.js';

export class AI
{
    constructor(game, playerNum, name)
    {
        this.game = game;
        this.scene = game.gameScene;
        this.settings = game.settings;
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
        this.box = new THREE.Box3();
        this.light = new THREE.RectAreaLight(this.color, G.paddleLightIntensity, G.paddleLength, G.paddleHeight);
        this.boostGeometry = new THREE.BoxGeometry(G.boostMeterWidth, G.boostMeterThickness, 0);
        this.boostMaterial = new THREE.MeshStandardMaterial({color: COLOR.BOOSTMETER, emissive: COLOR.BOOSTMETER})
        this.boostMeter = new THREE.Mesh(this.boostGeometry, this.boostMaterial);
        this.paddleLength = G.paddleLength;
        this.score = 0;
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
        this.bounce = false;
        this.initializeBrain();        
    }
    
    // ----Initialization Functions----
    
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
            if (this.playerNum < 3)
                this.boostMeter.position.set(this.paddle.position.x + this.boostOffset, this.paddle.position.y, this.paddle.position.z);
            else
                this.boostMeter.position.set(this.paddle.position.x, this.paddle.position.y, this.paddle.position.z + this.boostOffset);
            this.scene.add(this.boostMeter);
        }
    }

    resetBoostAnimation()
    {
        this.boostMeter.position.set(this.paddle.position.x + this.boostOffset, this.paddle.position.y, this.paddle.position.z);
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

    // ----Life----

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


    // ----Paddle----

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
    //  BRAIN
    //--------------------------------------------------------------------------

    initializeBrain()
    {
        this.difficulty = this.game.settings.difficulty;
        this.gameReadTimer = new THREE.Clock();
        this.gameReadTimer.start();
        this.readInterval = G.AIreadInterval / Math.pow(2, this.difficulty - 1);  // diffculty: 1 -> 1/1s, 2 -> 1/2s, 3 -> 1/4s, etc...
        this.goToTarget = false;
        this.targetPos = 0;
        this.considerSpin = false;
        this.canSpin = false;
        if (this.difficulty >= 2)
            this.considerSpin = true;
        if (this.difficulty >= 3)
            this.canSpin = true;
        console.log("slope(0) = " + Math.tan(PongMath.degToRad(0)));
        console.log("slope(45) = " + Math.tan(PongMath.degToRad(45)));
        console.log("slope(90) = " + Math.tan(PongMath.degToRad(90)));
        console.log("slope(90.5) = " + Math.tan(PongMath.degToRad(90.5)));
        console.log("slope(91) = " + Math.tan(PongMath.degToRad(91)));
        console.log("slope(135) = " + Math.tan(PongMath.degToRad(135)));
        console.log("slope(180) = " + Math.tan(PongMath.degToRad(180)));
        console.log("slope(225) = " + Math.tan(PongMath.degToRad(225)));
        console.log("slope(270) = " + Math.tan(PongMath.degToRad(270)));
        console.log("slope(315) = " + Math.tan(PongMath.degToRad(315)));
        console.log("slope(359) = " + Math.tan(PongMath.degToRad(359)));
        console.log("slope(359.5) = " + Math.tan(PongMath.degToRad(359.5)));
        console.log("slope(360) = " + Math.tan(PongMath.degToRad(360)));
        console.log("ArenaWidth = " + this.game.arena.width);
        console.log("ArenaLength = " + this.game.arena.length);
    }

    ballMovesTowards()
    {
        if (this.playerNum == 1)
            return (this.game.ball.speedX < 0);
        if (this.playerNum == 2)
            return (this.game.ball.speedX >= 0);
        if (this.playerNum == 3)
            return (this.game.ball.speedZ < 0);
        if (this.playerNum == 4)
            return (this.game.ball.speedZ >= 0);
    }

    getIntersectionX(startPos, endZ, angle)
    {
        let slope = Math.tan(angle - Math.PI / 2) * -1;  // We add 90 degrees to get 0 slope in x-axis and infinity in y-axis. We multiply by -1 to because z-axis is inverted.
        // console.log("angle = " + PongMath.radToDeg(angle));
        // console.log("slope = " + slope);
        // console.log("endX = " + endX);
        // console.log("ball.x = " + startPos.x);
        // console.log("ball.z = " + startPos.y);
        return ((endZ - startPos.y + slope * startPos.x) / slope);
    }

    getIntersectionZ(startPos, endX, angle)
    {
        let slope = Math.tan(angle - Math.PI / 2) * -1;  // We add 90 degrees to get 0 slope in x-axis and infinity in y-axis. We multiply by -1 to because z-axis is inverted.
        // console.log("angle = " + PongMath.radToDeg(angle));
        // console.log("slope = " + slope);
        // console.log("endX = " + endX);
        // console.log("ball.x = " + startPos.x);
        // console.log("ball.z = " + startPos.y);
        return (slope * (endX - startPos.x) + startPos.y);
    }

    getTargetPosition()
    {
        let startPos = new THREE.Vector2(this.game.ball.mesh.position.x, this.game.ball.mesh.position.z);
        let angle = this.game.ball.angle;
        // let endZ = this.game.arena.width / 2 - G.wallThickness - G.initialBallRadius;
        let endZ = this.game.arena.width / 2;
        let endX = this.game.arena.length / 2;
        // console.log("EndZ = " + endZ);
        let z = this.getIntersectionZ(startPos, endX, angle);
        // console.log("hitZ = " + z);
        while (Math.abs(z) > this.movementBoundary + this.paddleLength / 2)
        {
            if (z < 0)
            {
                let x = this.getIntersectionX(startPos, -endZ, angle);
                // console.log("hitX = " + x);
                startPos.set(x, -endZ);
                let angleFromHorizontalWall = PongMath.degToRad(360) - angle;
                // angle = angle - 2 * angleFromHorizontalWall;
                angle = angleFromHorizontalWall;
            }
            else
            {
                let x = this.getIntersectionX(startPos, endZ, angle);
                // console.log("hitX = " + x);
                startPos.set(x, endZ);
                let angleFromHorizontalWall = PongMath.degToRad(360) - angle;
                // angle = angle - 2 * angleFromHorizontalWall;
                angle = angleFromHorizontalWall;
            }
            z = this.getIntersectionZ(startPos, endX, angle);
            // console.log("hitZ = " + z);
        }
        console.log("FINAL HIT Z = " + z);
        this.targetPos = z;
    }

    ballGoingUp()
    {
        return (0 < this.game.ball.angle && this.game.ball.angle < Math.PI);
    }

    ballGoingDown()
    {
        return (Math.PI < this.game.ball.angle && this.game.ball.angle < Math.PI * 2);
    }

    getTargetPositionWithSpin()
    {
        let startPos = new THREE.Vector2(this.game.ball.mesh.position.x, this.game.ball.mesh.position.z);
        let angle = this.game.ball.angle;
        let angleDelta = this.game.ball.spin;
        let extendedRadiusAngle1 = 180 - angleDelta / 2;
        let distancePerFrame = this.game.ball.speed;
        let radius = distancePerFrame / 2 * Math.tan(extendedRadiusAngle1);
        let distanceFromBallToCenter = radius / Math.sin(extendedRadiusAngle1);
        let extendedRadiusAngle2 = 180 - angle - extendedRadiusAngle1;
        let center = new THREE.Vector2(startPos.x + Math.cos(extendedRadiusAngle2) * distanceFromBallToCenter, startPos.y + Math.sin(extendedRadiusAngle2) * distanceFromBallToCenter);
        let wallZ = this.game.arena.width / 2;
        let goalX = this.game.arena.length / 2;
        let centerToBottomWall = Math.abs(wallZ - center.y);
        let centerToTopWall = Math.abs(center.y - -wallZ);
        let centerToRightWall = Math.abs(goalX - center.x);
        let centerToLeftWall = Math.abs(center.x - -goalX);

        let hitGoal;
        if (centerToLeftWall < radius)
            hitGoal = center.x + Math.sqrt(radius * radius - centerToLeftWall * centerToLeftWall);
        else if (centerToRightWall < radius)
            hitGoal = center.x - Math.sqrt(radius * radius - centerToRightWall * centerToRightWall);

        while (Math.abs(hitGoal) > wallZ)
        {
            let hitWall;
            if (this.ballGoingUp() && centerToTopWall < radius)
            {
                hitWall = center.y + Math.sqrt(radius * radius - centerToTopWall * centerToTopWall);
                startPos.set(hitWall, -wallZ);
            }
            else if (this.ballGoingDown() && centerToBottomWall < radius)
            {
                hitWall = center.y - Math.sqrt(radius * radius - centerToBottomWall * centerToBottomWall);
                startPos.set(hitWall, wallZ);
            }

            // Add needed parameters
            this.calculateNewAngle();
            this.calculateCenter();

            if (centerToLeftWall < radius)
                hitGoal = center.x + Math.sqrt(radius * radius - centerToLeftWall * centerToLeftWall);
            else if (centerToRightWall < radius)
                hitGoal = center.x - Math.sqrt(radius * radius - centerToRightWall * centerToRightWall);
        }



        this.targetPos = z;
    }

    readGame()
    {
        console.log("Reading game...");
        if (this.ballMovesTowards())
        {
            if (this.considerSpin && this.game.ball.spin != 0)
                this.getTargetPositionWIthSpin();
            else
                this.getTargetPosition();
        }
        else
        {
            this.targetPos = 0;
        }
    }

    input()
    {
        const distanceToTarget = this.paddle.position.z - this.targetPos;
        if (distanceToTarget > this.speed)
            this.move(-this.speed);
        else if (distanceToTarget < -this.speed)
            this.move(this.speed);
    }


    // ----Player----

    move(movement)
    {
        if (this.alignment == G.vertical)
        {
            this.paddle.position.z += movement;
            if (this.paddle.position.z < -this.movementBoundary)
                this.paddle.position.z = -this.movementBoundary;
            if (this.paddle.position.z > this.movementBoundary)
                this.paddle.position.z = this.movementBoundary;
            this.boostMeter.position.z = this.paddle.position.z;
        }
        else
        {
            this.paddle.position.x += movement;
            if (this.paddle.position.x < -this.movementBoundary)
                this.paddle.position.x = -this.movementBoundary;
            if (this.paddle.position.x > this.movementBoundary)
                this.paddle.position.x = this.movementBoundary;
            this.boostMeter.position.x = this.paddle.position.x;
        }
        this.light.position.copy(this.paddle.position);
        this.box.setFromObject(this.paddle);
    }

    reset()
    {
        if (this.paddleLength != G.paddleLength)
            this.resize(G.paddleLength);
        this.setPos(this.startPos.x, this.startPos.y, this.startPos.z);
        this.boostAmount = 0;
        this.updateBoostMeter();
        this.box.setFromObject(this.paddle);
    }

    update()
    {
        if (this.effect)
            this.updateLightEffect();
        if (this.gameReadTimer.getElapsedTime() >= this.readInterval)
        {
            this.readGame();
            this.gameReadTimer.start();
        }
        this.input();
        
        this.stayWithinBoundaries();
    }
};