
import * as THREE from 'three';
import * as G from './globals.js';
import View from '../views/Gonp.js'


export function setPushersColliding(colliding)
{
	for (let i = 0; i < View.game.player1.pushers.length; i++) {
		View.game.player1.pushers[i].colliding = colliding;
	}
	for (let i = 0; i < View.game.player2.pushers.length; i++) {
		View.game.player2.pushers[i].colliding = colliding;
	}
}

export function checkPowerupCollision() {
	let speedup;
	let balance = Math.random();
	let player;
	let players = [
		View.game.player1,
		View.game.player2
	];
	if (balance < 0.5) {
		players[0] = View.game.player2;
		players[1] = View.game.player1;
	}
	for (let i = 0; i < players.length; i++) {
		player = players[i];
		for (let j = 0; j < player.pushers.length; j++) {
			if (View.game.arena.powerup) {
				if (player.pushers[j].box.intersectsBox(View.game.arena.powerup.box)) {
					View.game.scene.remove(View.game.arena.powerup.mesh)
					View.game.arena.powerup.remove();
					View.game.arena.powerup = null;
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

	for (let i = 0; i < View.game.player1.pushers.length; i++) {
		const pusher1 = View.game.player1.pushers[i];
		const box1 = pusher1.box;

		for (let j = 0; j < View.game.player2.pushers.length; j++) {
			const pusher2 = View.game.player2.pushers[j];
			const box2 = pusher2.box;

			if (box1.intersectsBox(box2)) {
				const overlapX = Math.min(box1.max.x, box2.max.x) - Math.max(box1.min.x, box2.min.x);
				let mtv = new THREE.Vector3(overlapX, 0, 0);
				if (pusher1.colliding == false) {
					pusher1.moveX(-(mtv.x / 2 - 0.005));
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
				continue ;
			}
		}
	}
}

export function pushersLogic() {
	setPushersColliding(false);
	checkPushersCollision();
	checkPowerupCollision();
	movePushers();
}

export function movePushers() {
	let pusher;

	for (let i = 0; i < View.game.player1.pushers.length; i++) {
		pusher = View.game.player1.pushers[i];
		View.game.player1.movePusher(pusher);
		if (pusher.furtestX > G.laneEnd) {
			View.game.arena.lanes[pusher.lane].player1scored(pusher.size - (G.pusherMinSize / 2));
			View.game.player1.removePusher(pusher);
		}
		else if (pusher.furtestX < View.game.arena.getOpposingSectionPositionByPusher(pusher)) {
			View.game.arena.lanes[pusher.lane].player1scored(G.passiveScore);
			pusher.downSize(G.passiveScore);
		}
	}
	for (let i = 0; i < View.game.player2.pushers.length; i++) {
		pusher = View.game.player2.pushers[i];
		View.game.player2.movePusher(pusher)
		if (pusher.furtestX < -G.laneEnd) {
			View.game.arena.lanes[pusher.lane].player2scored(pusher.size - (G.pusherMinSize / 2));
			View.game.player2.removePusher(pusher);
		}
		else if (pusher.furtestX > View.game.arena.getOpposingSectionPositionByPusher(pusher)) {
			View.game.arena.lanes[pusher.lane].player2scored(G.passiveScore);
			pusher.downSize(G.passiveScore);
		}
	}
}

export function playersLogic() {
	View.game.player1.logicLoop();
	View.game.player2.logicLoop();
}

export function updatePlayerPosition() {
	View.game.player1.move();
	View.game.player2.move();

}

export function updateBoost() {
	if (View.game.player1.boostPressed) {
		View.game.player1.increaseBoost();
	}
	else {
		View.game.player1.resetBoost();
	}
	if (View.game.player2.boostPressed) {
		View.game.player2.increaseBoost();
	}
	else {
		View.game.player2.resetBoost();
	}
}

