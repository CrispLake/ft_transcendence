/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Register.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/22 13:36:52 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/03 09:23:47 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Notification } from "../notification.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Register');

    this.registerURL = 'http://localhost:8000/register';
  }

  async getHtml() {
    return `
      <div class="login-page">
        
        <div class="login-form">
          <h2 class="font-sub login-heading">&lt;Register&gt;</h2>
          <a class="font-text sign-up" href="#" data-link></a>
            <form id="login-form" action="" method="">
            
              <label class="font-text" for="username">username:</label>
              <input class="font-text login-input" type="text" id="username" name="username" required><br><br>
              
              <label class="font-text" for="password">password:</label>
              <input class="font-text login-input" type="password" id="password" name="password" required><br><br>
              
              <button class="font-sub login-submit-button" id="LoginSubmitButton" type="submit">
                <div class="text-holder">
                <span>Join here!</span>
                </div>
              </button>
              
              <div id="notification-div"></div>

            </form>
        </div>

      </div>
    `
  }
  
}