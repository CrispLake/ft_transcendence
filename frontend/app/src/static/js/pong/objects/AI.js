import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
import * as PongMath from '../math.js';

class IntersectionPoint
{
    constructor(x, z, wall)
    {
        this.pos = new THREE.Vector2(x, z);
        this.wall = wall;
    }

    set(x, z, wall)
    {
        this.setPos(x, z);
        this.wall = wall;
    }

    setPos(x, z)
    {
        this.pos.set(x, z);
    }
}

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
        this.initializeBrain();        
    }
    
    //--------------------------------------------------------------------------
    //  INITIALIZATION
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
        this.maxBounces = 3;
        if (this.spin)
        {
            if (this.difficulty >= 2)
                this.considerSpin = true;
            if (this.difficulty >= 3)
                this.canSpin = true;
        }

        this.ballPos = new THREE.Vector2(0, 0);
        this.angle = 0;
        this.angleDelta = 0;
        this.extendedRadiusAngle1 = 0;
        this.distancePerFrame = 0;
        this.radius = 0;
        this.distanceFromBallToCenter = 0;
        this.extendedRadiusAngle2 = 0;
        this.center = new THREE.Vector2(0, 0);
        this.wallZ = this.game.arena.width / 2;
        this.wallX = this.game.arena.length / 2;
        this.centerToBottomWall = 0;
        this.centerToTopWall = 0;
        this.centerToRightWall = 0;
        this.centerToLeftWall = 0;
        this.hitWall = 0;
        this.hitGoal = 0;
        this.shouldBoost = true;

        this.intersectionPoints = [];
        this.firstPoint = new IntersectionPoint(0, 0, "none");

        this.ballIntersectPos = 0;
        this.pathLengthToHit = 0;
        this.ballTimeToTarget = 0;
        this.ballTimeToTargetTimer = new THREE.Clock();

        this.spinDirection = 0;
        this.setSpinDirection();
        this.offset = 0;
        this.setOffsetFromTargetPosition();
        this.paddleDistanceChecked = false;
        this.paddleIsCloseEnough = false;
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
    //  LIGHT EFFECT
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
    //  BOOLEAN FUNCTIONS
    //--------------------------------------------------------------------------

    ballGoingUp()
    {
        return (0 < this.angle && this.angle < Math.PI);
    }

    ballGoingDown()
    {
        return (Math.PI < this.angle && this.angle < Math.PI * 2);
    }

    clockwiseSpin()
    {
        return (this.game.ball.spin < 0);
    }

    counterClockwiseSpin()
    {
        return (this.game.ball.spin >= 0);
    }

    wallHit(pos)
    {
        if (this.settings.multiMode)
        {
            if ((pos.y == this.wallZ || pos.y == -this.wallZ)
                && Math.abs(pos.x) <= this.wallX
                && Math.abs(pos.x) >= this.wallX - G.wallLength4Player)
                return true;
            if ((pos.x == this.wallX || pos.x == -this.wallX)
                && Math.abs(pos.y) <= this.wallZ
                && Math.abs(pos.y) >= this.wallZ - G.wallLength4Player)
                return true;
        }
        else
        {
            if ((pos.y == this.wallZ || pos.y == -this.wallZ)
                && pos.x <= this.wallX
                && pos.x >= -this.wallX)
                return true;
        }
        return false;
    }

    ownSideHit()
    {
        if (this.playerNum == 1 && this.firstPoint.wall == "left")
        {
            if (this.withinBorders(this.firstPoint.pos.y, this.wallZ))
                return true;
        }
        else if (this.playerNum == 2 && this.firstPoint.wall == "right")
        {
            if (this.withinBorders(this.firstPoint.pos.y, this.wallZ))
                return true;
        }
        else if (this.playerNum == 3 && this.firstPoint.wall == "top")
        {
            if (this.withinBorders(this.firstPoint.pos.x, this.wallX))
                return true;
        }
        else if (this.playerNum == 4 && this.firstPoint.wall == "bottom")
        {
            if (this.withinBorders(this.firstPoint.pos.x, this.wallX))
                return true;
        }
        return false;
    }

    ownGoalHit()
    {
        let goalPost;
        if (this.settings.multiMode)
            goalPost = this.game.arena.width / 2 - G.wallLength4Player;
        else
            goalPost = this.game.arena.width / 2 - G.wallThickness;

        let intersection;
        if (this.alignment == G.vertical)
            intersection = this.firstPoint.pos.y;
        else
            intersection = this.firstPoint.pos.x;

        return (this.ownSideHit() && intersection < goalPost && intersection > -goalPost);
    }

    ballIsInchingIn()
    {
        const timeToMoveQuarterPaddle = (this.paddleLength / 2) / (this.speed * G.fps);
        const ballTimeToTarget = this.ballTimeToTarget - this.ballTimeToTargetTimer.getElapsedTime();
        return (!this.active && ballTimeToTarget < timeToMoveQuarterPaddle);
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

    isPaddleCloseEnough()
    {
        // Check if paddle can move away from the intersection, considering paddle time to not cover intersection (check spin direction) and ball time to intersection
        // If we can move, set paddleDistanceChecked to true. That way, we can check every frame until we're good to go.
        let paddleDistanceToTarget;
        if (this.alignment == G.vertical)
            paddleDistanceToTarget = this.firstPoint.pos.y - this.paddle.position.z;
        else
            paddleDistanceToTarget = this.firstPoint.pos.x - this.paddle.position.x;

        let distanceToMiss;
        if (this.spinDirection == G.SpinLeft)
            distanceToMiss = this.paddleLength / 2 - paddleDistanceToTarget;
        else
            distanceToMiss = this.paddleLength / 2 + paddleDistanceToTarget;

        const ballTimeToIntersection = this.ballTimeToTarget - this.ballTimeToTargetTimer.getElapsedTime();
        
        // Variables for considering a margin of error
        const dangerZone = this.paddleLength * G.AIMargin;
        const paddleDistanceToDanger = distanceToMiss - dangerZone;
        const paddleDistanceToSafeZone = paddleDistanceToDanger - (this.paddleLength - 2 * dangerZone);
        const paddleTimeToDanger = paddleDistanceToDanger / (this.speed * G.fps);
        const paddleTimeToSafeZone = paddleDistanceToSafeZone / (this.speed * G.fps); 

        // Close enough with margins
        if (paddleTimeToSafeZone < ballTimeToIntersection && paddleTimeToDanger > ballTimeToIntersection)
        {
            this.paddleDistanceChecked = true;
            this.paddleIsCloseEnough = true;
        }
        console.log(this.playerNum + ": isPaddleCloseEnough(" + paddleDistanceToSafeZone.toFixed(2) + " < " + paddleDistanceToTarget.toFixed(2) + " < " + paddleDistanceToDanger.toFixed(2) + " = " + (paddleDistanceToSafeZone < paddleDistanceToTarget && paddleDistanceToDanger > paddleDistanceToTarget));
        console.log(this.playerNum + ": isPaddleCloseEnough(" + paddleTimeToSafeZone.toFixed(2) + " < " + ballTimeToIntersection.toFixed(2) + " < " + paddleTimeToDanger.toFixed(2) + " = " + (paddleTimeToSafeZone < ballTimeToIntersection && paddleTimeToDanger > ballTimeToIntersection));
    }


    //--------------------------------------------------------------------------
    //  STRAIGHT PATH
    //--------------------------------------------------------------------------

    getIntersectionX(startPos, endZ, angle)
    {
        let slope = Math.tan(angle - Math.PI / 2) * -1;  // We add 90 degrees to get 0 slope in x-axis and infinity in y-axis. We multiply by -1 to because z-axis is inverted.
        return ((endZ - startPos.y + slope * startPos.x) / slope);
    }

    getIntersectionZ(startPos, endX, angle)
    {
        let slope = Math.tan(angle - Math.PI / 2) * -1;  // We add 90 degrees to get 0 slope in x-axis and infinity in y-axis. We multiply by -1 to because z-axis is inverted.
        return (slope * (endX - startPos.x) + startPos.y);
    }
    
    getwallPositions()
    {
        this.wallZ = this.game.arena.width / 2;
        this.wallX = this.game.arena.length / 2;
    }

    getFirstIntersectionPoint()
    {
        let x, z;
        if (this.angle > PongMath.degToRad(0) && this.angle < PongMath.degToRad(90))
        {
            x = this.getIntersectionX(this.ballPos, this.wallZ, this.angle);
            if (x > this.wallX)
            {
                z = this.getIntersectionZ(this.ballPos, this.wallX, this.angle);
                this.firstPoint.set(this.wallX, z, "right");
            }
            else
                this.firstPoint.set(x, this.wallZ, "bottom");
        }
        else if (this.angle > PongMath.degToRad(90) && this.angle < PongMath.degToRad(180))
        {
            x = this.getIntersectionX(this.ballPos, -this.wallZ, this.angle);
            if (x > this.wallX)
            {
                z = this.getIntersectionZ(this.ballPos, this.wallX, this.angle);
                this.firstPoint.set(this.wallX, z, "right");
            }
            else
                this.firstPoint.set(x, -this.wallZ, "top");
        }
        else if (this.angle > PongMath.degToRad(180) && this.angle < PongMath.degToRad(270))
        {
            x = this.getIntersectionX(this.ballPos, -this.wallZ, this.angle);
            if (x < -this.wallX)
            {
                z = this.getIntersectionZ(this.ballPos, -this.wallX, this.angle);
                this.firstPoint.set(-this.wallX, z, "left");
            }
            else
                this.firstPoint.set(x, -this.wallZ, "top");
        }
        else if (this.angle > PongMath.degToRad(270) && this.angle < PongMath.degToRad(360))
        {
            x = this.getIntersectionX(this.ballPos, this.wallZ, this.angle);
            if (x < -this.wallX)
            {
                z = this.getIntersectionZ(this.ballPos, -this.wallX, this.angle);
                this.firstPoint.set(-this.wallX, z, "left");
            }
            else
                this.firstPoint.set(x, this.wallZ, "bottom");
        }
        else if (this.angle == PongMath.degToRad(0))
            this.firstPoint.set(0, this.wallZ, "bottom");
        else if (this.angle == PongMath.degToRad(90))
            this.firstPoint.set(this.wallX, 0, "right");
        else if (this.angle == PongMath.degToRad(180))
            this.firstPoint.set(0, -this.wallZ, "top");
        else if (this.angle == PongMath.degToRad(270))
            this.firstPoint.set(-this.wallX, 0, "left");
    }

    getTargetPosition()
    {
        this.pathLengthToHit = 0;
        this.ballPos.set(this.game.ball.mesh.position.x, this.game.ball.mesh.position.z);
        this.angle = this.game.ball.angle;
        this.getwallPositions();
        this.getFirstIntersectionPoint();
        this.pathLengthToHit += PongMath.distanceBetweenPoints(this.ballPos.x, this.ballPos.y, this.firstPoint.pos.x, this.firstPoint.pos.y);
        let bounces = 0;
        while (this.wallHit(this.firstPoint.pos) && bounces < this.maxBounces)
        {
            this.ballPos.set(this.firstPoint.pos.x, this.firstPoint.pos.y);
            this.angle = PongMath.degToRad(360) - this.angle;
            this.getFirstIntersectionPoint();
            this.pathLengthToHit += PongMath.distanceBetweenPoints(this.ballPos.x, this.ballPos.y, this.firstPoint.pos.x, this.firstPoint.pos.y);
            bounces++;
        }
        if (this.ownSideHit())
        {
            if (this.alignment == G.vertical)
                this.targetPos = this.firstPoint.pos.y;
            else
                this.targetPos = this.firstPoint.pos.x;
        }
    }


    //--------------------------------------------------------------------------
    //  CURVED PATH
    //--------------------------------------------------------------------------

    getAngleAtIntersection()
    {
        let a = this.angleBetweenVectors(this.center, this.firstPoint.pos);
        if (this.angleDelta >= 0)
            a += Math.PI / 2;
        else
            a -= Math.PI / 2;
        this.angle = PongMath.within2Pi(a);
    }

    calculateNewAngle()
    {
        this.getAngleAtIntersection();
        this.angleDelta *= (100 - G.spinReduction) / 100;
        this.angle = PongMath.within2Pi(Math.PI - this.angle);
        
        this.angle += PongMath.lerp(this.angleDelta, -G.maxSpin, G.maxSpin, -G.maxAngleIncreaseFromSpinBounce, G.maxAngleIncreaseFromSpinBounce);
        this.angle = PongMath.within2Pi(this.angle);
        this.angle = PongMath.radToDeg(this.angle);

        if (this.firstPoint.wall == "top")
        {
            if (this.angle > 180 && this.angle < 270 + G.minAngleFromWall)
                this.angle = 270 + G.minAngleFromWall;
            else if (this.angle < 180 && this.angle > 90 - G.minAngleFromWall)
                this.angle = 90 - G.minAngleFromWall;
        }
        else if (this.firstPoint.wall == "bottom")
        {
            if (this.angle < 360 && this.angle > 270 - G.minAngleFromWall)
                this.angle = 270 - G.minAngleFromWall;
            else if (this.angle > 0 && this.angle < 90 + G.minAngleFromWall)
                this.angle = 90 + G.minAngleFromWall;
        }
        else if (this.firstPoint.wall == "left")
        {
            if (this.angle < 270 && this.angle > 180 - G.minAngleFromWall)
                this.angle = 180 - G.minAngleFromWall;
            else if (this.angle > 270 && this.angle < G.minAngleFromWall)
                this.angle = G.minAngleFromWall;
        }
        else if (this.firstPoint.wall == "right")
        {
            if (this.angle > 90 && this.angle < 180 + G.minAngleFromWall)
                this.angle = 180 + G.minAngleFromWall;
            else if (this.angle < 90 && this.angle > 360 - G.minAngleFromWall)
                this.angle = 360 - G.minAngleFromWall;
        }

        this.angle = PongMath.degToRad(this.angle);
    }

    calculateCenter()
    {
        let base = this.distancePerFrame / 2;
        this.extendedRadiusAngle1 = (PongMath.degToRad(180) - this.angleDelta) / 2;
        this.radius = Math.abs(base * Math.tan(this.extendedRadiusAngle1));
        this.extendedRadius = Math.sqrt(base * base + this.radius * this.radius);
        this.extendedRadiusAngle2 = PongMath.degToRad(180) - this.angle % PongMath.degToRad(90) - this.extendedRadiusAngle1;
        
        // Set extended radius angle, based on ball spin direction
        if (this.game.ball.spin < 0)
            this.extendedRadiusAngleTotal = PongMath.within2Pi(this.angle - this.extendedRadiusAngle1);
        else
            this.extendedRadiusAngleTotal = PongMath.within2Pi(this.angle + this.extendedRadiusAngle1);
        
        // Get the x and z distance from ball to center of circle
        this.deltaX = this.extendedRadius * Math.cos(this.extendedRadiusAngleTotal);
        this.deltaZ = this.extendedRadius * Math.sin(this.extendedRadiusAngleTotal);

        // Switch values to account for inverted z-axis and 90 degree tilt
        let temp = this.deltaX;
        this.deltaX = this.deltaZ;
        this.deltaZ = temp;

        // Set the coordinates of the circle
        let centerX = this.ballPos.x + this.deltaX;
        let centerZ = this.ballPos.y + this.deltaZ;
        this.center.set(centerX, centerZ);
    }

    calculateCenterToWalls()
    {
        this.centerToBottomWall = Math.abs(this.wallZ - this.center.y);
        this.centerToTopWall = Math.abs(this.center.y - -this.wallZ);
        this.centerToRightWall = Math.abs(this.wallX - this.center.x);
        this.centerToLeftWall = Math.abs(this.center.x - -this.wallX);
    }

    withinBorders(point, border)
    {
        return (-border <= point && point <= border);
    }

    getValidIntersectionPoints()
    {
        // Frist we empty the array
        this.intersectionPoints = [];

        // Then we fill it with all the intersection points
        if (this.radius >= this.centerToTopWall)
        {
            const deltaX = Math.sqrt(Math.pow(this.radius, 2) - Math.pow((-this.wallZ - this.center.y), 2));
            if (this.withinBorders(this.center.x - deltaX, this.wallX) && this.ballPos.x != this.center.x - deltaX && this.ballPos.y != -this.wallZ)
                this.intersectionPoints.push(new IntersectionPoint(this.center.x - deltaX, -this.wallZ, "top"));
            if (this.withinBorders(this.center.x + deltaX, this.wallX) && this.ballPos.x != this.center.x + deltaX && this.ballPos.y != -this.wallZ)
                this.intersectionPoints.push(new IntersectionPoint(this.center.x + deltaX, -this.wallZ, "top"));
        }
        if (this.radius >= this.centerToBottomWall)
        {
            const deltaX = Math.sqrt(Math.pow(this.radius, 2) - Math.pow((this.wallZ - this.center.y), 2));
            if (this.withinBorders(this.center.x - deltaX, this.wallX) && this.ballPos.x != this.center.x - deltaX && this.ballPos.y != this.wallZ)
                this.intersectionPoints.push(new IntersectionPoint(this.center.x - deltaX, this.wallZ, "bottom"));
            if (this.withinBorders(this.center.x + deltaX, this.wallX) && this.ballPos.x != this.center.x + deltaX && this.ballPos.y != this.wallZ)
                this.intersectionPoints.push(new IntersectionPoint(this.center.x + deltaX, this.wallZ, "bottom"));
        }
        if (this.radius >= this.centerToLeftWall)
        {
            const deltaZ = Math.sqrt(Math.pow(this.radius, 2) - Math.pow((-this.wallX - this.center.x), 2));
            if (this.withinBorders(this.center.y - deltaZ, this.wallZ) && this.ballPos.x != -this.wallX && this.ballPos.y != this.center.y - deltaZ)
                this.intersectionPoints.push(new IntersectionPoint(-this.wallX, this.center.y - deltaZ, "left"));
            if (this.withinBorders(this.center.y + deltaZ, this.wallZ) && this.ballPos.x != -this.wallX && this.ballPos.y != this.center.y + deltaZ)
                this.intersectionPoints.push(new IntersectionPoint(-this.wallX, this.center.y + deltaZ, "left"));
        }
        if (this.radius >= this.centerToRightWall)
        {
            const deltaZ = Math.sqrt(Math.pow(this.radius, 2) - Math.pow((this.wallX - this.center.x), 2));
            if (this.withinBorders(this.center.y - deltaZ, this.wallZ) && this.ballPos.x != this.wallX && this.ballPos.y != this.center.y - deltaZ)
                this.intersectionPoints.push(new IntersectionPoint(this.wallX, this.center.y - deltaZ, "right"));
            if (this.withinBorders(this.center.y + deltaZ, this.wallZ) && this.ballPos.x != this.wallX && this.ballPos.y != this.center.y + deltaZ)
                this.intersectionPoints.push(new IntersectionPoint(this.wallX, this.center.y + deltaZ, "right"));
        }
    }

    angleBetweenVectors(point0, point1)
    {
        return (PongMath.within2Pi(PongMath.degToRad(90) - Math.atan2(point1.y - point0.y, point1.x - point0.x)));
    }

    getFirstIntersectionPointClockwise()
    {
        const currentAngle = this.angleBetweenVectors(this.center, this.ballPos);
        let minAngle = Math.PI * 2;
        let first = -1;

        for (let i = 0; i < this.intersectionPoints.length; i++)
        {
            let intersectionAngle = this.angleBetweenVectors(this.center, this.intersectionPoints[i].pos);
            let angleDifference = PongMath.within2Pi(currentAngle - intersectionAngle);
            if (angleDifference < minAngle)
            {
                minAngle = angleDifference;
                first = i;
            }
        }
        if (first >= 0)
        {
            this.pathLengthToHit += PongMath.arcLength(this.radius, minAngle);
            this.firstPoint.set(this.intersectionPoints[first].pos.x, this.intersectionPoints[first].pos.y, this.intersectionPoints[first].wall);
        }
    }

    getFirstIntersectionPointCounterClockwise()
    {
        const currentAngle = this.angleBetweenVectors(this.center, this.ballPos);
        let maxAngle = 0;
        let first = -1;

        for (let i = 0; i < this.intersectionPoints.length; i++)
        {
            let intersectionAngle = this.angleBetweenVectors(this.center, this.intersectionPoints[i].pos);
            let angleDifference = PongMath.within2Pi(currentAngle - intersectionAngle);
            if (angleDifference > maxAngle)
            {
                maxAngle = angleDifference;
                first = i;
            }
        }
        if (first >= 0)
        {
            let actualAngle = PongMath.degToRad(360) - maxAngle;
            this.pathLengthToHit += PongMath.arcLength(this.radius, actualAngle);
            this.firstPoint.set(this.intersectionPoints[first].pos.x, this.intersectionPoints[first].pos.y, this.intersectionPoints[first].wall);
        }
    }

    getTargetPositionWithSpin()
    {
        this.ballPos.set(this.game.ball.mesh.position.x, this.game.ball.mesh.position.z);
        this.angle = this.game.ball.angle;
        this.angleDelta = this.game.ball.spin;
        this.distancePerFrame = this.game.ball.speed;
        this.wallX = this.game.arena.length / 2;
        this.wallZ = this.game.arena.width / 2;
        this.calculateCenter();
        this.calculateCenterToWalls();
        this.getValidIntersectionPoints();
 
        this.pathLengthToHit = 0;
        if (this.clockwiseSpin())
            this.getFirstIntersectionPointClockwise();
        else 
            this.getFirstIntersectionPointCounterClockwise();

        let bounces = 0;
        while (this.intersectionPoints.length > 0
            && this.wallHit(this.firstPoint.pos)
            && bounces < this.maxBounces)
        {
            this.ballPos.set(this.firstPoint.pos.x, this.firstPoint.pos.y);
            this.calculateNewAngle();
            this.calculateCenter();
            this.calculateCenterToWalls();
            this.getValidIntersectionPoints();
            
            if (this.clockwiseSpin())
                this.getFirstIntersectionPointClockwise();
            else 
                this.getFirstIntersectionPointCounterClockwise();
            bounces++;
        }

        let ownGoal = this.ownGoalHit();
        // console.log(this.playerNum + ": ownGoalHit = " + ownGoal);

        if (this.ownGoalHit())
        {
            if (this.alignment == G.vertical)
            {
                this.targetPos = this.firstPoint.pos.y;
                this.ballIntersectPos = this.firstPoint.pos.y;
            }
            else
            {
                this.targetPos = this.firstPoint.pos.x;
                this.ballIntersectPos = this.firstPoint.pos.x;
            }
        }
    }

    
    db(n, msg, x)   // DEBUG
    {
        if (this.playerNum == n)
            console.log(n + ": " + msg + " = " + x);
    }


    //--------------------------------------------------------------------------
    //  INPUT
    //--------------------------------------------------------------------------

    handleInput()
    {
        let paddleDistanceToTarget;
        if (this.alignment == G.vertical)
            paddleDistanceToTarget = this.paddle.position.z - this.targetPos;
        else
            paddleDistanceToTarget = this.paddle.position.x - this.targetPos;
        
        paddleDistanceToTarget += this.offset;

        if (paddleDistanceToTarget > this.speed)
            this.moveLeft = true;
        else if (paddleDistanceToTarget < -this.speed)
            this.moveRight = true;
    }


    //--------------------------------------------------------------------------
    //  SPIN INPUT
    //--------------------------------------------------------------------------

    setSpinDirection()
    {
        if (Math.random() < 0.5)
            this.spinDirection = G.SpinLeft;
        else
            this.spinDirection = G.SpinRight;
    }

    setOffsetFromTargetPosition()
    {
        // We set the offset to a random value between 0 and 20% of the paddle length
        this.offset = Math.random() * this.paddleLength * G.maxOffset;
        console.log(this.playerNum + ": setting offset = " + this.offset);
    }

    handleSpinInput()
    {    
        if (this.ballTimeToTargetTimer.running && this.ballIsInchingIn() && this.ownGoalHit())
        {
            // Check if paddle is close enough to the ball intersection
            if (this.paddleDistanceChecked == false)
                this.isPaddleCloseEnough();

            if (this.paddleIsCloseEnough)
            {
                console.log(this.playerNum + ": spinning -> " + this.spinDirection);
                if (this.spinDirection == G.SpinLeft)
                    this.moveLeft = true;
                else if (this.spinDirection == G.SpinRight)
                    this.moveRight = true;
            }
            else
                this.handleInput();
        }
        else
            this.handleInput();
    }


    //--------------------------------------------------------------------------
    //  BOOST INPUT
    //--------------------------------------------------------------------------

    handleBoostInput()
    {
        if (this.ownGoalHit() && this.shouldBoost)
        {
            let timeToHit = this.ballTimeToTarget - this.ballTimeToTargetTimer.getElapsedTime();
            if (timeToHit < G.boostFillingTime)
            {
                // If we have less time than it takes to fully boost -> press boost
                if (this.boostPressed == false)
                {
                    this.boostPressed = true;
                    this.boostReleased = false;
                }
            }
        }
        else
        {
            if (this.boostPressed)
            {
                this.boostPressed = false;
                this.boostReleased = true;
            }
        }
    }


    //--------------------------------------------------------------------------
    //  READ GAME
    //--------------------------------------------------------------------------

    readGame()
    {
        // this.db(2, "READ", "----------------------------------------------------");
        if (this.considerSpin && this.game.ball.spin != 0)
            this.getTargetPositionWithSpin();
        else
            this.getTargetPosition();

        if (this.canSpin)
        {
            this.shouldBoost = true;
            this.updateTimeToTarget();
        }

        if (!this.ownGoalHit())
        {
            this.targetPos = 0;
            // console.log(this.playerNum + ": READ: setting targetPos = " + this.targetPos);
        }

        // console.log(this.playerNum + ": firstPoint.x = " + this.firstPoint.pos.x.toFixed(2));
        // console.log(this.playerNum + ": firstPoint.z = " + this.firstPoint.pos.y.toFixed(2));
        // console.log(this.playerNum + ": firstPoint.wall = " + this.firstPoint.wall);
        // console.log(this.playerNum + ": targetPos = " + this.targetPos.toFixed(2));
    }

    updateTimeToTarget()
    {
        this.ballTimeToHit = this.pathLengthToHit / (this.game.ball.speed * G.fps);
        if (this.ownGoalHit())
        {
            this.ballTimeToTarget = this.ballTimeToHit;
            this.ballTimeToTargetTimer.start();
        }
    }


    //--------------------------------------------------------------------------
    //  BASE FUNCTIONS
    //--------------------------------------------------------------------------

    setActive()
    {
        console.log(this.playerNum + ": Active");
        this.active = true;
        if (this.ballTimeToTargetTimer.running)
            this.ballTimeToTargetTimer.stop();
        this.shouldBoost = false;
        this.paddleDistanceChecked = false;
        this.paddleIsCloseEnough = false;
        this.setSpinDirection();
        this.setOffsetFromTargetPosition();
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
        this.light.position.copy(this.paddle.position);
        this.box.setFromObject(this.paddle);
        this.boostAmount = 0;
        this.updateBoostMeter();
        this.targetPos = 0;
        this.setSpinDirection();
        this.setOffsetFromTargetPosition();
        this.paddleDistanceChecked = false;
        this.paddleIsCloseEnough = false;
    }

    handleStun()
    {
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
            }
        }
    }

    update()
    {
        this.moveLeft = false;
        this.moveRight = false;

        // Check and handle stunned condition.
        this.handleStun();

        // If AI is stunned, we don't want to update anything else.
        if (this.stunned)
            return;

        // Flash if paddle's been hit.
        if (this.effect)
            this.updateLightEffect();
        
        // Read the game. Get all the necessary information to be able to make smart choices.
        if (this.gameReadTimer.getElapsedTime() >= this.readInterval)
        {
            this.readGame();
            this.gameReadTimer.start();
        }

        // Update the AI input based on the game situation.
        if (this.canSpin)
        {
            this.handleSpinInput();
            this.handleBoostInput();
        }
        else
            this.handleInput();

        // Handle movement input.
        if (this.moveLeft)
            this.move(-this.speed);
        if (this.moveRight)
            this.move(this.speed);

        // Update the boost.
        if (this.spin == true)
            this.updateBoost();      
    }
};