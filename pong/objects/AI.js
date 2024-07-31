import * as THREE from 'three';
import * as COLOR from '../colors.js';
import * as G from '../globals.js';
// import * as SETTINGS from '../gameSetting.js';
import * as PongMath from '../math.js';

class Balls
{
    constructor(scene)
    {
        this.scene = scene;
        this.balls = [];
    }

    addBall(pos)
    {
        const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const ballMaterial = new THREE.MeshStandardMaterial({color: COLOR.CYAN, emissive: COLOR.CYAN});
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.position.set(pos.x, 0, pos.y);
        this.balls.push(ball);
        this.scene.add(ball);
    }

    setColor(index, color)
    {
        this.balls[index].material.color.set(color);
        this.balls[index].material.emissive.set(color);
    }

    removeBalls()
    {
        for (let i = 0; i < this.balls.length; i++)
        {
            this.scene.remove(this.balls[i]);
            this.balls[i].geometry.dispose();
            this.balls[i].material.dispose();
        }
        this.balls = [];
    }
}

class Circles
{
    constructor(scene)
    {
        this.scene = scene;
        this.circles = [];
    }

    add(center, radius)
    {
        const circleGeometry = new THREE.CircleGeometry(radius, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({color: COLOR.WHITE, wireframe: true});
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(center.x, 0, center.y);
        circle.rotation.x -= Math.PI / 2;
        this.circles.push(circle);
        this.scene.add(circle);

        const centerGeometry = new THREE.SphereGeometry(1, 32, 32);
        const centerMaterial = new THREE.MeshStandardMaterial({color: COLOR.WHITE, emissive: COLOR.RED, opacity: 0.5});
        const circleCenter = new THREE.Mesh(centerGeometry, centerMaterial);
        circleCenter.position.set(center.x, 0, center.y);
        this.circles.push(circleCenter);
        this.scene.add(circleCenter);
    }

    empty()
    {
        for (let i = 0; i < this.circles.length; i++)
        {
            this.scene.remove(this.circles[i]);
            this.circles[i].geometry.dispose();
            this.circles[i].material.dispose();
        }
        this.circles = [];
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
    //  DEBUG
    //--------------------------------------------------------------------------

    visualizeCircle()   // DEBUG
    {
        this.scene.remove(this.circle);
        this.circle.geometry.dispose();
        this.circle.material.dispose();
        this.scene.remove(this.circleCenter);
        this.circleCenter.geometry.dispose();
        this.circleCenter.material.dispose();
        
        const circleGeometry = new THREE.CircleGeometry(this.radius, 32);
        const circleMaterial = new THREE.MeshStandardMaterial({color: COLOR.WHITE, emissive: COLOR.WHITE, wireframe: true});
        this.circle = new THREE.Mesh(circleGeometry, circleMaterial);
        this.circle.position.set(this.center.x, 0, this.center.y);
        this.circle.rotation.x -= Math.PI / 2;

        const centerGeometry = new THREE.SphereGeometry(1, 32, 32);
        const centerMaterial = new THREE.MeshStandardMaterial({color: COLOR.WHITE, emissive: COLOR.RED, opacity: 0.5});
        this.circleCenter = new THREE.Mesh(centerGeometry, centerMaterial);
        this.circleCenter.position.set(this.center.x, 0, this.center.y);

        this.scene.add(this.circle);
        this.scene.add(this.circleCenter);
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

    wallHit()
    {
        return (this.firstPoint.x != -this.goalX && this.firstPoint.x != this.goalX);
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
        this.maxBounces = 10;
        if (this.difficulty >= 2)
            this.considerSpin = true;
        if (this.difficulty >= 3)
            this.canSpin = true;

        this.ballPos = new THREE.Vector2(0, 0);
        this.angle = 0;
        this.angleDelta = 0;
        this.extendedRadiusAngle1 = 0;
        this.distancePerFrame = 0;
        this.radius = 0;
        this.distanceFromBallToCenter = 0;
        this.extendedRadiusAngle2 = 0;
        this.center = new THREE.Vector2(0, 0);
        this.wallZ = 0;
        this.goalX = 0;
        this.centerToBottomWall = 0;
        this.centerToTopWall = 0;
        this.centerToRightWall = 0;
        this.centerToLeftWall = 0;
        this.hitWall = 0;
        this.hitGoal = 0;

        this.intersectionPoints = [];
        this.firstPoint = new THREE.Vector2();

        
        // DEBUG
        this.circles = new Circles(this.scene);
        this.balls = new Balls(this.scene);
        this.circle = new THREE.Mesh(new THREE.CircleGeometry(0, 0), new THREE.MeshBasicMaterial({color: COLOR.WHITE}));
        this.circleCenter = new THREE.Mesh(new THREE.SphereGeometry(0, 0, 0), new THREE.MeshStandardMaterial({color: COLOR.WHITE, emissive: COLOR.RED, opacity: 0.5}));
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

    getTargetPosition()
    {
        this.ballPos.set(this.game.ball.mesh.position.x, this.game.ball.mesh.position.z);
        this.angle = this.game.ball.angle;
        this.wallZ = this.game.arena.width / 2;
        this.goalX = this.game.arena.length / 2;
        let x = 0;
        let z = this.getIntersectionZ(this.ballPos, this.goalX, this.angle);
        let bounces = 0;
        while (Math.abs(z) > this.movementBoundary + this.paddleLength / 2 && x < Math.abs(this.goalX) && bounces < this.maxBounces)
        {
            if (z < 0)
            {
                x = this.getIntersectionX(this.ballPos, -this.wallZ, this.angle);
                this.ballPos.set(x, -this.wallZ);
                this.angle = PongMath.degToRad(360) - this.angle;
            }
            else
            {
                x = this.getIntersectionX(this.ballPos, this.wallZ, this.angle);
                this.ballPos.set(x, this.wallZ);
                this.angle = PongMath.degToRad(360) - this.angle;
            }
            z = this.getIntersectionZ(this.ballPos, this.goalX, this.angle);
            bounces++;
        }
        this.targetPos = z;
    }


    //--------------------------------------------------------------------------
    //  CURVED PATH
    //--------------------------------------------------------------------------

    calculateNewAngle(wall)
    {
        this.angle = PongMath.radToDeg(this.angle);

        this.angle = 360 - this.angle;
        this.angle += PongMath.lerp(this.angleDelta, -G.maxSpin, G.maxSpin, -G.maxAngleIncreaseFromSpinBounce, G.maxAngleIncreaseFromSpinBounce);
        this.angle = PongMath.within2Pi(this.angle);

        if (wall == "top")
        {
            if (this.angle > 180 && this.angle < 270 + G.minAngleFromWall)
                this.angle = 270 + G.minAngleFromWall;
            else if (this.angle < 180 && this.angle > 90 - G.minAngleFromWall)
                this.angle = 90 - G.minAngleFromWall;
        }
        else if (wall == "bottom")
        {
            if (this.angle < 360 && this.angle > 270 - G.minAngleFromWall)
                this.angle = 270 - G.minAngleFromWall;
            else if (this.angle > 0 && this.angle < 90 + G.minAngleFromWall)
                this.angle = 90 + G.minAngleFromWall;
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
        this.centerToRightWall = Math.abs(this.goalX - this.center.x);
        this.centerToLeftWall = Math.abs(this.center.x - -this.goalX);
    }

    withinBorders(point, border)
    {
        return (-border <= point && point <= border);
    }


    getValidIntersectionPoints()
    {
        // Frist we empty the array
        this.intersectionPoints = [];

        // console.log("center.x = " + this.center.x);
        // console.log("center.y = " + this.center.y);
        // console.log("radius = " + this.radius);
        // console.log("centerToTopWall = " + this.centerToTopWall);
        // console.log("centerToBottomWall = " + this.centerToBottomWall);
        // console.log("centerToLeftWall = " + this.centerToLeftWall);
        // console.log("centerToRightWall = " + this.centerToRightWall);

        // Then we fill it with all the intersection points
        if (this.radius >= this.centerToTopWall)
        {
            const deltaX = Math.sqrt(Math.pow(this.radius, 2) - Math.pow((-this.wallZ - this.center.y), 2));
            if (this.withinBorders(this.center.x - deltaX, this.goalX))
                this.intersectionPoints.push(new THREE.Vector2(this.center.x - deltaX, -this.wallZ));
            if (this.withinBorders(this.center.x + deltaX, this.goalX))
                this.intersectionPoints.push(new THREE.Vector2(this.center.x + deltaX, -this.wallZ));
        }
        if (this.radius >= this.centerToBottomWall)
        {
            const deltaX = Math.sqrt(Math.pow(this.radius, 2) - Math.pow((this.wallZ - this.center.y), 2));
            if (this.withinBorders(this.center.x - deltaX, this.goalX))
                this.intersectionPoints.push(new THREE.Vector2(this.center.x - deltaX, this.wallZ));
            if (this.withinBorders(this.center.x + deltaX, this.goalX))
                this.intersectionPoints.push(new THREE.Vector2(this.center.x + deltaX, this.wallZ));
        }
        if (this.radius >= this.centerToLeftWall)
        {
            const deltaZ = Math.sqrt(Math.pow(this.radius, 2) - Math.pow((-this.goalX - this.center.x), 2));
            if (this.withinBorders(this.center.y - deltaZ, this.wallZ))
                this.intersectionPoints.push(new THREE.Vector2(-this.goalX, this.center.y - deltaZ));
            if (this.withinBorders(this.center.y + deltaZ, this.wallZ))
                this.intersectionPoints.push(new THREE.Vector2(-this.goalX, this.center.y + deltaZ));
        }
        if (this.radius >= this.centerToRightWall)
        {
            const deltaZ = Math.sqrt(Math.pow(this.radius, 2) - Math.pow((this.goalX - this.center.x), 2));
            if (this.withinBorders(this.center.y - deltaZ, this.wallZ))
                this.intersectionPoints.push(new THREE.Vector2(this.goalX, this.center.y - deltaZ));
            if (this.withinBorders(this.center.y + deltaZ, this.wallZ))
                this.intersectionPoints.push(new THREE.Vector2(this.goalX, this.center.y + deltaZ));
        }
    }

    angleBetweenVectors(point0, point1)
    {
        return (Math.atan2(point1.y - point0.y, point1.x - point0.x));
    }

    getFirstIntersectionPointClockwise()
    {
        const currentAngle = this.angleBetweenVectors(this.center, this.ballPos);
        let minAngle = Math.PI * 2;
        let first = -1;

        for (let i = 0; i < this.intersectionPoints.length; i++)
        {
            let intersectionAngle = this.angleBetweenVectors(this.center, this.intersectionPoints[i]);
            let angleDifference = PongMath.within2Pi(intersectionAngle - currentAngle);
            if (angleDifference < minAngle)
            {
                minAngle = angleDifference;
                first = i;
            }
        }
        if (first >= 0)
        {
            console.log("First intersection point CW: " + first);
            this.firstPoint.set(this.intersectionPoints[first].x, this.intersectionPoints[first].y);
            this.balls.setColor(first, COLOR.YELLOW); // DEBUG
        }
    }

    getFirstIntersectionPointCounterClockwise()
    {
        const currentAngle = this.angleBetweenVectors(this.center, this.ballPos);
        let maxAngle = 0;
        let first = -1;

        for (let i = 0; i < this.intersectionPoints.length; i++)
        {
            let intersectionAngle = this.angleBetweenVectors(this.center, this.intersectionPoints[i]);
            let angleDifference = PongMath.within2Pi(intersectionAngle - currentAngle);
            if (angleDifference > maxAngle)
            {
                maxAngle = angleDifference;
                first = i;
            }
        }
        if (first >= 0)
        {
            console.log("First intersection point CCW: " + first);
            this.firstPoint.set(this.intersectionPoints[first].x, this.intersectionPoints[first].y);
            this.balls.setColor(first, COLOR.YELLOW); // DEBUG
        }
    }

    getTargetPositionWithSpin()
    {
        console.log("-----------------------------------------------------------");
        this.ballPos.set(this.game.ball.mesh.position.x, this.game.ball.mesh.position.z);
        this.angle = this.game.ball.angle;
        this.angleDelta = this.game.ball.spin;
        this.distancePerFrame = this.game.ball.speed;
        this.wallZ = this.game.arena.width / 2;
        this.goalX = this.game.arena.length / 2;
        this.calculateCenter();
        this.calculateCenterToWalls();
        this.getValidIntersectionPoints();
        
        this.circles.empty();   // DEBUG
        this.circles.add(this.center, this.radius); // DEBUG
        this.balls.removeBalls(); // DEBUG
        for (let point in this.intersectionPoints)  // DEBUG
            this.balls.addBall(this.intersectionPoints[point]);
 
        if (this.clockwiseSpin())
            this.getFirstIntersectionPointClockwise();
        else 
            this.getFirstIntersectionPointCounterClockwise();

        while (this.intersectionPoints.length > 0 && this.wallHit())
        {
            this.ballPos.set(this.firstPoint.x, this.firstPoint.y);
            this.calculateCenter();
            this.calculateCenterToWalls();
            this.getValidIntersectionPoints();
            this.circles.add(this.center, this.radius); // DEBUG
            for (let point in this.intersectionPoints)  // DEBUG
                this.balls.addBall(this.intersectionPoints[point]);
            if (this.clockwiseSpin())
                this.getFirstIntersectionPointClockwise();
            else 
                this.getFirstIntersectionPointCounterClockwise();
        }

        this.targetPos = this.firstPoint.y;
    }


    //--------------------------------------------------------------------------
    //  ACTIONS
    //--------------------------------------------------------------------------

    readGame()
    {
        if (this.ballMovesTowards())
        {
            if (this.considerSpin && this.game.ball.spin != 0)
                this.getTargetPositionWithSpin();
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