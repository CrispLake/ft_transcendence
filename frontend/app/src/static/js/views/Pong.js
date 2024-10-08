import { Game } from '../pong/objects/Game.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import * as KEY from '../pong/keys.js';

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);

    this.setTitle('Pong');
    this.listeners = true;
    this.childs = true;

    this.players = null;
    this.resolve = null;
    this.controls = null;
    RectAreaLightUniformsLib.init();

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
    this.players = gameSettings.players;
    this.settings = gameSettings;
    this.game = new Game(gameSettings);
  
    appDiv.style.background = 'var(--black)';
    appDiv.innerHTML = '';
    const element = await this.getHtml();
    appDiv.appendChild(element);
    await this.getUserInput();
   
    appDiv.style.background = 'var(--white)';
    if (this.settings.settings.multiMode)
      return this.game.results.getResult4p();
    else 
      return this.game.results.getResult2p();
  }

handleKeyDown(event)
{
    switch (event.key)
    {
        case KEY.P1_LEFT:
            if (!this.game.players["p1"].name.includes('AI')) this.game.players["p1"].moveLeft = true;
            break;
        case KEY.P1_RIGHT:
            if (!this.game.players["p1"].name.includes('AI')) this.game.players["p1"].moveRight = true;
            break;
        case KEY.P1_BOOST:
            if (!this.game.players["p1"].name.includes('AI')) this.game.players["p1"].boostPressed = true;
            break;
        case KEY.P2_LEFT:
            if (!this.game.players["p2"].name.includes('AI')) this.game.players["p2"].moveLeft = true;
            break;
        case KEY.P2_RIGHT:
            if (!this.game.players["p2"].name.includes('AI')) this.game.players["p2"].moveRight = true;
            break;
        case KEY.P2_BOOST:
            if (!this.game.players["p2"].name.includes('AI')) this.game.players["p2"].boostPressed = true;
            break;
        case KEY.P3_LEFT:
            if (!this.game.players["p3"].name.includes('AI') && this.game.settings.multiMode) this.game.players["p3"].moveLeft = true;
            break;
        case KEY.P3_RIGHT:
            if (!this.game.players["p3"].name.includes('AI') && this.game.settings.multiMode) this.game.players["p3"].moveRight = true;
            break;
        case KEY.P3_BOOST:
            if (!this.game.players["p3"].name.includes('AI') && this.game.settings.multiMode) this.game.players["p3"].boostPressed = true;
            break;
        case KEY.P4_LEFT:
            if (!this.game.players["p4"].name.includes('AI') && this.game.settings.multiMode) this.game.players["p4"].moveLeft = true;
            break;
        case KEY.P4_RIGHT:
            if (!this.game.players["p4"].name.includes('AI') && this.game.settings.multiMode) this.game.players["p4"].moveRight = true;
            break;
        case KEY.P4_BOOST:
            if (!this.game.players["p4"].name.includes('AI') && this.game.settings.multiMode) this.game.players["p4"].boostPressed = true;
            break;
        case "p":
            this.game.toggleCameraRotation();
            break;
        case ".":
            this.game.togglePause();
            break;
    }
}

handleKeyUp(event)
{
    switch (event.key)
    {
        case KEY.P1_LEFT:
            if (!this.game.players["p1"].name.includes('AI')) this.game.players["p1"].moveLeft = false;
            break;
        case KEY.P1_RIGHT:
            if (!this.game.players["p1"].name.includes('AI')) this.game.players["p1"].moveRight = false;
            break;
        case KEY.P1_BOOST:
            if (!this.game.players["p1"].name.includes('AI'))
            {
                this.game.players["p1"].boostPressed = false;
                this.game.players["p1"].boostReleased = true;
            }
            break;
        case KEY.P2_LEFT:
            if (!this.game.players["p2"].name.includes('AI')) this.game.players["p2"].moveLeft = false;
            break;
        case KEY.P2_RIGHT:
            if (!this.game.players["p2"].name.includes('AI')) this.game.players["p2"].moveRight = false;
            break;
        case KEY.P2_BOOST:
            if (!this.game.players["p2"].name.includes('AI'))
            {
                this.game.players["p2"].boostPressed = false;
                this.game.players["p2"].boostReleased = true;
            }
            break;
        case KEY.P3_LEFT:
            if (!this.game.players["p3"].name.includes('AI')) this.game.players["p3"].moveLeft = false;
            break;
        case KEY.P3_RIGHT:
            if (!this.game.players["p3"].name.includes('AI')) this.game.players["p3"].moveRight = false;
            break;
        case KEY.P3_BOOST:
            if (!this.game.players["p3"].name.includes('AI'))
            {
                this.game.players["p3"].boostPressed = false;
                this.game.players["p3"].boostReleased = true;
            }
            break;
        case KEY.P4_LEFT:
            if (!this.game.players["p4"].name.includes('AI')) this.game.players["p4"].moveLeft = false;
            break;
        case KEY.P4_RIGHT:
            if (!this.game.players["p4"].name.includes('AI')) this.game.players["p4"].moveRight = false;
            break;
        case KEY.P4_BOOST:
            if (!this.game.players["p4"].name.includes('AI'))
            {
                this.game.players["p4"].boostPressed = false;
                this.game.players["p4"].boostReleased = true;
            }
            break;
    }
}

onWindowResize()
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    this.game.renderer.setSize(width, height);
    this.game.gameCamera.aspect = width / height;
    this.game.gameCamera.updateProjectionMatrix();
    this.game.uiCamera.left = -width / 2;
    this.game.uiCamera.right = width / 2;
    this.game.uiCamera.top = height / 2;
    this.game.uiCamera.bottom = -height / 2;
    this.game.uiCamera.updateProjectionMatrix();
    this.game.ui.resize();
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
