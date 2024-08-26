import { Notification } from '../notification.js';
import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Profile');
        this.auth = true;
        this.listeners = true;
        this.params = params;
        this.profileData = null;
        this.profileURL = 'https://localhost:8000/account';

        this.logoutHandler = this.logoutHandler.bind(this);
    }

    async fetchProfileData() {
        const token = this.GetKey();
        if (!token) {
            return;
        }

        if (this.params && this.params.id === 'guest') {
          this.profileData = {
            id: 'guest',
            losses: 0,
            wins: 999,
            pfp: "/login/profile_pics/login/profile_pics/F4TItB0W8AASbJz.jpg",
            user: {
              id: 'guest',
              username: 'Guest'
            }
          }  
          return;
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
            this.profileData = { error: 'Failed to load profile data' };
        }
    }

    logoutHandler(event) {
      event.preventDefault();
      this.DeleteKey();
      const friendListDiv = document.getElementById('friendList');
      if (friendListDiv) {
        friendList.innerHTML = '';
      }
      Notification('notification-div', '<p class="font-text message">Logout success!</p>', 0);
      setTimeout(() => {
        this.Redirect('/login');
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

        const imageUrl = `https://localhost:8000/account/${this.profileData.id}/image`;
        const pfp = `<img class="profile-picture" src="${imageUrl}" alt="Profile picture">`;

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
