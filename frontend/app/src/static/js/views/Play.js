/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:10:36 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/02 13:09:23 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Settings } from '../pong/objects/Settings.js';
import AbstractView from './AbstractView.js';

import GameMode from './GameMode.js';
import GameSetup from './GameSetup.js';
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
      'gonp': 2,
      'pong4': 3,
      'tournament': 4,
    }
  }

  // Choose how to play here
  async ChooseGameMode() {
    const gameModeObj = new GameMode();
    this.gameMode = await gameModeObj.getUserInput();
  }

  // TODO: make it wait and return the results --> also for 4p
  //        remove event listeners when game finished!
  // Launch 2p or 4p pong game
  // PARAMS: players: 2 || 4
  async Pong() {
    const pong = new Pong();
    pong.AddListeners();
    await pong.launchGame(this.settings);
    // pong.RemoveListeners();
  }

  // Launch 2p Gonp
  async GameSetup() {
    const gameSetupObj = new GameSetup(this.gameMode);
    this.settings = await gameSetupObj.getUserInput();
    this.settings.players.map(entry =>
        console.log(`id: ${entry.id}\n${entry.token}\n${entry.username}`
        ));
    gameSetupObj.RemoveListeners();
    this.settings = new Settings(1, false);
  }

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
}