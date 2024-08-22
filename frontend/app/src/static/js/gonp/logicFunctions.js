
import * as THREE from 'three';
import * as G from './globals.js';
import { game } from './gonp.js'

// let player1 = game.player1;
// let player2 = game.player2;
// let scene = game.scene;
// let arena = game.arena;

export function setPushersColliding(colliding)
{
	for (let i = 0; i < game.player1.pushers.length; i++) {
		game.player1.pushers[i].colliding = colliding;
		// game.player1.pushers[i].collisionNumber = -1;
	}
	for (let i = 0; i < game.player2.pushers.length; i++) {
		game.player2.pushers[i].colliding = colliding;
		// game.player2.pushers[i].collisionNumber = -1;
	}
}

export function checkPowerupCollision() {
	let speedup;
	let balance = Math.random();
	let player;
	let players = [
		game.player1,
		game.player2
	];
	if (balance < 0.5) {
		players[0] = game.player2;
		players[1] = game.player1;
	}
	for (let i = 0; i < players.length; i++) {
		player = players[i];
		for (let j = 0; j < player.pushers.length; j++) {
			if (game.arena.powerup) {
				if (player.pushers[j].box.intersectsBox(game.arena.powerup.box)) {
					game.scene.remove(game.arena.powerup.mesh)
					game.arena.powerup.remove();
					game.arena.powerup = null;
					speedup = player.pushers[j].size > G.pusherMaxSize * 0.9;
					player.pushers[j].upSize(G.pusherMaxSize);
					if (speedup) {
						player.pushers[j].speed *= 2;
					}
				}
			}
		}
	}
}

function checkPushersCollision() {
	let collisionNumber = 0;

	for (let i = 0; i < game.player1.pushers.length; i++) {
		const pusher1 = game.player1.pushers[i];
		const box1 = pusher1.box;
		pusher1.collisionNumber = -1;

		for (let j = 0; j < game.player2.pushers.length; j++) {
			const pusher2 = game.player2.pushers[j];
			const box2 = pusher2.box;
			pusher2.collisionNumber = -1;

			if (box1.intersectsBox(box2)) {
				const overlapX = Math.min(box1.max.x, box2.max.x) - Math.max(box1.min.x, box2.min.x);
				let mtv = new THREE.Vector3(overlapX, 0, 0);
				if (pusher1.colliding == false) {
					pusher1.moveX -= (-(mtv.x / 2 - 0.005));
				}
				if (pusher2.colliding == false) {
					pusher2.moveX(mtv.x / 2 - 0.005);
				}
				pusher1.downSize(G.pusherFightValue);
				pusher2.downSize(G.pusherFightValue);
				pusher1.colliding = true;
				pusher2.colliding = true;
				pusher1.updateBoundingBox();
				pusher2.updateBoundingBox();
				pusher1.collisionNumber = collisionNumber;
				pusher2.collisionNumber = collisionNumber;
				collisionNumber++;
				continue ;
			}
		}
	}
}

// function moveCollisionGroups() {
// 	let velocity = [];
// 	let mass = [];
// 	let momentum = [];
// 	let collisionNumber = -1;
// 	let i;


// 	for (i = 0; i < game.player1.pushers.length; i++) {
// 		collisionNumber = game.player1.pushers[i].collisionNumber;
// 		if (collisionNumber >= 0) {
// 			if (velocity[collisionNumber] === undefined) {
// 				velocity[collisionNumber] = 0;
// 			}
// 			velocity[collisionNumber] -= game.player1.pushers[i].speed;
// 			if (mass[collisionNumber] === undefined) {
// 				mass[collisionNumber] = 0;
// 			}
// 			mass[collisionNumber] -= game.player1.pushers[i].size;
// 		}
// 	}
// 	for (i = 0; i < game.player2.pushers.length; i++) {
// 		collisionNumber = game.player2.pushers[i].collisionNumber;
// 		if (collisionNumber >= 0) {
// 			if (velocity[collisionNumber] === undefined) {
// 				velocity[collisionNumber] = 0;
// 			}
// 			velocity[collisionNumber] += game.player2.pushers[i].speed;
// 			if (mass[collisionNumber] === undefined) {
// 				mass[collisionNumber] = 0;
// 			}
// 			mass[collisionNumber] += game.player2.pushers[i].size;
// 		}
// 	}
// 	for (i = 0; i < mass.length; i++) {
// 		momentum[i] = velocity[i];
// 	}
// 	for (i = 0; i < velocity.length; i++) {
// 		momentum[i] -= mass[i] * (momentum[i] > 0 ? 1 : -1);
// 	}
// 	for (i = 0; i < game.player1.pushers.length; i++) {
// 		if (game.player1.pushers[i].collisionNumber >= 0) {
// 			game.player1.pushers[i].moveX(momentum[game.player1.pushers[i].collisionNumber]);
// 		}
// 	}
// 	for (i = 0; i < game.player2.pushers.length; i++) {
// 		if (game.player2.pushers[i].collisionNumber >= 0) {
// 			game.player2.pushers[i].moveX(momentum[game.player2.pushers[i].collisionNumber]);
// 		}
// 	}
// 	// console.log(velocity, mass, momentum);
// }

export function pushersLogic() {
	setPushersColliding(false);
	checkPowerupCollision();
	checkPushersCollision();
	movePushers();
	// moveCollisionGroups();
}

export function movePushers() {
	let pusher;

	// console.log(game.player1.pushers)
	for (let i = 0; i < game.player1.pushers.length; i++) {
		pusher = game.player1.pushers[i];
		game.player1.movePusher(pusher);
		if (pusher.furtestX > G.laneEnd) {
			game.arena.lanes[pusher.lane].player1scored(pusher.size - (G.pusherMinSize / 2));
			game.player1.removePusher(pusher);
		}
		else if (pusher.furtestX < game.arena.getOpposingSectionPositionByPusher(pusher)) {
			game.arena.lanes[pusher.lane].player1scored(G.passiveScore);
			pusher.downSize(G.passiveScore);
		}
	}
	for (let i = 0; i < game.player2.pushers.length; i++) {
		pusher = game.player2.pushers[i];
		game.player2.movePusher(pusher)
		if (pusher.furtestX < -G.laneEnd) {
			game.arena.lanes[pusher.lane].player2scored(pusher.size - (G.pusherMinSize / 2));
			game.player2.removePusher(pusher);
		}
		// else if (pusher.furtestX > G.laneEnd ) {
		// 	game.arena.lanes[pusher.lane].player2scored(pusher.size - (G.pusherMinSize / 2));
		// 	game.player2.removePusher(pusher);
		// }
		else if (pusher.furtestX > game.arena.getOpposingSectionPositionByPusher(pusher)) {
			game.arena.lanes[pusher.lane].player2scored(G.passiveScore);
			pusher.downSize(G.passiveScore);
		}
	}
}

export function playersLogic() {
	game.player1.logicLoop();
	game.player2.logicLoop();
}

export function updatePlayerPosition() {
	game.player1.move();
	game.player2.move();

}

export function updateBoost() {
	if (game.player1.boostPressed) {
		game.player1.increaseBoost();
	}
	else {
		game.player1.resetBoost();
	}
	if (game.player2.boostPressed) {
		game.player2.increaseBoost();
	}
	else {
		game.player2.resetBoost();
	}
}
