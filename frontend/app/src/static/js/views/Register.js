/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Register.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/22 13:36:52 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/27 10:48:16 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Notification } from "../notification.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Register');
        this.listeners = true;

        this.registerURL = 'http://localhost:8000/register';
        this.registerHandler = this.registerHandler.bind(this);
        this.checkForbiddenNames = this.checkForbiddenNames.bind(this);
    }

    // returns TRUE if everything ok
    // returns FALSE if has forbidden stuff
    checkForbiddenNames(username) {
        console.log(username, ' in check');
        const name = username.toLowerCase();

        if (name.includes('guest'))
            return false;
        if (name.includes('ai'))
            return false;
        if (name.includes('admin'))
            return false;

        return true;
    }

    async registerHandler(event) {
        event.preventDefault();

        const formElement = await document.getElementById('register-form');
            if (!formElement) {
                this.Redirect('/500');
                return;
            }
        
            try {
                const formData = new FormData(formElement);
                const data = Object.fromEntries(formData);
                const payload = {
                    user: data
                };
                console.log(payload.user.username);
                if (!this.checkForbiddenNames(payload.user.username)) {
                    const err = new Error();
                    err.response = {
                        data: {
                            user: {
                                username: `Cannot contain '${payload.user.username}'`
                            }
                        }
                    };
                    throw err;
                }
                
                const response = await axios.post(
                    this.registerURL,
                    payload
                );
                Notification('notification-div', `<h3>Register succesfull, redirecting to login!</h3>`, 0);
                setTimeout(() => {
                    this.Redirect('/login');
                }, 3000);
            } catch (error) {
                console.log(error.response)
                Notification('notification-div', `<h3>${error.response.data.user.username}</h3>`, 1);
            }
        }

    AddListeners() {
        const registerForm = document.getElementById('register-form');

        if (registerForm) {
            registerForm.addEventListener('submit', this.registerHandler);
        } else {
            console.log('505 - Internal server error - could not find submit buttons');
            this.Redirect('/500');
        }
    }

    RemoveListeners() {
        const registerForm = document.getElementById('register-form');

        if (registerForm) {
            registerForm.removeEventListener('submit', this.registerHandler);
        } else {
            console.log('505 - Internal server error - could not find submit buttons');
            this.Redirect('/500');
        }
    }


    async getHtml() {
    return `
        <div class="login-page">
        
        <div class="login-form">
            <h2 class="font-sub login-heading">&lt;Register&gt;</h2>
            <a class="font-text sign-up" href="#" data-link></a>
            <form id="register-form" action="" method="">
            
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
