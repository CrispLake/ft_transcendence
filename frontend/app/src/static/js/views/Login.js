/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Login.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/22 13:36:52 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/22 14:36:26 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Login');
    this.listeners = [
      { type: 'click', func: this.LoginHandler }
    ];
  }

  AddListeners() {
    const submitButton = document.getElementById('LoginSubmitButton');
    if (submitButton) {
      submitButton.addEventListener('click', this.LoginHandler);
    } else {
      console.log('505 - Internal server error - could not find LoginSubmitButton');
    }
  }

  async LoginHandler(username, password) {
    console.log('hello from login handlers');
  }

  async getHtml() {
    return `
      <div class="center">
        <h2 class="font-sub login-heading">Login</h2>
        <form action="/submit_form" method="post">
          <label class="font-sub" for="username">username:</label>
          <input class="font-sub" type="text" id="username" name="username" required><br><br>
          
          <label class="font-sub" for="password">password:</label>
          <input class="font-sub" type="password" id="password" name="password" required><br><br>
          
          <button class="font-sub" id="LoginSubmitButton" type="submit">Submit</button>
        </form>
      </div>
    `
  }
  
}