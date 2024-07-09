/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: emajuri <emajuri@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/20 09:22:19 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/09 15:43:45 by emajuri          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from './AbstractView.js'; // Adjust the import as necessary

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Profile');
        this.auth = true;
        this.params = params;
        this.profileData = null; // Initialize profile data
        this.profileURL = 'http://localhost:8000/account';
    }

    async fetchProfileData() {
        const token = this.GetKey();
        if (!token) {
            console.log('No auth token found');
        }

        let url = this.profileURL;
        if (this.params && this.params.id){
            url += `/${this.params.id}`;
        }

        try {
            const response = await axios.get(url, {
                headers: {'Authorization': `Token ${token}`}
            });
            this.profileData = response.data;
        } catch (error) {
            console.error('Error fetching profile data', error);
            // Handle error, e.g., by setting an error message
            this.profileData = { error: 'Failed to load profile data' };
        }
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

        const profileName = this.profileData.user.username;
        const wins = this.profileData.wins;
        const losses = this.profileData.losses;
        const total = wins + losses;
        const winrate = ((wins / total) * 100);
        return `
            <div class="profile-div">
                <div class="profile-card">
                    <h1 class="font-heading">${profileName}</h1>
                    <h2>total games: ${total}</h2>
                    <h2>wins: ${wins}</h2>
                    <h2>losses: ${losses}</h2>
                    <h2>winrate: ${isNaN(winrate) ? '0' : winrate.toFixed(2)}%</h2>
                </div>
            </div>
        `;
    }
}