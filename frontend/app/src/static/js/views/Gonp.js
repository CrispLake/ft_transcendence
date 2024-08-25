
// import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Game } from '../gonp/gonp.js';
import * as KEY from '../gonp/keys.js';

import AbstractView from "./AbstractView.js";

// {
//  params[]
//  settingsObject
// }
export default class extends AbstractView {
  constructor(params) {
    super(params);

    this.setTitle('Gonp');
    this.listeners = true;
    this.childs = true;

    this.players = ["player1", "player2"];
    this.resolve = null;
    this.controls = null;
    // this.game.update = this.game.update.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.getHtml = this.getHtml.bind(this);
    this.WaitForUser = this.WaitForUser.bind(this);
    this.getUserInput = this.getUserInput.bind(this);
    this.launchGame = this.launchGame.bind(this);
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
    this.game = new Game(gameSettings);
    appDiv.style.background = 'var(--black)';
    appDiv.innerHTML = '';
    const element = await this.getHtml();
    appDiv.appendChild(element);
    await this.getUserInput();
    appDiv.style.background = 'var(--white)';
    appDiv.removeChild(element);

    return this.game.results;
  }

  handleKeyDown(event) {
    let player1 = this.game.player1;
    let player2 = this.game.player2;
      if (event.repeat && event.key != KEY.P1_BOOST && event.key != KEY.P2_BOOST && event.key != KEY.P1_BOOST_PAUSE && event.key != KEY.P2_BOOST_PAUSE)
    {
      this.handleKeyUp(event);
      return ;
    }
    switch (event.key)
    {
      case KEY.P1_LEFT:
        player1.moveLeft = true;
        break;
      case KEY.P1_RIGHT:
        player1.moveRight = true;
        break;
      case KEY.P1_BOOST_PAUSE:
        player1.boostPaused = true;
        break;
      case KEY.P1_BOOST:
        player1.boostPressed = true;
        break;
      case KEY.P2_LEFT:
         player2.moveLeft = true;
         break;
      case KEY.P2_RIGHT:
        player2.moveRight = true;
        break;
      case KEY.P2_BOOST_PAUSE:
        player2.boostPaused = true;
        break;
      case KEY.P2_BOOST:
        player2.boostPressed = true;
        break;
      case 'b':
        console.log(player1.pushers, player2.pushers);
        break ;
      }
  }

  handleKeyUp(event) {
    let player1 = this.game.player1;
    let player2 = this.game.player2;
    switch (event.key)
    {
      case KEY.P1_LEFT:
        player1.moveLeft = false;
        break;
      case KEY.P1_RIGHT:
        player1.moveRight = false;
        break;
      case KEY.P1_BOOST_PAUSE:
        player1.boostPaused = false;
        break;
      case KEY.P1_BOOST:
        player1.boostPressed = false;
        break;
      case KEY.P2_LEFT:
        player2.moveLeft = false;
        break;
      case KEY.P2_RIGHT:
        player2.moveRight = false;
        break;
      case KEY.P2_BOOST_PAUSE:
        player2.boostPaused = false;
        break;
      case KEY.P2_BOOST:
        player2.boostPressed = false;
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
    console.log("RENDERER: ");
    console.log(this.game.renderer)
    return (this.game.renderer.domElement);
  }

}
