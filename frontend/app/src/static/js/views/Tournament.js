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
import Result from "./Result.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Tournament');

    this.level = 0;
    this.game = 0;
    this.app = null;
    this.confirm = null;
    this.resolve = null;
    this.players = null;
    this.settings = null;

    this.stats = {
      "winner": null,
      // LEVEL 0 - GAME 1
      "g1_p1": null,
      "g1_p1_score": null,
      "g1_p2": null,
      "g1_p2_score": null,
      "g1_winner": null,
      // LEVEL 0 - GAME 2
      "g2_p1": null,
      "g2_p1_score": null,
      "g2_p2": null,
      "g2_p2_score": null,
      "g2_winner": null,
      // LEVEL 1 - GAME 3
      "g3_p1": null,
      "g3_p1_score": null,
      "g3_p2": null,
      "g3_p2_score": null,
      "g3_winner": null,
    }

    this.initialize = this.initialize.bind(this);
    this.getNextPlayers = this.getNextPlayers.bind(this);
    this.saveResults = this.saveResults.bind(this);
    this.matchmaking = this.matchmaking.bind(this);
    this.displayTournament = this.displayTournament.bind(this);
    this.WaitForUser = this.WaitForUser.bind(this);
    this.getUserInput = this.getUserInput.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.confirmHandler = this.confirmHandler.bind(this);
    this.declineHandler = this.declineHandler.bind(this);
  }

  async initialize(params) {
    this.app = await document.getElementById('game-app');
    this.confirm = await document.getElementById('confirm-div')
    if (!this.app || !this.confirm) {
      console.log('could not find this.app');
      return -1
    }
    this.settings = params;
    this.players = params.players;
    if (!this.settings || !this.players) {
      console.log('returning error from init');
      return -1;
    }
    this.matchmaking();
    this.AddListeners();
  }

  // Takes in a list of players and sorts them based on their winrate
  // then bottom half and top half will play against each other resulting
  // in a fairest possbile games between these four players
  matchmaking() {
    if (this.players.length !== 4) {
      this.Redirect('/500');
      return;
    }

    this.players = this.players.sort((a, b) => a.winrate - b.winrate);
    this.stats.g1_p1 = this.players[0];
    this.stats.g1_p2 = this.players[1];
    this.stats.g2_p1 = this.players[2];
    this.stats.g2_p2 = this.players[3];
  }
  
  fillPlayerCard(player) {
    if (!player) {
      return `
        <svg class="player-card-image" height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#000000;} </style> <g> <path class="st0" d="M396.138,85.295c-13.172-25.037-33.795-45.898-59.342-61.03C311.26,9.2,280.435,0.001,246.98,0.001 c-41.238-0.102-75.5,10.642-101.359,25.521c-25.962,14.826-37.156,32.088-37.156,32.088c-4.363,3.786-6.824,9.294-6.721,15.056 c0.118,5.77,2.775,11.186,7.273,14.784l35.933,28.78c7.324,5.864,17.806,5.644,24.875-0.518c0,0,4.414-7.978,18.247-15.88 c13.91-7.85,31.945-14.173,58.908-14.258c23.517-0.051,44.022,8.725,58.016,20.717c6.952,5.941,12.145,12.594,15.328,18.68 c3.208,6.136,4.379,11.5,4.363,15.574c-0.068,13.766-2.742,22.77-6.603,30.442c-2.945,5.729-6.789,10.813-11.738,15.744 c-7.384,7.384-17.398,14.207-28.634,20.479c-11.245,6.348-23.365,11.932-35.612,18.68c-13.978,7.74-28.77,18.858-39.701,35.544 c-5.449,8.249-9.71,17.686-12.416,27.641c-2.742,9.964-3.98,20.412-3.98,31.071c0,11.372,0,20.708,0,20.708 c0,10.719,8.69,19.41,19.41,19.41h46.762c10.719,0,19.41-8.691,19.41-19.41c0,0,0-9.336,0-20.708c0-4.107,0.467-6.755,0.917-8.436 c0.773-2.512,1.206-3.14,2.47-4.668c1.29-1.452,3.895-3.674,8.698-6.331c7.019-3.946,18.298-9.276,31.07-16.176 c19.121-10.456,42.367-24.646,61.972-48.062c9.752-11.686,18.374-25.758,24.323-41.968c6.001-16.21,9.242-34.431,9.226-53.96 C410.243,120.761,404.879,101.971,396.138,85.295z"></path> <path class="st0" d="M228.809,406.44c-29.152,0-52.788,23.644-52.788,52.788c0,29.136,23.637,52.772,52.788,52.772 c29.136,0,52.763-23.636,52.763-52.772C281.572,430.084,257.945,406.44,228.809,406.44z"></path> </g> </g></svg>
      `;
    }
    else if (player.username === 'AI') {
      return `
        <img class="player-card-image" src="static/images/ai.avif" alt="player icon">
        <h2 class="font-text card-name-text">${player.username}</h2>
      `;
    }
    else if (player.username.includes('Guest')) {
      return `
        <img class="player-card-image" src="static/images/guest.png" alt="player icon">
        <h2 class="font-text card-name-text">${player.username}</h2>
      `;
    }
    else {
      return `
        <img class="player-card-image" src="http://localhost:8000/account/${player.id}/image" alt="player icon">
        <h2 class="font-text card-name-text">${player.username}</h2>
      `;
    }
  }

  // Displays current status of tournament
  displayTournament() {
    let g1 = '', g2 = '', g3 = '';

    if (this.level >= 0)
      g1 = this.stats.g1_winner === 1 ? 'winner-p1' : 'winner-2';
    if (this.level >= 1)
      g2 = this.stats.g2_winner === 1 ? 'winner-p1' : 'winner-2';
    if (this.level >= 2)
      g3 = this.stats.g3_winner === 1 ? 'winner-p1' : 'winner-2';

    this.app.innerHTML = `
      <div class="tournament-page">
        <div class="level-0-div">
          <div class="pair-holder">
            <h3 class="font-text">GAME 1</h3>
            <div class="pair ${g1}">
              <div class="player-card">${this.fillPlayerCard(this.stats.g1_p1)}</div>
              <h1 class="font-sub pair-vs">VS</h1>
              <div class="player-card">${this.fillPlayerCard(this.stats.g1_p2)}</div>
            </div>
          </div>
          <div class="pair-holder">
            <h3 class="font-text">GAME 2</h3>
            <div class="pair ${g2}">
              <div class="player-card">${this.fillPlayerCard(this.stats.g2_p1)}</div>
              <h1 class="font-sub pair-vs">VS</h1>
              <div class="player-card">${this.fillPlayerCard(this.stats.g2_p2)}</div>
            </div>
          </div>
        </div>
        <div class="level-1-div">
          <div class="pair-holder">
            <h3 class="font-text">GAME 3</h3>
            <div class="pair ${g3}">
              <div class="player-card">${this.fillPlayerCard(this.stats.g3_p1)}</div>
              <h1 class="font-sub pair-vs">VS</h1>
              <div class="player-card">${this.fillPlayerCard(this.stats.g3_p2)}</div>
            </div>
          </div>
        </div>
        <div class="level-2-div">
          <h1 class="font-heading tournament-winner-text">WINNER</h1>
        </div>

        <div class="info-div">
          <h2 class="font-sub info-text">click anywhere to continue</h2>
          <svg class="info-img" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="layer1"> <path d="M 7 1 C 5.3431455 1 4 2.3431458 4 4 L 4 13.5 C 4 16.537566 6.462434 19 9.5 19 C 12.537566 19 15 16.537566 15 13.5 L 15 4 C 15 2.3431458 13.656854 1 12 1 L 7 1 z M 7 2 L 9 2 L 9 8 L 10 8 L 10 2 L 12 2 C 13.104569 2 14 2.8954305 14 4 L 14 13.5 C 14 15.985281 11.985281 18 9.5 18 C 7.014719 18 5 15.985281 5 13.5 L 5 4 C 5 2.8954305 5.8954305 2 7 2 z " style="fill:#222222; fill-opacity:1; stroke:none; stroke-width:0px;"></path> </g> </g></svg>
        </div>

      </div>
    `;
  }

  saveResults(results) {
    console.log(results);
    
    switch(this.level) {
      case 0:
        this.stats.g3_p1 = results.winner;
        break;
      
      case 1:
        this.stats.g3_p2 = results.winner;
        break;

      case 2:
        this.stats.winner = results.winner;
        break;
    }
  }

  // Return a list of two players based on the level
  getNextPlayers() {
    const payload = [];

    switch(this.level) {
      case 0:
        payload.push(this.stats.g1_p1);
        payload.push(this.stats.g1_p2);
        break;
      
      case 1:
        payload.push(this.stats.g2_p1);
        payload.push(this.stats.g2_p2);
        break;

      case 2:
        payload.push(this.stats.g3_p1);
        payload.push(this.stats.g3_p2);
        break;
    }
    return payload;
  } 

  clickHandler(event) {
    event.preventDefault();
    this.confirm.style.display = 'flex';
  }

  WaitForUser() {
    if (this.resolve === null) {
      return new Promise((resolve) => {
        this.app.addEventListener('click', this.clickHandler);
        this.resolve = resolve;
      });
    }
  }

  async getUserInput() {
    await this.WaitForUser();
  }


  confirmHandler(event) {
    event.preventDefault();
    if (this.resolve === null) {
      return;
    }
    
    this.resolve();
    this.resolve = null;
    this.confirm.style.display = 'none';
  }


  declineHandler(event) {
    event.preventDefault();
    this.confirm.style.display = 'none'; 
  }


  AddListeners() {
    const confirmButton = document.getElementById('confirm-button');
    const declineButton = document.getElementById('decline-button');
    
    try {
      confirmButton.addEventListener('click', this.confirmHandler);
      declineButton.addEventListener('click', this.declineHandler);
    }
    catch(error) {
      console.log(error);
      this.Redirect('/500');
      return;
    }
  }

  RemoveListeners() {
    const confirmButton = document.getElementById('confirm-button');
    const declineButton = document.getElementById('decline-button');

    try {
      confirmButton.removeEventListener('click', this.confirmHandler);
      declineButton.removeEventListener('click', this.declineHandler);
      
      this.app.removeEventListener('click', this.clickHandler);
    }
    catch(error) {
      console.log(error);
      this.Redirect('/500');
      return;
    }
  }

  async getHtml() {
    return `
      <div id="game-app"></div>
      
      <div id="confirm-div">
        <h2 class="font-sub">Continue?</h2>
        <div class="confirm-buttons">
          <button id="confirm-button" class="font-text">Yes</button>
          <button id="decline-button" class="font-text">No</button>
        </div>
      </div>
    `;
  }
}
