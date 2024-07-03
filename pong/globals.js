import * as THREE from 'three';
import * as PongMath from './math.js';

// Arena
export const arenaLength = 25;
export const arenaWidth = 15;
export const wallHeight = 0.5;
export const wallThickness = 0.2;
export const floorThickness = 0.2;
export const floorWidth = arenaWidth + wallThickness * 2;
export const wallLightIntensity = 1;
export const fadeTimeSec = 0.3;

// Paddle
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
export const boostOffset = 1;
export const boostMeterAnimationTime = 1;
export const boostAnimationMaxMovement = 0.4


// Ball
export const initialBallRadius = 0.2;
export const initialBallSpeed = 0.2;
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
export const maxSpin = 0.01;       // grades
export const spinReduction = 10;   // precentage
export const maxAngleIncreaseFromSpinBounce = PongMath.degToRad(40);

// Angles
export const maxAngleDegrees = 30;
export const minAngle = PongMath.setMinAngle(maxAngleDegrees);
export const maxAngle = PongMath.setMaxAngle(maxAngleDegrees);
export const minAngleFromWall = 30;

export const winningScore = 3;
export const fps = 60;

export const horizontal = 0;
export const vertical = 1;

// 4 Player
export const arenaWidth4Player = 25;
export const wallLength4Player = 5;

// Start Positions
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
