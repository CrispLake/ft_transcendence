export let powerups = true;
export let time = 3;


export const playerLightIntensity = 1;
export const playerLength = 1;
export const playerHeight = 1;
export const playerThickness = 1;

export const boostMeterWidth = playerHeight;
export const boostMeterThickness = 0.05;
export const boostMeterLength = playerLength;
export const maxBoost = 1;
export const boostIncrement = 0.01;
export const boostDecrement = boostIncrement * 2;

// Arena
export const laneLength = 25;
export const laneHeight = 0.5;
export const laneWidth = 0.2;
export const laneThickness = 1;
export const laneSpacing = 5;
export const laneOriginX = 0;

export const arenaLength = 25;
export const arenaWidth = 15;
export const wallLightIntensity = 1;
export const laneY = (- (playerThickness)) + laneHeight / 2;

// Player
export const p1StartPos = {
	x: -(arenaLength / 2 + playerThickness / 2),
	y: 0,
	z: 0
};
export const p2StartPos = {
	x: (arenaLength / 2 + playerThickness / 2),
	y: 0,
	z: 0
};

export const lanePositions = [
	0 - laneSpacing,
	0,
	0 + laneSpacing
]

// Pushers
export const pusherSpeed = 0.15;
export const pusherMinSize = 0.3;
export const pusherMaxSize = 1;
export const pusherFightValue = 0.002;

export const passiveScore = 0.001;

export const laneEnd = 0 + (laneLength / 2);

export const fps = 60;
