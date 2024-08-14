/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:10:36 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/02 14:38:00 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Settings } from '../pong/objects/Settings.js';
import AbstractView from './AbstractView.js';

import Tournament from './Tournament.js';
import GameSetup from './GameSetup.js';
import GameMode from './GameMode.js';
import Results from './Result.js';
import Pong from './Pong.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Play');
    this.listeners = true;

    this.setupObj = null;
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

  // Launch 2p Gonp
  async GameSetup() {
        const gameSetupObj = new GameSetup(this.gameMode);
        this.setupObj = await gameSetupObj.getUserInput();
        await gameSetupObj.RemoveListeners();
    }

  // TODO: make it wait and return the results --> also for 4p
  //        remove event listeners when game finished!
  // Launch 2p or 4p pong game
  // PARAMS: players: 2 || 4
  async Pong() {
    const pong = new Pong();
    await pong.AddListeners();

    const gameResults = await pong.fakeGame(this.setupObj);

    await pong.RemoveListeners();
    const resultsView = new Results();
    await resultsView.getUserInput(gameResults);
  }

  Gonp() {
    
  }

  // Launch 4p tournament
  Tournament() {
    // --- level 0 ---
    // create original pairs based on win rate
    // prompt first game
    // play the game 1
    // display results and prompt next game
    // game 2
    // prompt results

    // --- level 1 ---
    // create pair of two winners
    // prompt game
    // play game

    // --- level 2 ---
    // display tournament results
    // post data
  }

  // This function will be responsible running the whole process
  // from setup to displaying stats after the game
  async app() {
    await this.ChooseGameMode();
    await this.GameSetup();

    switch (this.gameMode) {
      case this.modes.pong2:      // 2
        await this.Pong();
        break;
      case this.modes.pong4:      // 2
        await this.Pong();
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
