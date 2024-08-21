/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Pong.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:10:36 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/02 13:53:04 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Game } from '../pong/objects/Game.js';
import * as KEY from '../pong/keys.js';

import AbstractView from "./AbstractView.js";

// {
//  params[]
//  settingsObject
// }
export default class extends AbstractView {
  constructor(params) {
    super(params);

    this.setTitle('Pong');
    this.listeners = true;
    this.childs = true;

    this.players = null;
    this.resolve = null;
    this.controls = null;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.getHtml = this.getHtml.bind(this);
    this.WaitForUser = this.WaitForUser.bind(this);
    this.getUserInput = this.getUserInput.bind(this);
    this.launchGame = this.launchGame.bind(this);
    this.postResults = this.postResults.bind(this);
  }

  // NOTE: Should be usable for GONP too
  async postResults(payload, mode) {
    try {
      let url = 'http://localhost:8000';

      if (this.settings.multiMode)
        url += '/gonp-4p';
      else
        url += '/gonp-2p';

      axios.post(url, payload);
    }
    catch(error) {
      console.log(error);
      this.Redirect('/500');
    }
  }

  // This resolve is being passed to the Game() object that will use it's
  // getter function for results within the game and then resolve with that data
  // thus returning that same result data here
  WaitForUser() {
    if (this.game.resolve === null) {
      return new Promise((resolve) => {
        this.game.resolve = resolve;
      })
    }
  }

  async getUserInput() {
    await this.WaitForUser();
  }

  // Handles single game with provided settings configuration
  async launchGame(gameSettings, appDiv) {
    this.players = gameSettings.players;
    this.settings = gameSettings;
    this.game = new Game(gameSettings);

    appDiv.innerHTML = '';
    const element = await this.getHtml();
    appDiv.appendChild(element);
    await this.getUserInput();
    appDiv.removeChild(element);
   
    if (this.settings.multiMode)
      return this.game.results.getResult4p();
    else
      return this.game.results.getResult2p();

  }

  handleKeyDown(event) {
    switch (event.key) {
      case KEY.P1_LEFT:
        this.game.players["p1"].moveLeft = true;
        break;
      case KEY.P1_RIGHT:
        this.game.players["p1"].moveRight = true;
        break;
      case KEY.P1_BOOST:
        this.game.players["p1"].boostPressed = true;
        break;
      case KEY.P2_LEFT:
        this.game.players["p2"].moveLeft = true;
        break;
      case KEY.P2_RIGHT:
        this.game.players["p2"].moveRight = true;
        break;
      case KEY.P2_BOOST:
        this.game.players["p2"].boostPressed = true;
        break;
      case KEY.P3_LEFT:
        this.game.players["p3"].moveLeft = true;
        break;
      case KEY.P3_RIGHT:
        this.game.players["p3"].moveRight = true;
        break;
      case KEY.P3_BOOST:
        this.game.players["p3"].boostPressed = true;
        break;
      case KEY.P4_LEFT:
        this.game.players["p4"].moveLeft = true;
        break;
      case KEY.P4_RIGHT:
        this.game.players["p4"].moveRight = true;
        break;
      case KEY.P4_BOOST:
        this.game.players["p4"].boostPressed = true;
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.key) {
      case KEY.P1_LEFT:
        this.game.players["p1"].moveLeft = false;
        break;
      case KEY.P1_RIGHT:
        this.game.players["p1"].moveRight = false;
        break;
      case KEY.P1_BOOST:
        this.game.players["p1"].boostPressed = false;
        this.game.players["p1"].boostReleased = true;
        break;
      case KEY.P2_LEFT:
        this.game.players["p2"].moveLeft = false;
        break;
      case KEY.P2_RIGHT:
        this.game.players["p2"].moveRight = false;
        break;
      case KEY.P2_BOOST:
        this.game.players["p2"].boostPressed = false;
        this.game.players["p2"].boostReleased = true;
        break;
      case KEY.P3_LEFT:
        this.game.players["p3"].moveLeft = false;
        break;
      case KEY.P3_RIGHT:
        this.game.players["p3"].moveRight = false;
        break;
      case KEY.P3_BOOST:
        this.game.players["p3"].boostPressed = false;
        this.game.players["p3"].boostReleased = true;
        break;
      case KEY.P4_LEFT:
        this.game.players["p4"].moveLeft = false;
        break;
      case KEY.P4_RIGHT:
        this.game.players["p4"].moveRight = false;
        break;
      case KEY.P4_BOOST:
        this.game.players["p4"].boostPressed = false;
        this.game.players["p4"].boostReleased = true;
        break;
    }
  }

  onWindowResize( ) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    this.game.renderer.setSize(width, height);
    this.game.camera.aspect = width / height;
    this.game.camera.updateProjectionMatrix();
  }

  AddListeners() {
    window.addEventListener('resize', this.onWindowResize, false);
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  RemoveListeners() {
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  async getHtml() {
    return this.game.renderer.domElement;
  }

}
