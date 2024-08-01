/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   play.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:10:36 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/01 16:44:50 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from './AbstractView.js';

import GameMode from './GameMode.js';
import GameSetup from './GameSetup.js';
// import Pong from './Pong.js';


// NOTE: All modules are responsible to
//    1. inject html
//    2. get user input
//    3. return data
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

  async ChooseGameMode() {
    const gameModeObj = new GameMode();
    this.gameMode = await gameModeObj.getUserInput();
  }

  async GameSetup() {
    const gameSetupObj = new GameSetup(this.gameMode);
    this.settings = await gameSetupObj.getUserInput();
  }

  Pong() {
    
  }

  Gonp() {

  }

  Tournament() {

  }

  Display() {
    
  }

  // This function will be responsible running the whole process
  // from setup to displaying stats after the game
  async app() {
    console.log('Starting by choosing game mode');
    await this.ChooseGameMode();
    await this.GameSetup();

    switch (this.gameMode) {
      case this.modes.pong2:
        Pong();
        break;
        
      case this.modes.pong4:
        break;
        
      case this.modes.tournament:
        break;
        
      case this.modes.gonp:
        break;

    }
    this.Display(this.gameMode, this.results);
  }
  
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