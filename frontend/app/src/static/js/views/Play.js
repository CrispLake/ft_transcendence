/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:10:36 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/01 18:33:33 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from './AbstractView.js';

import GameMode from './GameMode.js';
import Pong from './Pong.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Play');
    this.listeners = true;

    this.settings = null;
    this.gameMode = null;
    this.results = null;
    
    this.modes = {
      'pong2': 1,
      'pong4': 2,
      'tournament': 3,
      'gonp': 4,
    }
  }

  // Choose how to play here
  async ChooseGameMode() {
    const gameModeObj = new GameMode();
    this.gameMode = await gameModeObj.getUserInput();
  }

  // Retrieve game settings based on game mode
  GameSetup() {
    
  }

  // TODO: make it wait and return the results --> also for 4p
  //        remove event listeners when game finished!
  // Launch 2p or 4p pong game
  // PARAMS: players: 2 || 4
  async Pong() {
    const pong = new Pong();
    pong.AddListeners();
    await pong.launchGame();
    console.log('after game');
  }

  // Launch 2p Gonp
  Gonp() {
    
  }

  /*
    1. matchmaking page
    2. next game page
    3. final stats page
  */
  // Launch 4p tournament
  Tournament() {

  }

  // This function will be responsible running the whole process
  // from setup to displaying stats after the game
  async app() {
    await this.ChooseGameMode();
    await this.GameSetup();

    switch (this.gameMode) {
      case this.modes.pong2:      // 1
        this.Pong();
        break;
      case this.modes.pong4:      // 2
        this.Pong();
        break;
      case this.modes.tournament: // 3
        this.Tournament();
        break;
      case this.modes.gonp:       // 4
        this.Gonp();
        break;
    }
  }
  
  // Used as init function here as router will call AddListeners()
  // and constructor has already been executed when originally loaded
  AddListeners() {
    this.gameDiv = document.getElementById('app');
    this.app();
  }

  RemoveListeners() {
    
  }

  async getHtml() {
    return ``;
  }
}