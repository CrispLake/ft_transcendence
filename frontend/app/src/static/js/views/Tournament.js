/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Tournament.js                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/08/02 13:48:55 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/02 14:34:07 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Tournament');

    this.tournamentStats = {
      // LEVEL 0 - GAME 1
      "game1_player1": null,
      "game1_player1_score": null,
      "game1_player2": null,
      "game1_player2_score": null,
      // LEVEL 0 - GAME 2
      "game2_player1": null,
      "game2_player1_score": null,
      "game2_player2": null,
      "game2_player2_score": null,
      // LEVEL 1 - GAME 3
      "game3_player1": null,
      "game3_player1_score": null,
      "game3_player2": null,
      "game3_player2_score": null
    }
  }

  /*
    PARAMETERS
    players: array of player objects
    {
      player1: {...},
      player2: {...},
      player3: {...},
      player4: {...}
    }
    RETURNS:
    pairs: array of player pairs
    {
      {p1, p2},
      {p3, p4}
    }
  */
  matchmaking(players) {
    
  }
  
  // Displays current status of tournament
  displayTournament() {
    
  }

  // Gives notification for users that the next game should start
  promptNextGame() {
    
  } 
}