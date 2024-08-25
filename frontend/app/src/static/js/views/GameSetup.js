import AbstractView from './AbstractView.js';
import { Notification } from '../notification.js';
import { Settings } from '../pong/objects/Settings.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('GameSetup');
        this.auth = false;
        this.params = params;
        this.listeners = true;

        this.entries = [];

        this.guestCounter = 0;
        this.entryIdCounter = 0;
        this.playerCounter = 0;
        this.maxPlayers = -1;
        this.loginURL = 'https://localhost:8000/login';
        this.currentDeg = 0;
        this.currentCard = 1;

        this.powerups = false;
        this.ai_difficulty = 1;
        this.gameMode = params;

        this.getFirstEntry();
        this.waitForUser = this.waitForUser.bind(this);
        this.HandlePopupExit = this.HandlePopupExit.bind(this);
        this.PowerUpToggle = this.PowerUpToggle.bind(this);
        this.HandlePrev = this.HandlePrev.bind(this);
        this.HandleNext = this.HandleNext.bind(this);
        this.addGuestEntryHandler = this.addGuestEntryHandler.bind(this);
        this.addAiEntryHandler = this.addAiEntryHandler.bind(this);
        this.addExistingUserEntryHandler = this.addExistingUserEntryHandler.bind(this);
        this.LoginHandler = this.LoginHandler.bind(this);
        this.AiDifficultySlider = this.AiDifficultySlider.bind(this);
        this.MaxPlayerLimitReached = this.MaxPlayerLimitReached.bind(this);
        this.AddUserHandler = this.AddUserHandler.bind(this)
        this.CreateSettingsObject = this.CreateSettingsObject.bind(this);
        this.HandleMatchmaking = this.HandleMatchmaking.bind(this);
    }

    MaxPlayerLimitReached() {
        if (this.entryIdCounter == this.maxPlayers)
            return true;
        return false;
    }
    waitForUser() {
        this.AddListeners();
        return new Promise((resolve) => {
            try {
                document.getElementById('start-game-button').addEventListener('click', (event) => {
                    event.preventDefault();
                    if (this.playerCounter === this.maxPlayers) {
                        resolve(this.entries);
                    }
                })
            }
            catch(error) {
                console.log(error);
                this.Redirect('/500')
            }
        });
    }

    transform_users(users) {
        return users.map(user => ({
            id: user.player_id,
            token: user.token,
            username: user.title,
            winrate: user.winrate,
        }));
    }

    CreateSettingsObject() {
        const settingsObj = new Settings({
            multiMode: this.params < 3 ? false : true,
            difficulty: this.ai_difficulty,
            powerups: this.powerups,
            players: this.playerCounter,
            spin: true,
        });
        // Manual check for tournament since games are played as 2v2 even tho there are 4 players
        // 4 --> tournament mode
        if (this.gameMode == 4)
          settingsObj.multiMode = false;
        return settingsObj;
    }

    // Returns object containing list of players and settings object
    // to be provided for the game
    async getUserInput() {
        const appDiv = document.getElementById('app');
        if (!appDiv) {
            this.Redirect('/500');
            return;
        }
        this.maxPlayers = this.params < 3 ? 2 : 4;

        appDiv.innerHTML = await this.getHtml();
        const data = await this.waitForUser();
        const users = this.transform_users(data);
        const settingsObj = this.CreateSettingsObject();
        const params = {
            players: users,
            settings: settingsObj,
        }
        return params;
    }

    async getFirstEntry() {
        let response;
        try {
            response = await axios.get(
                'https://localhost:8000/account',
                { headers: {'Authorization': `Token ${this.GetKey()}`} }
            );
            console.log("Response: " + response.data);
            const wins = response.data.user.wins;
            const losses = response.data.user.losses;
            const total = wins + losses;

            console.log('wins: ', wins, 'losses: ', losses);

            let winrate;
            if (total === 0 || total === NaN) {
              winrate = 0;
            }
            else {
              winrate = ((wins / total) * 100);
            }
            this.entries = [{
                player_id: response.data.user.id,
                token: this.GetKey(),
                id: this.entryIdCounter++,
                title: response.data.user.username,
                winrate: winrate,
                image: `<img class="card-image" src="https://localhost:8000/account/${response.data.user.id}/image" alt="User icon" >`
            }]
            this.playerCounter++;
            this.renderEntries();
        } catch (error) {
            console.error('Error fetching profile data', error);
            this.addGuestEntryHandler();
        }
        console.log(response)
    }


    addAiEntryHandler(event) {
        event.preventDefault();

        if (this.MaxPlayerLimitReached()) {
            console.log('Max player limit reached');
            return;
        }

        // 2 == GONP in gamemode list
        // and gonp does not have AI
        if (this.gameMode == 2) {
            Notification('notification-div', '<h3>AI does not know how to play GONP</h3>', 1);
            return;
        }

        const newEntry = {
            player_id: 1,
            token: null,
            id: this.entryIdCounter++,
            title: `AI`,
            image: `<img class="card-image" src="static/images/ai.avif" alt="AI icon" >`,
            // TODO: take winrate from form
            winrate: 50
        };
        this.playerCounter++;
        this.entries.push(newEntry);
        this.renderEntries();
    }

    addGuestEntryHandler(event) {
        if (event) {
            event.preventDefault();
        }

        if (this.MaxPlayerLimitReached()) {
            console.log('Max player limit reached');
            return;
        }

        const newEntry = {
            player_id: null,
            token: null,
            id: this.entryIdCounter++,
            title: `Guest ${this.guestCounter}`,
            image: `<img class="card-image" src="static/images/guest.png" alt="Guest icon">`,
            winrate: Math.floor(Math.random() * (60 - 20 + 1)) + 20
            // NOTE: guest has random winrate between 20% - 60%
        };
        this.guestCounter++;
        this.playerCounter++;
        this.entries.push(newEntry);
        this.renderEntries();
    }

    AddUserHandler(event) {
        event.preventDefault();

        if (this.MaxPlayerLimitReached()) {
            return;
        }

        const button = document.getElementById('pop-up-login');
        button.style.display = 'block';
    }

    async addExistingUserEntryHandler(userData) {
        let profileURL = 'https://localhost:8000/account/' + userData.data.user_id;

        try {
            const response = await axios.get(
                profileURL,
                { headers: {'Authorization': `Token ${userData.data.token}`} }
            );
            const wins = response.data.user.wins;
            const losses = response.data.user.losses;
            const total = wins + losses;
            let winrate;
            if (total === 0) {
                winrate = 0;
            }
            else {
                winrate = ((wins / total) * 100);
            }
            const newEntry = {
                player_id: userData.data.user_id,
                token: userData.data.token,
                id: this.entryIdCounter++,
                title: userData.data.username,
                winrate: winrate,
                image: `<img class="card-image" src="https://localhost:8000/account/${userData.data.user_id}/image" alt="User icon">`
            };
            this.playerCounter++;
            this.entries.push(newEntry);
            this.renderEntries();
        } catch (error) {
            this.profileData = { error: 'Failed to load profile data' };
            Notification('notification-div', `<h3 class="font-text">Failed to login</h3>`, 1);
        }
    }

    removeEntryHandler(entryId) {
        if (entryId == 0) {
            return ;
        }
        this.playerCounter--;
        this.entries = this.entries.filter(entry => entry.id !== entryId);
        this.entries.forEach((entry, index) => {
            entry.id = index;
        });
        this.entryIdCounter = this.entries.length;
        this.renderEntries();
    }

    HideLoginPopUp() {
        const button = document.getElementById('pop-up-login');
        button.style.display = 'none';
        const formElement = document.getElementById('login-form');
        formElement.reset();
    }

    renderEntries() {
        this.HideLoginPopUp();
        const listContainer = document.getElementById('carousel-carousel');
        if (listContainer) {
            listContainer.innerHTML = this.entries.map((entry, index) => `
                <div class="carousel-item id-${index}" id="entry-${entry.id}">
                ${entry.image}
                <h3 class="font-text carousel-name-text">${entry.title}</h3>
                    <ul>
                    </ul>
                    ${entry.id !== 0 ? `<button class="remove-button" data-id="${entry.id}">Remove</button>` : ''}
                </div>
            `).join('');
            const removeButtons = listContainer.querySelectorAll('.remove-button');
            removeButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const entryId = parseInt(event.target.getAttribute('data-id'));
                    this.removeEntryHandler(entryId);
                });
            });
        }

        const launchButtonText = document.getElementById('start-game-text');
        if (!launchButtonText) { return; }

        if (this.playerCounter === this.maxPlayers) {
            launchButtonText.textContent = `START GAME`;
        }
        else {
            launchButtonText.textContent = `PLAYERS ${this.playerCounter}/${this.maxPlayers}`;
        }




    }

    // Handles user authentication
    async LoginHandler(event) {
        event.preventDefault();

        if (this.MaxPlayerLimitReached()) {
            this.HideLoginPopUp();
            console.log('Max player limit reached');
            return;
        }

        const formElement = document.getElementById('login-form');

        if (!formElement) {
            this.Redirect('/500');
            return;
        }


        try {
          const formData = new FormData(formElement);
          const payload = Object.fromEntries(formData);

          if (this.entries.some(entry => entry.title === payload.username)) {
            Notification('notification-div', `<h3 class="font-text">User already in match</h3>`, 1);
            return;
          }
          const response = await axios.post(this.loginURL, payload);
          this.addExistingUserEntryHandler(response);
        }
        catch(error) {
            Notification('notification-div', `<h3 class="font-text">You succesfully failed to write your password</h3>`, 1);
            return; 
        }
        this.HideLoginPopUp();
    }

    PowerUpToggle(event) {
        event.preventDefault();

        console.log('in toggle');
        const PowerUpToggle = document.getElementById('toggle-content');
        if (!PowerUpToggle) {
            console.log('505 - Internal server error - could not find toggle');
            this.Redirect('/500');
        }
        if (this.powerups === false) {
            this.powerups = true;
            PowerUpToggle.checked = true;
        }
        else {
            this.powerups = false;
            PowerUpToggle.checked = false;
        }
    }

    AiDifficultySlider(event) {
        event.preventDefault();

        const rangeSlider = document.getElementById('range-slider');
        const sliderValue = document.getElementById('slider-value');

        try {
            console.log('hello from: ', rangeSlider.value)
            sliderValue.textContent = rangeSlider.value;
            this.ai_difficulty = rangeSlider.value;
        } catch (error) {
            console.log('505 - Internal server error - could not find slider');
            this.Redirect('/500');
        }

    }

    HandleNext(event) {
        event.preventDefault();
        if (this.currentCard >= this.playerCounter) { return; }
        this.currentCard++;
        const carousel = document.getElementById("carousel-carousel");
        if (!carousel) { return; }
        this.currentDeg = this.currentDeg - 60;
        console.log('click logged and deg: ', this.currentDeg);
        carousel.style.transform = `rotateY(${this.currentDeg}deg)`;
    }

    HandlePrev(event) {
        event.preventDefault();
        if (this.currentCard <= 1) { return; }
        this.currentCard--;
        const carousel = document.getElementById("carousel-carousel");
        if (!carousel) { return; }
        this.currentDeg = this.currentDeg + 60;
        carousel.style.transform = `rotateY(${this.currentDeg}deg)`;
    }

    HideSuggestion(event) {
      event.preventDefault();
      console.log('hello from hide');  
    const button = document.getElementById('matchmake-results');
      if (!button) return;
      button.style.display = 'none';
    }

    HandlePopupExit(event) {
        event.preventDefault();
        this.HideLoginPopUp();
    }

    async HandleMatchmaking(event) {
      event.preventDefault();


      if (! await this.Authenticate()) {
        Notification('notification-div', `<h3 class="font-text">You need to login to use matchamaking</h3>`, 1);
        return;
      }
      
      try {
        const res = await axios.get(
          'https://localhost:8000/matchmaking', 
          { headers: {'Authorization': `Token ${this.GetKey()}`} }
        );
        const content = document.getElementById('suggestion-content'); 
        const elem = document.getElementById('matchmake-results');
        
        if (!content || !elem) {
          console.log('500 -- elem not found');
          this.Redirect('/500');
          return;
        }
        elem.style.display = 'flex';
        content.innerHTML = `
          <div class="suggestion-div">
            <h2 class="font-sub">We suggest you play with: </h2>
            <div class="winner-card suggestion-card">
              <img src="https://localhost:8000/account/${res.data.user.id}/image" class="suggestion-image" alt="user image"/>
              <h3 class="font-text winner-username suggestion-username">${res.data.user.username}</h3>
              <p class="font-text suggestion-winrate-text">winrate: ${Math.round((res.data.wins / (res.data.wins + res.data.losses)) * 100, 2)}%</p>
            </div>
            <p class="font-text">Go find them on campus and ask nicely! :)</p>
          </div>
        `;
      }
      catch(error) {
        console.log(error)
        Notification('notification-div', `<h3 class="font-text">${error.response.data.detail}</h3>`, 1);
      }
    }

    AddListeners() {
        const addButton = document.getElementById('add-button');
        const addAiButton = document.getElementById('add-ai-button');
        const loginForm = document.getElementById('login-form');
        const addUserButton = document.getElementById('add-user-button');
        const powerUpToggle = document.getElementById('toggle-container');
        const rangeSlider = document.getElementById('range-slider');
        const popupExit = document.getElementById('popup-exit-button');
        const matchmakeButton = document.getElementById('find-opponent');
        const suggestionButton = document.getElementById('suggestion-exit-button');

        addUserButton.addEventListener('click',this.AddUserHandler);
        popupExit.addEventListener('click', this.HandlePopupExit);
        addButton.addEventListener('click', this.addGuestEntryHandler);
        if (this.gameMode === 2) {
          suggestionButton.addEventListener('click', this.HideSuggestion);
          matchmakeButton.addEventListener('click', this.HandleMatchmaking);
        }
        if (this.gameMode !== 2) {
            addAiButton.addEventListener('click', this.addAiEntryHandler);
        }
        loginForm.addEventListener('submit', this.LoginHandler);
        powerUpToggle.addEventListener('click', this.PowerUpToggle);
        if (rangeSlider)
            rangeSlider.addEventListener('input', this.AiDifficultySlider);


        document.querySelector(".next").addEventListener("click", this.HandleNext);
        document.querySelector(".prev").addEventListener("click", this.HandlePrev);
    }

    RemoveListeners() {
        const addButton = document.getElementById('add-button');
        const matchmakeButton = document.getElementById('find-opponent');
        const addAiButton = document.getElementById('add-ai-button');
        const loginForm = document.getElementById('login-form');
        const addUserButton = document.getElementById('add-user-button');
        const powerUpToggle = document.getElementById('toggle-container');
        const rangeSlider = document.getElementById('range-slider');
        const popupExit = document.getElementById('popup-exit-button');
        const suggestionButton = document.getElementById('suggestion-exit-button');

        try {
            addUserButton.removeEventListener('click',this.AddUserHandler);
            addButton.removeEventListener('click', this.addGuestEntryHandler);
            popupExit.removeEventListener('click', this.HandlePopupExit);
            if (this.gameMode === 2) {
              suggestionButton.removeEventListener('click', this.HandleSuggestionExit);
              matchmakeButton.removeEventListener('click', this.HandleMatchmaking);
            }
            if (this.gameMode !== 2) {
                addAiButton.removeEventListener('click', this.addAiEntryHandler);
            }
            loginForm.removeEventListener('submit', this.LoginHandler);
            powerUpToggle.removeEventListener('click', this.PowerUpToggle);
            if (rangeSlider) {
                rangeSlider.removeEventListener('input', this.AiDifficultySlider);
            }
        } catch (error) {
            console.log('505 - Internal server error - could not find LoginSubmitButton');
            this.Redirect('/500');
        }
    }

    async getHtml() {
        return `
          <div class="game-settings-page">
              <div class="tophalf-gap">
              <div class="add-buttons-div">
                <button id="add-button" class="font-sub add-button blue" >
                  <div class="text-holder">
                      <span>Add Guest</span>
                  </div>
                </button>
                ${
                this.gameMode === 2
                ?
                ''
                :
                `
                <button class="font-sub add-button blue" id="add-ai-button">
                  <div class="text-holder">
                      <span>Add AI</span>
                  </div>
                </button>
                `
                }
                <button class="font-sub add-button blue" id="add-user-button">
                  <div class="text-holder">
                      <span>Add User</span>
                  </div>
                </button>
                ${
                this.gameMode == 2
                ?
                  `  
                    <button class="font-sub add-button blue" id="find-opponent">
                      <div class="text-holder">
                        <span>Matchmake</span>
                      </div>
                    </button>
                    <div id="matchmake-results" class="hide">
                      <div id="suggestion-content"></div>
                      <div id="suggestion-exit-button" class="font-sub popup-exit-button">
                        <p class=" popup-exit-button-text suggestion-exit">X</p>
                      </div>
                    </div>
                  `
                :
                  ''
                }
            </div>
            <div class="carousel-holder font-text powerup-text">
                <div class="prev">Prev</div>
                 <div id="carousel-container">
                    <div id="carousel-carousel"></div>
                </div>
                <div class="next">Next</div>
            </div>
            </div>
            <div>
            <div class="toggles-div">
                <span id="toggle-container" class="font-text powerup-text">Powerups:
                    <label class="switch">
                        <input id="toggle-content" type="checkbox">
                        <span class="slider round"></span>
                    </label>
                </span>
                ${
                this.gameMode === 2
                ?
                    `<div class="slider-container">
                        <label class="font-text powerup-text" for="range-slider">Time:</label>
                        <input type="range" id="range-slider" min="1" max="5" value="1" "step="1">
                        <span class="font-text powerup-text" id="slider-value">1</span>
                    </div>`
                :
                    `<div class="slider-container">
                        <label class="font-text powerup-text" for="range-slider">AI Diff:</label>
                        <input type="range" id="range-slider" min="1" max="3" value="1" step="1">
                        <span class="font-text powerup-text" id="slider-value">1</span>
                    </div>`
                }
            </div>
            <div id="start-game-button" class="start-container">
                <span id="start-game-text" class="font-heading start-text">Launch Game</span>
            </div>
          </div>
          </div>
            <div class="pop-up-login login-page" id="pop-up-login">
                <div class="login-form popup-login-form">
                    <div id="popup-exit-button" class="font-sub popup-exit-button">
                        <p class=" popup-exit-button-text">X</p>
                    </div>
                    <h2 class="font-sub login-heading popup-login-heading">&lt;Add user&gt;</h2>
                    <form id="login-form"   action="" method="">
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
        `;
    }
}
