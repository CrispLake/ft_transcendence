
import * as KEY from './keys.js';
import game from '../views/Gonp.js'

export function handleKeyDown(event)
{
	let player1 = game.player1;
	let player2 = game.player2;
		if (event.repeat && event.key != KEY.P1_BOOST && event.key != KEY.P2_BOOST && event.key != KEY.P1_BOOST_PAUSE && event.key != KEY.P2_BOOST_PAUSE)
	{
		handleKeyUp(event);
		return ;
	}
	switch (event.key)
	{
		case KEY.P1_LEFT:
			player1.moveLeft = true;
			break;
		case KEY.P1_RIGHT:
			player1.moveRight = true;
			break;
		case KEY.P1_BOOST_PAUSE:
			player1.boostPaused = true;
			break;
		case KEY.P1_BOOST:
			player1.boostPressed = true;
			break;
		case KEY.P2_LEFT:
		   player2.moveLeft = true;
		   break;
		case KEY.P2_RIGHT:
			player2.moveRight = true;
			break;
		case KEY.P2_BOOST_PAUSE:
			player2.boostPaused = true;
			break;
		case KEY.P2_BOOST:
			player2.boostPressed = true;
			break;
		case 'b':
			console.log(player1.pushers, player2.pushers);
			break ;
		}
}

export function handleKeyUp(event)
{
	let player1 = game.player1;
	let player2 = game.player2;
		switch (event.key)
	{
		case KEY.P1_LEFT:
			player1.moveLeft = false;
			break;
		case KEY.P1_RIGHT:
			player1.moveRight = false;
			break;
		case KEY.P1_BOOST_PAUSE:
			player1.boostPaused = false;
			break;
		case KEY.P1_BOOST:
			player1.boostPressed = false;
			break;
		case KEY.P2_LEFT:
			player2.moveLeft = false;
			break;
		case KEY.P2_RIGHT:
			player2.moveRight = false;
			break;
		case KEY.P2_BOOST_PAUSE:
			player2.boostPaused = false;
			break;
		case KEY.P2_BOOST:
			player2.boostPressed = false;
			break;
	}
}

// document.removeEventListener('keyup', handleKeyUp);
// document.removeEventListener('keydown', handleKeyDown);


// ----Window resize----
export function onWindowResize( event )
{
	let renderer = game.renderer;
	let camera = game.camera;
	var width = window.innerWidth;
	var height = window.innerHeight;

	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}
