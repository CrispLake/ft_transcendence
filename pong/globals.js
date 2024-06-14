import * as PongMath from './math.js';

// Arena
export const arenaLength = 25;
export const arenaWidth = 15;
export const wallHeight = 0.5;
export const wallThickness = 0.2;
export const floorThickness = 0.2;
export const floorWidth = arenaWidth + floorThickness * 2;
export const wallLightIntensity = 1;

// Paddle
export const paddleLightIntensity = 1;
export const paddleLength = 4;
export const paddleHeight = wallHeight;
export const paddleThickness = 0.2;
export const initialPaddleSpeed = 0.2;

// Player
export const p1StartPos = {
    x: -(arenaLength / 2 - paddleThickness / 2),
    y: 0,
    z: 0
};
export const p2StartPos = {
    x: (arenaLength / 2 - paddleThickness / 2),
    y: 0,
    z: 0
};

// Ball
export const initialBallRadius = 0.2;
export const initialBallSpeed = 0.2;
export const initialStartingAngle = 30;
export const speedIncrement = 0.01;
export const ballStartPos = {
    x: 0,
    y: 0,
    z: 0
};

// Angles
export const maxAngleDegrees = 20;
export const minAngle = PongMath.setMinAngle(maxAngleDegrees);
export const maxAngle = PongMath.setMaxAngle(maxAngleDegrees);
