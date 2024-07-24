/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Login.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/22 13:36:52 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/24 06:57:48 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// loginEvent:
// Will be triggered after succesfull login
// Will trigger functions like fetching friend list
// Will contain { detail: [RESPONSE STATUS] }


import { Notification } from "../notification.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Login');
    this.chars = '!@#$%^&*():{};|,.<>/?';
    this.target_text = 'Authenticate';
    this.intervalRef = null;
    this.listeners = true;
    this.suffle_time = 30;
    this.cycles = 2;

    this.loginURL = 'http://localhost:8000/login';

    this.LoginHandler = this.LoginHandler.bind(this);
    this.StartScramble = this.StartScramble.bind(this);
    this.StopScramble = this.StopScramble.bind(this);
  }

  // Starts submit button scramble
  // Modifies text values inside
  StartScramble() {
    const buttonText = document.getElementById('login-button-text');
    let pos = 0;

     this.intervalRef = setInterval(() => {
      const scrambled = this.target_text.split("")
        .map((char, index) => {
          if (pos / this.cycles > index) {
            return char;
          }

          const randomCharIndex = Math.floor(Math.random() * this.chars.length);
          const randomChar = this.chars[randomCharIndex];

          return randomChar;
        })
        .join("");

        buttonText.textContent = scrambled;
        pos++;

        if (pos >= this.target_text.length * this.cycles) {
          this.StopScramble();
        }
    }, this.suffle_time);
  }

  // Clears event loop from events pushed from StartScramble
  StopScramble() {
    clearInterval(this.intervalRef);
    const buttonText = document.getElementById('login-button-text');
    buttonText.textContent = this.target_text;
  }

  // Handles network request from login form and redirects user
  // to appropriate page if successfull or fail
  async LoginHandler(event) {
    event.preventDefault();
    const formElement = await document.getElementById('login-form');
    if (!formElement) {
      this.Redirect('/500');
      return;
    }
    
    const formData = new FormData(formElement);
    const payload = Object.fromEntries(formData);
    
    try {
      const response = await axios.post(
        this.loginURL,
        payload
      );
      this.CreateKey(response.data.token);
      const loginEvent = new CustomEvent('loginEvent', {detail: response.status}); // Custom event to be triggered when submitted
      window.dispatchEvent(loginEvent);
      this.Redirect(`/${event.target.href}`);
    } catch(error) {
        console.log('Invalid credentials!!');
        Notification('notification-div', '<p class="font-text message">Invalid credentials!</p>', 1);
    }
  }

  AddListeners() {
    const submitButton = document.getElementById('LoginSubmitButton');
    const loginForm = document.getElementById('login-form');
    
    if (submitButton && loginForm) {
      loginForm.addEventListener('submit', this.LoginHandler);
      submitButton.addEventListener('mouseenter', this.StartScramble);
      submitButton.addEventListener('mouseleave', this.StopScramble);
    } else {
      console.log('505 - Internal server error - could not find LoginSubmitButton');
      this.Redirect('/500');
    }
  }

  RemoveListeners() {
    const submitButton = document.getElementById('LoginSubmitButton');
    const loginForm = document.getElementById('login-form');
    this.StopScramble();
    
    if (submitButton && loginForm) {
      loginForm.removeEventListener('submit', this.LoginHandler);
      submitButton.removeEventListener('mouseenter', this.StartScramble);
      submitButton.removeEventListener('mouseleave', this.StopScramble);
    } else {
      console.log('505 - Internal server error - could not find LoginSubmitButton');
      this.Redirect('/500');
    }
  }

  async getHtml() {
    return `
      <div id="notification-div" class="notification-div"><p class="message"></p></div>
      <div class="login-page">
        
        <div class="login-form">
          <h2 class="font-sub login-heading">&lt;Login&gt;</h2>
          <a class="font-text sign-up" href="/register" data-link>Dont have an account? Sign up!</a>
            <form id="login-form" action="" method="">
            
              <label class="font-text" for="username">username:</label>
              <input class="font-text login-input" type="text" id="username" name="username" required><br><br>
              
              <label class="font-text" for="password">password:</label>
              <input class="font-text login-input" type="password" id="password" name="password" required><br><br>
              
              <button class="font-sub login-submit-button" id="LoginSubmitButton" type="submit">
                <div class="text-holder">
                <span id="login-button-text">Authenticate</span>
                </div>
              </button>

            </form>
        </div>

      </div>
    `
  }
  
}