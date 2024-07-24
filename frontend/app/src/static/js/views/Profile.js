/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/20 09:22:19 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/24 06:59:10 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Notification } from '../notification.js';
import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Profile');
        this.auth = true;
        this.listeners = true;
        this.params = params;
        this.profileData = null; // Initialize profile data
        this.profileURL = 'http://localhost:8000/account';

        this.logoutHandler = this.logoutHandler.bind(this);
    }

    async fetchProfileData() {
        const token = this.GetKey();
        if (!token) {
            console.log('No auth token found');
        }

        let url = this.profileURL;
        if (this.params && this.params.id) {
            url += `/${this.params.id}`;
        }

        try {
            const response = await axios.get(
                url,
                { headers: {'Authorization': `Token ${token}`} }
            );
            this.profileData = response.data;
        } catch (error) {
            console.error('Error fetching profile data', error);
            // Handle error, e.g., by setting an error message
            this.profileData = { error: 'Failed to load profile data' };
        }
    }

    logoutHandler(event) {
      event.preventDefault();
      this.DeleteKey();
      Notification('notification-div', '<p class="font-text message">Logout success!</p>', 0);
      setTimeout(() => {
        this.Redirect('/');
      }, 3000);
    }

    AddListeners() {
      const logoutButton = document.getElementById('logoutButton');
      if (!logoutButton) return;
      logoutButton.addEventListener('click', this.logoutHandler);
    }

    RemoveListeners() {
      const logoutButton = document.getElementById('logoutButton');
      if (!logoutButton) return;
      logoutButton.removeEventListener('click', this.logoutHandler);
    }

    async getHtml() {
        // Fetch the profile data
        await this.fetchProfileData();

        if (this.profileData.error) {
            return `
                <div class="profile-div">
                    <div class="profile-card">
                        <h1 class="font-heading">PROFILE: Error</h1>
                        <h2>${this.profileData.error}</h2>
                    </div>
                </div>
            `;
        }
        
        // Profile data parsing
        const profileName = this.profileData.user.username;
        const wins = this.profileData.wins;
        const losses = this.profileData.losses;
        const total = wins + losses;
        const winrate = ((wins / total) * 100);
        const winrateF = isNaN(winrate) ? '0' : winrate.toFixed(2);

        // TODO: maybe get image trough backend
        const imageUrl = "static/images/pfp.png";
        const pfp = `<img src="${imageUrl}" alt="Profile picture">`;
        const matchHistory = `/history/${this.profileData.id}`;

        return `
            <div id="notification-div" class="notification-div"><p class="message"></p></div>
            <div class="profile-div">
                <div class="profile-card">
                    ${pfp}
                    <h1 class="font-sub">${profileName}</h1>
                    <p class="font-text">total games: ${total}</p>
                    <p class="font-text">wins: ${wins}</p>
                    <p class="font-text">losses: ${losses}</å>
                    <p class="font-text">winrate: ${winrateF}%</p>

                    <div class="buttons-div">
                      <button class="profile-button font-heading">
                        <a href="/settings" data-link>Settings</a>
                      </button>
                      <button class="profile-button font-heading" id="logoutButton">
                        Logout
                      </button>
                    </div>
                </div>
            </div>
        `;
    }
}