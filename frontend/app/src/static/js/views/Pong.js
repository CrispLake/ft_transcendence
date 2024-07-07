/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Pong.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/02 06:33:29 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/07 11:22:53 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Home.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:10:36 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/22 13:34:37 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Game } from '../pong/objects/Game.js';
import * as KEY from '../pong/keys.js';

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Pong');
    this.listeners = true;
    
    // Game variables
    this.game = null;
    this.controls = null;
  }

  init() {
    if (this.game === null) {
      this.game = new Game();
    }
    if (this.controls === null) {
      this.controls = new OrbitControls(game.camera, game.renderer.domElement);
    }

    RectAreaLightUniformsLib.init();
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

  onWindowResize( event ) {
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
    
    this.init();
  }

  RemoveListeners() {
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  async getHtml() {
    return `
      <h1>Hello World</h1>
    `
  }
  
}