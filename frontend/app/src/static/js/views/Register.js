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
        this.listeners = true;

        this.registerURL = 'http://localhost:8000/register';
        this.registerHandler = this.registerHandler.bind(this);
    }

    async registerHandler(event) {
        event.preventDefault();

        const formElement = await document.getElementById('register-form');
            if (!formElement) {
                this.Redirect('/500');
                return;
            }

            const formData = new FormData(formElement);
            const data = Object.fromEntries(formData);
            const payload = {
                user: data
            };
        
            try {
                const response = await axios.post(
                    this.registerURL,
                    payload
                );
                this.Redirect('/login');
            } catch (error) {
                console.error('Error registering');
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