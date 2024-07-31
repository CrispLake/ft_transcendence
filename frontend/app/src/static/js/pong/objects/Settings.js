export class Settings
{
	constructor(playerCount, multiMode)
	{
		console.log("players: " + playerCount + " multimode: " + multiMode);
		this.multiMode = multiMode;
		this.players = playerCount;
		this.spin = true;

    // tournament
    // power ups
    // difficulty 1-3 for AI
	}
}