export class Results
{
	constructor()
	{
		this.result2p = {
			"player1": "",
			"player1Score": 0,
			"player2": "",
			"player2Score": 0
		}
		this.result4p = {
			"player1": "",
			"player1Score": 0,
			"player2": "",
			"player2Score": 0,
			"player3": "",
			"player3Score": 0,
			"player4": "",
			"player4Score": 0
		}
	}

	getResult2p() {return this.result2p;}
	getResult4p() {return this.result4p;}

	setResult2p(player1, player2)
	{
		this.result2p.player1 = player1.name;
		this.result2p.player1Score = player1.lives;
		this.result2p.player2 = player2.name
		this.result2p.player2Score = player2.lives;
	}

	setResult4p(player1, player2, player3, player4)
	{
		this.result4p.player1 = player1.name;
		this.result4p.player1Score = player1.lives;
		this.result4p.player2 = player2.name;
		this.result4p.player2Score = player2.lives;
		this.result4p.player3 = player3.name;
		this.result4p.player3Score = player3.lives;
		this.result4p.player4 = player4.name;
		this.result4p.player4Score = player4.lives;
	}
}