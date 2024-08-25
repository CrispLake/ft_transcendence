import * as COLOR from '../colors.js';

export class Settings
{
	constructor(params)
	{
		console.log('settings: ', params);

		this.tournament = params.tournament;
		this.multiMode = params.multiMode;
		this.players = params.players;
		this.spin = true; // haha lol
		this.powerups = params.powerups;
		this.difficulty = params.difficulty;
	}

	// constructor ()
	// {
	// 	this.tournament = false;
	// 	this.multiMode = true;
	// 	this.players = 1;
	// 	this.spin = true;
	// 	this.powerups = true;
	// 	this.difficulty = 3;
	// }
}
