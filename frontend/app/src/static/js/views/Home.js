/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Home.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:10:36 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/24 10:03:21 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Home');

  }


  AddListeners() {
    
  }

  RemoveListeners() {

  }

  async getHtml() {
    return `
      <div class="home-div">

        <div class="home-left">
          <h1 class="font-heading game-text-left">PONG</h1>
        </div>

        <div class="home-middle"></div>

        <div class="home-right">
          <h1 class="font-heading game-text-right">GONP</h1>
        </div>

      </div>
    `
  }
}