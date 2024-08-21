import * as COLOR from '../colors.js';

export class Settings
{
	constructor(params)
	{
		console.log('settings: ', params);

		this.tournament = params.tournament;
		this.multiMode = params.multiMode;
		this.players = params.players;
		this.spin = true; // should get rid of
		this.powerups = params.powerups;
		this.difficulty = params.difficulty;
	}
}
