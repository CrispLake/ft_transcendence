/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Settings.js                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/25 15:41:42 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/27 10:34:54 by jmykkane         ###   ########.fr       */
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
        Notification('notification-div', `<h3>No file chosen</h3>`, 1);
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
            Notification('notification-div', '<h3>Username changed</h3>', 0);
        } catch (error) {
            Notification('notification-div', `<h3>${error.response.data.username}</h3>`, 1);
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
            Notification('notification-div', '<h3>Password changed</h3>', 0);
        } catch (error) {
            console.error('Error changing password', error.response);
            Notification('notification-div', `<h3>${error.response.data.username}</h3>`, 1);
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
                <div class="profile-card setting-page">

                        <div class="change-form">
                            <h2 class="font-heading setting-heading">Change Username:</h2>

                            <form id="change-username-form" action="" method="">

                              <div class="input-div">
                                <input class="font-text settings-input" type="text" id="username" name="username" required><br><br>
                                <button class="font-sub change-button" id="changeUsernameSubmitButton" type="submit">
                                  <div class="text-holder">
                                    <span class="font-sub change-button-text">Submit</span>
                                  </div>
                              </button>
                              </div>

                            </form>
                        </div>

                        <div class="change-form">
                            <h2 class="font-heading setting-heading">Change Password:</h2>
                            <form id="change-password-form" action="" method="">

                            <div class="input-div">
                              <input class="font-text settings-input" type="password" id="password" name="password" required><br><br>
                              <button class="font-sub change-button" id="changepasswordSubmitButton" type="submit">
                                  <div class="text-holder">
                                    <span class="font-sub change-button-text">Submit</span>
                                  </div>
                              </button>
                            </div>

                            </form>
                        </div>

                        <div class="change-form">
                          <h2 class="font-heading setting-heading">Change profile picture:</h2>
                          <form id="img-form">

                            <div class="input-div">
                              <input class="font-text settings-input-file file" type="file" id="file-input" accept="image/*" />
                              <button class="font-sub change-button">
                                <div class="text-holder">
                                  <span class="font-sub change-button-text">Upload</span>
                                </div>
                              </button>
                              </div>

                          </form>
                        </div>
                </div>
            </div>
        `;
    }
}
