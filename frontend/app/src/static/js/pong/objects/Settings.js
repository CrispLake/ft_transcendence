export class Settings
{
	constructor(playerCount, multiMode)
	{
		console.log("players: " + playerCount + " multimode: " + multiMode);
		this.multiMode = multiMode;
		this.players = playerCount;
		this.spin = true;
	}
}