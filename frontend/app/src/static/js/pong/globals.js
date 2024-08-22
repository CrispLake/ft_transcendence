import * as THREE from 'three';
import * as PongMath from './math.js';


//--------------------------------------------------------------------------
//  SETTINGS
//--------------------------------------------------------------------------

export const winningScore = 3;
export const lives = 3;
export const fps = 60;


//--------------------------------------------------------------------------
//  ARENA
//--------------------------------------------------------------------------

export const arenaLength = 25;
export const arenaWidth = 15;
export const wallHeight = 0.5;
export const wallThickness = 0.2;
export const floorThickness = 0.2;
export const floorWidth = arenaWidth + wallThickness * 2;
export const wallLightIntensity = 1;
export const fadeTimeSec = 0.3;
export const cameraOrbitTimeSec = 120;

// 4 Player
export const arenaWidth4Player = 25;
export const wallLength4Player = 3;

export const goalOffset = 0.2;


//--------------------------------------------------------------------------
//  PLAYER
//--------------------------------------------------------------------------

export const paddleLightIntensity = 1;
export const paddleLength = 4;
export const paddleHeight = wallHeight;
export const paddleThickness = 0.2;
export const initialPaddleSpeed = 0.2;

export const boostMeterWidth = paddleHeight;
export const boostMeterThickness = 0.1;
export const boostMeterLength = paddleLength;
export const maxBoost = 1;
export const boostIncrement = 0.02;
export const boostFillingTime = (maxBoost / boostIncrement) / fps;
export const boostOffset = 1;
export const boostMeterAnimationTime = 1;
export const boostAnimationMaxMovement = 0.4;
export const stunTime = 1;
export const maxStunShake = 0.2;


//--------------------------------------------------------------------------
//  BALL
//--------------------------------------------------------------------------

export const initialBallRadius = 0.2;
export const initialBallSpeed = 0.15;
export const initialStartingAngle = 90;
export const maxBallRotationSpeed = 0.3;
/*
up = 0
right = 90
down = 180
left = 270
*/
export const speedIncrement = 0.01;
export const ballStartPos = {
    x: 0,
    y: 0,
    z: 0
};


//--------------------------------------------------------------------------
//  SPIN
//--------------------------------------------------------------------------

export const maxSpin = 0.01;       // grades
export const spinReduction = 10;   // precentage
export const maxAngleIncreaseFromSpinBounce = PongMath.degToRad(40);


//--------------------------------------------------------------------------
//  ANGLES
//--------------------------------------------------------------------------

export const maxAngleDegrees = 30;
export const minAngle = PongMath.setMinAngle(maxAngleDegrees);
export const maxAngle = PongMath.setMaxAngle(maxAngleDegrees);
export const minAngleFromWall = 30;


//--------------------------------------------------------------------------
//  START POSITIONS
//--------------------------------------------------------------------------

export const p1StartPos = new THREE.Vector3(-(arenaLength / 2 - paddleThickness / 2), 0, 0);
export const p2StartPos = new THREE.Vector3(arenaLength / 2 - paddleThickness / 2, 0, 0);
export const p1StartPos4Player = new THREE.Vector3(-(arenaWidth4Player / 2 - paddleThickness / 2), 0, 0);
export const p2StartPos4Player = new THREE.Vector3(arenaWidth4Player / 2 - paddleThickness / 2, 0, 0);
export const p3StartPos4Player = new THREE.Vector3(0, 0, -(arenaWidth4Player / 2 - paddleThickness / 2));
export const p4StartPos4Player = new THREE.Vector3(0, 0, arenaWidth4Player / 2 - paddleThickness / 2);
export const startPos2P = {
    p1: new THREE.Vector3(-(arenaLength / 2 - paddleThickness / 2), 0, 0),
    p2: new THREE.Vector3(arenaLength / 2 - paddleThickness / 2, 0, 0)
}
export const startPos4P = {
    p1: new THREE.Vector3(-(arenaWidth4Player / 2 - paddleThickness / 2), 0, 0),
    p2: new THREE.Vector3(arenaWidth4Player / 2 - paddleThickness / 2, 0, 0),
    p3: new THREE.Vector3(0, 0, -(arenaWidth4Player / 2 - paddleThickness / 2)),
    p4: new THREE.Vector3(0, 0, arenaWidth4Player / 2 - paddleThickness / 2)
}


//--------------------------------------------------------------------------
//  AI
//--------------------------------------------------------------------------

export const AIreadInterval = 1;
export const SpinLeft = -1;
export const SpinRight = 1;
export const maxOffset = 0.2;
export const AIMargin = 0.1;
export const opponentCornerProximityThreshold = 0.8;
export const cornerProximityAim = 0.9;


//--------------------------------------------------------------------------
//  UI
//--------------------------------------------------------------------------

export const playerCardSizeRatio = 4 / 4
export const playerCardWidth = 150;
export const playerCardHeight = playerCardWidth * playerCardSizeRatio;
export const playerCardThickness = 0.2;
export const playerCardBorderThickness = 4;
export const playerCardSideMargin = playerCardWidth * 0.1;
export const playerCardTopBottomMargin = playerCardHeight * 0.15;

export const playerCardNameSize = playerCardWidth / 6;

export const lifeBoxWidth = playerCardWidth - (playerCardSideMargin * 2);
export const lifeBoxHeight = playerCardHeight * 0.3;

export const lifeSizeRatio = 2 / 3;
export const lifeGapWidthRatio = 1 / 3;
export const lifeThickness = 0.2;
export const lifeBorderThickness = 2;

export const countDownMinSize = 10;
export const countDownMaxSize = 200;


//--------------------------------------------------------------------------
//  POWERUPS
//--------------------------------------------------------------------------

export const POWER_PADDLE_LONG = 0;
export const POWER_PADDLE_SHORT = 1;
export const POWER_LIFE_PLUS = 2;
export const POWER_LIFE_MINUS = 3;
export const POWER_SPEED_PLUS = 4;
export const POWER_SPEED_MINUS = 5;
export const POWER_WAVY_WALLS = 6;

export const powerupIntervalSec = 1;
export const powerupMaxTimeSec = 8;
export const powerupRotationSpeed = 0.01;

export const powerupSphereRadius = 1;
export const powerupSphereSegments = 32;
export const powerupSphereOpacity = 0.1;

export const powerupSize = 1;
export const powerupWidthMargin = arenaWidth * 0.1;
export const powerupLengthMargin = arenaLength * 0.1;

export const paddleSizeIncrement = 1;
export const minPaddleLength = arenaWidth * 0.05;
export const maxPaddleLength = arenaWidth * 0.5;
export const wavyWallsDurationSec = 6;
export const wavyWallsCycles = 3;
export const maxDivergencePercentage = 0.2;



//--------------------------------------------------------------------------
//  ARROW
//--------------------------------------------------------------------------

export const sizeMultiplier = 0.3;
export const arrowThickness = 2.5;
export const arrowBevelSegments = 8;
export const arrowHeadWidth = 3;
export const arrowHeadLength = 1.5;
export const arrowShaftWidth = 1;
export const arrowShaftLength = 1.5;
export const arrowRadius = 0.1;
export const arrowBevelThickness = 0.2;


//--------------------------------------------------------------------------
//  PLUS
//--------------------------------------------------------------------------

export const plusMultiplier = 0.4;
export const plusBevelSegments = 8;
export const plusThickness = 1.3;
export const plusWidth = 1;
export const plusLength = 3;
export const plusRoundnessPercentage = 50;
export const plusSegments = 10;


//--------------------------------------------------------------------------
//  WAVYWALL
//--------------------------------------------------------------------------

export const wavyMultiplier = 0.5;
export const wavyWidth = 2;
export const wavyLength = 3;
export const wavyFloorThickness = 0.1;
export const wavyWallHeight = 0.3;
export const wavyWallThickness = 0.2;
export const wavyHeightSegments = 16;
export const wavyWidthSegments = 16;
export const wavyDotSize = 0.1;
export const wavyHitBoxVisible = false;
export const wavyDotsVisible = false;

export const dotsVisible = true;
export const hitBoxVisible = false;


//--------------------------------------------------------------------------
//  HELPER MACROS
//--------------------------------------------------------------------------

export const horizontal = 0;
export const vertical = 1;