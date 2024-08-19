/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: joonasmykkanen <joonasmykkanen@student.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:10:36 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/14 15:45:24 by joonasmykka      ###   ########.fr       */
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

  async Pong() {
    const pong = new Pong();
    await pong.AddListeners();

    const gameResults = await pong.fakeGame(this.setupObj);

    await pong.RemoveListeners();
    const resultsView = new Results();
    await resultsView.getUserInput(gameResults);
  }

  async Gonp() {
    
  }

  // Launch 4p tournament
  async Tournament() {
    const tournamentObject = new Tournament();
    const appElem = document.getElementById('app');
    if (!appElem) {
      console.log('tournament appelem ret');
      return;
    }

    appElem.innerHTML = await tournamentObject.getHtml();


    if (await tournamentObject.initialize(this.setupObj) === -1) {
      this.Redirect('/500');
      return;
    }

    // Loop trough all games in the tournament
    for (let i = 0; i < 3; i++) {
      // 1. Display tournament --> wait for input to start the game
      await tournamentObject.displayTournament();
      await tournamentObject.getUserInput();
      console.log('on a round: ', i);
      
      // 2. wait for the game to end
      const players = tournamentObject.getNextPlayers();
      this.setupObj.players = players;
      const game = new Game(this.setupObj); 
      const results = await game.fakeGame();
      tournamentObject.saveResults(results);

      // 3. show winner --> wait for input to to show tournament and next game

      // 4. if level == 2 show end screen and return to home page

      tournamentObject.level++;
    }
    tournamentObject.RemoveListeners();
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
        await this.Tournament();
        break;
      case this.modes.gonp:       // 4
        await this.Gonp();
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
