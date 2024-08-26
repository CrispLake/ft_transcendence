export class Settings
{
	constructor(params)
	{
		console.log('settings: ', params);

		this.tournament = params.tournament;
		this.multiMode = params.multiMode;
		this.players = params.players;
		this.spin = true;
		this.powerups = params.powerups;
		this.difficulty = params.difficulty;
	}
}
