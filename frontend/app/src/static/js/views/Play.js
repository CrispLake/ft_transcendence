/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: emajuri <emajuri@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:10:36 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/21 16:47:30 by emajuri          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Settings } from '../pong/objects/Settings.js';
import AbstractView from './AbstractView.js';

import Tournament from './Tournament.js';
import GameSetup from './GameSetup.js';
import GameMode from './GameMode.js';
import Result from './Result.js';
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

    this.url = 'http://localhost:8000'
  }

  // Choose how to play here
  async ChooseGameMode() {
    const gameModeObj = new GameMode();
    this.gameMode = await gameModeObj.getUserInput();
  }

  getAuthObject(players) {
    const tokenString = players
        .filter(obj => obj.token !== null)
        .map(obj => `Token ${obj.token}`)
        .join(', ')
    console.log(`tokenString \n ${tokenString}`)
    return {'Authorization': tokenString};
  }

  getPayload(gameResults, players) {
    const payload = {};

    //TODO: Tournament payload different

    //get all the user ids
    for (const key in players) {
        if (players[key] !== null) {
            payload[key] = players[key];
        }
    }

    // get all the scores
    for (const key in gameResults) {
        if (key.endsWith("Score")) {
            payload[key] = gameResults[key];
        }
    }
    return payload;
}

  async postGameResults(gameResults) {
    const players = this.setupObj.players;

    // check if any player is logged in. if not then no posting needs to be done
    if (!players.some(obj => obj.id !== null && obj.id !== 1)) {
        console.log("no posting done for game results");
        return;
    }

    const authObject = this.getAuthObject(players);
    const payload = this.getPayload(gameResults, players);

    response = await axios.post(
        this.url,
        payload,
        { headers: {authObject}}
    )
  }
  // Launch 2p Gonp
  async GameSetup() {
        const gameSetupObj = new GameSetup(this.gameMode);
        this.setupObj = await gameSetupObj.getUserInput();
        await gameSetupObj.RemoveListeners();
  }

  async Pong() {
    const appElem = document.getElementById('app');
    if (!appElem) {
      this.Redirect('/500');
      return;
    }
    const pong = new Pong();
    await pong.AddListeners();

    console.log("setuppi");
    console.log(this.setupObj);
    console.log("setuppi");
    const gameResults = await pong.launchGame(this.setupObj, appElem);
    console.log(gameResults);
    await this.postGameResults(gameResults);

    await pong.RemoveListeners();
    const resultsView = new Result();
    await resultsView.getUserInput(gameResults);
  }

  async Gonp() {
    // gonp also posts it's results as pong will 
  }

  // Launch 4p tournament
  async Tournament() {
    const tournamentObject = new Tournament();
    const appElem = document.getElementById('app');
    if (!appElem) {
      return;
    }

    appElem.innerHTML = await tournamentObject.getHtml();

    if (await tournamentObject.initialize(this.setupObj) === -1) {
      this.Redirect('/500');
      return;
    }

    for (let i = 0; i <= 3; i++) {
      await tournamentObject.displayTournament();
      await tournamentObject.getUserInput();
     
      if (tournamentObject.level === 3) {
        await tournamentObject.displayWinner();
        break;
      }
      const players = tournamentObject.getNextPlayers();
      this.setupObj.players = players;
      const game = new Pong(); 
      const results = await game.fakeGame(this.setupObj);
      tournamentObject.saveResults(results);

      tournamentObject.level++;
    }
    await tournamentObject.postResults();
    // tournament also posts it's results as pong will 
    tournamentObject.RemoveListeners();
  }
  

  // This function will be responsible running the whole process
  // from setup to displaying stats after the game
  async app() {
    await this.ChooseGameMode();
    await this.GameSetup();

    switch (this.gameMode) {
      case this.modes.pong2:      // 2
        this.url += '/pong-2p'
        await this.Pong();
        break;
      case this.modes.pong4:      // 2
        this.url += '/pong-4p'
        await this.Pong();
        break;
      case this.modes.tournament: // 3
        this.url += '/tournament'
        await this.Tournament();
        break;
      case this.modes.gonp:       // 4
        this.url += '/gonp-2p'
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
