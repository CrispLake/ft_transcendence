import * as COLOR from '../colors.js';

export class Settings
{
	constructor()
	{
		this.tournament = false;
		this.multiMode = false;
		this.players = 1;
		this.spin = true;
		this.powerups = true;
		this.difficulty = 2;
		// this.playerColors = {
		// 	p1: COLOR.CYAN,
		// 	p2: COLOR.CYAN,
		// 	p3: COLOR.CYAN,
		// 	p4: COLOR.CYAN
		// };
	}
}