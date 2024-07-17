import * as THREE from 'three';

// ----Base Colors----
const PURPLE = new THREE.Color(0xff00ff);
const CYAN = new THREE.Color(0x11ffff);
const RED = new THREE.Color(0xff1111);
const GREEN = new THREE.Color(0x11ff11);
const YELLOW = new THREE.Color(0xffff11);
const ORANGE = new THREE.Color(0xff7722);
const WHITE = new THREE.Color(0xffffff);
const BLACK = new THREE.Color(0x000000);
const GRAY = new THREE.Color(0x555555);
const DARK_GRAY = new THREE.Color(0x222222);

// ----Object Colors----
export const FLOOR = GRAY;
export const WALL = PURPLE;
export const WALL_LIGHT = WHITE;
export const PONG = BLACK;
export const PONG_AURA = CYAN;
export const BACKWALL = BLACK;

export const PADDLE1 = CYAN;
export const PADDLE2 = CYAN;
export const PADDLE3 = CYAN;
export const PADDLE4 = CYAN;
export const PADDLE1_LIGHT = WHITE;
export const PADDLE2_LIGHT = WHITE;
export const PADDLE3_LIGHT = WHITE;
export const PADDLE4_LIGHT = WHITE;
export const BOOSTMETER = WHITE;
export const BOOSTMETER_FULL = RED;

export const BALL = WHITE;

export const UI_NAME = CYAN;
export const UI_SCORE = WHITE;
export const UI_PLAYERCARD_BG = DARK_GRAY;
export const UI_PLAYERCARD_BORDER = PURPLE;
export const UI_LIFE = WHITE;

export const POWER_PADDLE_LONG = GREEN;
export const POWER_PADDLE_SHORT = RED;
export const POWER_LIFE_PLUS_INNER = GREEN;
export const POWER_LIFE_PLUS_FRAME = WHITE;
export const POWER_WAVY_WALLS = PURPLE;