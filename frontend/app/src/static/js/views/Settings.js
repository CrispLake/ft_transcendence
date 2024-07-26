/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Settings.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/25 15:41:42 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/25 15:47:42 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Notification } from '../notification.js';
import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Settings');
        this.auth = true;
        this.params = params;
        this.listeners = true;

        this.usernameURL = 'http://localhost:8000/account/change-username';
        this.passwordURL = 'http://localhost:8000/account/change-password';
        this.imgURL = 'http://localhost:8000/account/update';

        this.imgHandler = this.imgHandler.bind(this);
        this.UsernameHandler = this.UsernameHandler.bind(this);
        this.PasswordHandler = this.PasswordHandler.bind(this);
    }

    async imgHandler(event) {
      event.preventDefault();
      try {
        const fileInput = document.getElementById('file-input');
        if (!fileInput) return;
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('pfp', file);
        const response = await axios.put('http://localhost:8000/account/update', formData, {
          headers: {
            'Authorization': `Token ${this.GetKey()}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        Notification('notification-div', '<h3>Upload succesful!</h3>', 0);
      }
      catch(error) {
        console.log('imgHandler error: ', error);
        this.Redirect('/500');
      }
    }
    
    async UsernameHandler(event) {
        event.preventDefault();

        const formElement = await document.getElementById('change-username-form');
        if (!formElement) {
            this.Redirect('/500');
            return;
        }

        const formData = new FormData(formElement);
        const payload = Object.fromEntries(formData);

        const token = this.GetKey();
        try {
            const response = await axios.put(
                this.usernameURL,
                payload, {
                headers: {'Authorization': `Token ${token}`}
                });
        } catch (error) {
            console.error('Error changing username');
        }
    }

    async PasswordHandler(event) {
        event.preventDefault();
        console.log('Changing password');

        const formElement = await document.getElementById('change-password-form');
        if (!formElement) {
            this.Redirect('/500');
            return;
        }

        const formData = new FormData(formElement);
        const payload = Object.fromEntries(formData);

        const token = this.GetKey();
        try {
            const response = await axios.put(
                this.passwordURL,
                payload, {
                headers: {'Authorization': `Token ${token}`}
                });
            this.DeleteKey();
            this.CreateKey(response.data.token);
        } catch (error) {
            console.error('Error changing password');
        }
    }

    AddListeners() {
        const usernameForm = document.getElementById('change-username-form');
        const passwordForm = document.getElementById('change-password-form');
        const imgForm = document.getElementById('img-form');

        if (usernameForm && passwordForm && imgForm) {
            usernameForm.addEventListener('submit', this.UsernameHandler);
            passwordForm.addEventListener('submit', this.PasswordHandler);
            imgForm.addEventListener('submit', this.imgHandler);
        } else {
            console.log('505 - Internal server error - could not find submit buttons');
            this.Redirect('/500');
        }
    }

    RemoveListeners() {
        const usernameForm = document.getElementById('change-username-form');
        const passwordForm = document.getElementById('change-password-form');
        const imgForm = document.getElementById('img-form');

        if (usernameForm && passwordForm && imgForm) {
            usernameForm.removeEventListener('submit', this.UsernameHandler);
            passwordForm.removeEventListener('submit', this.PasswordHandler);
            imgForm.removeEventListener('submit', this.imgHandler);
        } else {
            console.log('505 - Internal server error - could not find submit buttons');
            this.Redirect('/500');
        }
    }

    async getHtml() {
        return `
            <div class="profile-div">
                <div class="profile-card">

                        <div class="change-form">
                            <h2 class="font-text">Change Username</h2>
                            <form id="change-username-form" action="" method="">

                            <label class="font-text" for="username">username:</label>
                            <input class="font-text login-input" type="text" id="username" name="username" required><br><br>

                            <button class="font-sub change-username-submit-button" id="changeUsernameSubmitButton" type="submit">
                                <div class="text-holder">
                                <span id="change-username-button-text">Change</span>
                                </div>
                            </button>

                            <div id="notification-div"></div>

                            </form>
                        </div>

                        <div class="change-form">
                            <h2>Change Password</h2>
                            <form id="change-password-form" action="" method="">

                            <label class="font-text" for="password">password:</label>
                            <input class="font-text login-input" type="password" id="password" name="password" required><br><br>

                            <button class="font-sub change-password-submit-button" id="changepasswordSubmitButton" type="submit">
                                <div class="text-holder">
                                <span id="change-password-button-text">Change</span>
                                </div>
                            </button>

                            <div id="notification-div"></div>

                            </form>
                        </div>

                        <div class="change-form">
                            <form id="img-form">
                              <input type="file" id="file-input" accept="image/*" />
                              <button type="submit" id="upload-button">Upload</button>
                            </form>
                        </div>
                </div>
            </div>
        `;
    }
}