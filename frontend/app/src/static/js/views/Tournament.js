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

import { Notification } from "../notification.js";
import AbstractView from "./AbstractView.js";
import Pong from "./Pong.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Tournament');

    this.level = 0;
    this.app = null;
    this.players = null;
    this.settings = null;

    this.stats = {
      // LEVEL 0 - GAME 1
      "g1_p1": null,
      "g1_p1_score": null,
      "g1_p2": null,
      "g1_p2_score": null,
      // LEVEL 0 - GAME 2
      "g2_p1": null,
      "g2_p1_score": null,
      "g2_p2": null,
      "g2_p2_score": null,
      // LEVEL 1 - GAME 3
      "g3_p1": null,
      "g3_p1_score": null,
      "g3_p2": null,
      "g3_p2_score": null
    }
  }

  initialize(params) {
    this.app = document.getElementById('app');
    if (!this.app) {
      return -1
    }
    this.settings = params;
    this.players = params.players;
    if (!this.settings || !this.players) {
      return -1;
    }
    this.matchmaking();
  }

  // Takes in a list of players and sorts them based on their winrate
  // then bottom half and top half will play against each other resulting
  // in a fairest possbile games between these four players
  matchmaking() {
    this.players = players.sort((a, b) => a.winrate, b.winrate);
    this.stats.g1_p1 = players[0];
    this.stats.g1_p2 = players[1];
    this.stats.g2_p1 = players[2];
    this.stats.g2_p2 = players[3];
  }
  
  // grab winners of two previous games and make a final game out of those
  createFinalGame() {
    const g1_winner = this.stats.g1_p1_score > this.stats.g1_p2_score ? this.stats.g1_p1 : this.stats.g1_p2;
    const g2_winner = this.stats.g2_p1_score > this.stats.g2_p2_score ? this.stats.g2_p1 : this.stats.g2_p2;
    this.stats.g3_p1 = g1_winner;
    this.stats.g3_p2 = g2_winner;
  }

  // Displays current status of tournament
  displayTournament() {
    
  }

  // Gives notification for users that the next game should start
  promptNextGame() {
    
  } 




  WaitForUser() {
    return new Promise((resolve) => {
     // TODO: add a listener here for some event that the tournament is finnished 
    });
  }

  async getUserInput() {
  
  }

  AddListeners() {

  }

  RemoveListeners() {

  }

  async getHtml() {
    return `

    `;
  }
}
