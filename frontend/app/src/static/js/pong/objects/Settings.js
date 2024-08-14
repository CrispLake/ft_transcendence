export class Settings
{
    constructor({ playerCount, multiMode, tournament, powerups, diff })
	{
		this.multiMode = multiMode;
		this.players = playerCount;
        this.tournament = tournament;
        this.powerups = powerups;
        this.diff = diff;

		this.spin = true;//  is this necessary??
    }
}
