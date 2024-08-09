import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('GameSetup');
        this.auth = false;
        this.params = params;
        this.listeners = true;

        this.entries = [];
        
        this.entryIdCounter = 0;
        this.playerCounter = 0;
        this.maxPlayers = 0;
        console.log(localStorage.auth_token)
        this.loginURL = 'http://localhost:8000/login';

        this.powerups = false;
        this.ai_difficulty = 1;

        this.getFirstEntry()
        this.addGuestEntryHandler = this.addGuestEntryHandler.bind(this);
        this.addAiEntryHandler = this.addAiEntryHandler.bind(this);
        this.addExistingUserEntryHandler = this.addExistingUserEntryHandler.bind(this);
        this.LoginHandler = this.LoginHandler.bind(this);
        this.AddUserHandler = this.AddUserHandler.bind(this);
        this.PowerUpToggle = this.PowerUpToggle.bind(this);
        this.AiDifficultySlider = this.AiDifficultySlider.bind(this);
    }

    waitForUser() {
        return new Promise((resolve) => {
            try {
                document.getElementById('launch-pong').addEventListener('click', () => {
                    resolve(this.entries);
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
            winrate: user.winrate
        }));
    }

    //TODO: If entry count is less than max players? Fill with AIs? Or prompt the user to add more players/AIs?
    async getUserInput() {
        const appDiv = document.getElementById('app');
        if (!appDiv) {
            this.Redirect('/500');
            return;
        }
        this.maxPlayers = this.params < 3 ? 2 : 4;

        appDiv.innerHTML = await this.getHtml();
        this.AddListeners();
        const users = this.transform_users(await this.waitForUser());
        const params = {
            players: users,
            settings : {
                multimode: this.params < 3 ? false : true,
                ai_difficulty: this.ai_difficulty,
                powerups: this.powerups
            }
        }
        return params;
    }

    async getFirstEntry() {
        let response;
        try {
            response = await axios.get(
                'http://localhost:8000/account',
                { headers: {'Authorization': `Token ${this.GetKey()}`} }
            );
            console.log("Response: " + response.data);
            const wins = response.data.user.wins;
            const losses = response.data.user.losses;
            const total = wins + losses;

            console.log('wins: ', wins, 'losses: ', losses);

            let winrate;
            if (total === 0) {
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
                image: `<img src="http://localhost:8000/account/${response.data.user.id}/image" alt="User icon" width="50" height="50">`
            }]
            this.playerCounter++;
            this.renderEntries();
        } catch (error) {
            console.error('Error fetching profile data', error);
            this.addGuestEntryHandler();
        }
        console.log(response)
    }

    // TODO: Notification for player limit reached
    MaxPlayerLimitReached() {
        if (this.entryIdCounter == this.maxPlayers)
            return true;
        return false;
    }

    addAiEntryHandler(event) {
        if (event) {
            event.preventDefault();
        }
        
        if (this.MaxPlayerLimitReached()) {
            console.log('Max player limit reached');
            return;
        }

        const newEntry = {
            id: this.entryIdCounter++,
            title: `AI`,
            image: `<img src="static/images/ai.avif" alt="AI icon" width="50" height="50">`,
            // TODO: take winrate from form
            winrate: 50
        };
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
            id: this.entryIdCounter++,
            title: `Guest Player`,
            image: `<img src="static/images/guest.png" alt="Guest icon" width="50" height="50">`,
            winrate: Math.floor(Math.random() * (60 - 20 + 1)) + 20
            // NOTE: guest has random winrate between 20% - 60%
        };
        this.playerCounter++;
        this.entries.push(newEntry);
        this.renderEntries();
    }

    AddUserHandler(event) {
        event.preventDefault();

        if (this.MaxPlayerLimitReached()) {
            console.log('Max player limit reached');
            return;
        }

        const button = document.getElementById('pop-up-login');
        button.style.display = 'block';
    }

    async addExistingUserEntryHandler(userData) {
        console.log(userData.data);
        let profileData;
        let profileURL = 'http://localhost:8000/account/' + userData.data.user_id;

        try {
            const response = await axios.get(
                profileURL,
                { headers: {'Authorization': `Token ${userData.data.token}`} }
            );
            profileData = response.data;
        } catch (error) {
            console.error('Error fetching profile data', error);
            this.profileData = { error: 'Failed to load profile data' };
        }
        console.log(profileData);
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
            image: `<img src="http://localhost:8000/account/${userData.data.user_id}/image" alt="User icon" width="50" height="50">`
        };
        this.playerCounter++;
        this.entries.push(newEntry);
        this.renderEntries();
    }

    removeEntryHandler(entryId) {
        if (entryId == 0) {
            return ;
        }
        if (this.entries[entryId].title != "AI") {
            this.playerCounter--;
        }
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
        const listContainer = document.getElementById('list-container');
        if (listContainer) {
            listContainer.innerHTML = this.entries.map(entry => `
                <div class="entry" id="entry-${entry.id}">
                ${entry.image}
                <h3>${entry.title}</h3>
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
        const usernameInput = document.getElementById('username');
        const errorMessageDiv = document.getElementById('error-message');
    
        if (!formElement) {
            this.Redirect('/500');
            return;
        }
    
        const formData = new FormData(formElement);
        const payload = Object.fromEntries(formData);

        //TODO: Notification for user already in match
        if (this.entries.some(entry => entry.title === payload.username)) {
            console.log('User already in the match');
            this.HideLoginPopUp();
            return;
        }
    
        try {
            const response = await axios.post(this.loginURL, payload);
            this.addExistingUserEntryHandler(response);
            usernameInput.classList.remove('input-error');
            if (errorMessageDiv) {
                errorMessageDiv.textContent = '';
            }

        } catch (error) {
            console.log('Invalid credentials!!');
            if (errorMessageDiv) {
                errorMessageDiv.textContent = 'Invalid credentials. Please try again.';
            }
            usernameInput.classList.add('input-error');
            formElement.reset();
            usernameInput.addEventListener('focus', () => {
                usernameInput.classList.remove('input-error');
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = '';
                }
            }, { once: true });
        }
        this.HideLoginPopUp();
    }

    PowerUpToggle(event) {
        event.preventDefault();

        const PowerUpToggle = document.getElementById('toggle-content');
        if (!PowerUpToggle) {
            console.log('505 - Internal server error - could not find slider');
            this.Redirect('/500');
        }
        if (PowerUpToggle.style.display === 'none' || PowerUpToggle.style.display === '') {
            PowerUpToggle.style.display = 'block';
            this.powerups = true;
        }
        else {
            PowerUpToggle.style.display = 'none';
            this.powerups = false;
        }
    }

    AiDifficultySlider(event) {
        event.preventDefault();

        const rangeSlider = document.getElementById('range-slider');
        const sliderValue = document.getElementById('slider-value');

        try {
            sliderValue.textContent = rangeSlider.value;
            this.ai_difficulty = rangeSlider.value;
        } catch (error) {
            console.log('505 - Internal server error - could not find slider');
            this.Redirect('/500');
        }

    }

    AddListeners() {
        const addButton = document.getElementById('add-button');
        const addAiButton = document.getElementById('add-ai-button');
        const loginForm = document.getElementById('login-form');
        const addUserButton = document.getElementById('add-user-button');
        const PowerUpToggle = document.getElementById('toggle-container');
        const rangeSlider = document.getElementById('range-slider');

        try {
            addButton.addEventListener('click', this.addGuestEntryHandler);
            addAiButton.addEventListener('click', this.addAiEntryHandler);
            loginForm.addEventListener('submit', this.LoginHandler);
            addUserButton.addEventListener('click', this.AddUserHandler);
            PowerUpToggle.addEventListener('click', this.PowerUpToggle);
            rangeSlider.addEventListener('input', this.AiDifficultySlider);
        } catch (error) {
            console.log('505 - Internal server error - could not find add button');
            this.Redirect('/500');
        }
    }

    RemoveListeners() {
        const addButton = document.getElementById('add-button');
        const addAiButton = document.getElementById('add-ai-button');
        const loginForm = document.getElementById('login-form');
        const addUserButton = document.getElementById('add-user-button');

        try {
            addButton.removeEventListener('click', this.addGuestEntryHandler);
            addAiButton.removeEventListener('click', this.addAiEntryHandler);
            loginForm.removeEventListener('submit', this.LoginHandler);
            addUserButton.removeEventListener('click', this.AddUserHandler);
            PowerUpToggle.removeEventListener('click', this.PowerUpToggle);
            rangeSlider.addEventListener('input', this.AiDifficultySlider);
        } catch (error) {
            console.log('505 - Internal server error - could not find LoginSubmitButton');
            this.Redirect('/500');
        }
    }

    async getHtml() {
        return `
          <div class="game-settings-page">

          <div class="setup-left">
            <div class="buttons-holder-div">
              <div class="buttons-div">

                <button class="font-sub add-button blue" id="add-button">
                  <div class="text-holder">
                      <span>Add Guest</span>
                  </div>
                </button>

                <button class="font-sub add-button blue" id="add-ai-button">
                  <div class="text-holder">
                      <span>Add AI</span>
                  </div>
                </button>

                <button class="font-sub add-button blue" id="add-user-button">
                  <div class="text-holder">
                      <span>Add User</span>
                  </div>
                </button>

              </div>

              <div class="launch-div">
                <button class="font-heading launch-button" id="launch-pong">
                  <div class="text-holder">
                      <span>START</span>
                  </div>
                </button>
              </div>

            <div class="toggle-container">
                <button class="toggle-button" id="toggle-container">Toggle Content</button>
                <div class="toggle-content" id="toggle-content">
                    <p>Powerups enabled</p>
                </div>
            </div>

            <div class="slider-container">
                <label for="range-slider">Select a value (1-4):</label>
                <input type="range" id="range-slider" min="1" max="4" value="1" step="1">
                <span id="slider-value">1</span>
            </div>
           
            <div class="players-container">
              <div id="list-container" class="font-text list-container scrollable-container">
              </div>
            </div>

          </div>

          <div class="setup-right">
            <img class="setup-img" src="//images.ctfassets.net/7oor54l3o0n4/50Lc9CdOtq4kmiWKsaAoiG/30649d5473cd45f3a2de6d7c9f067752/hive-peer-to-peer-project-based-learning-6.png" class="story-image">
            
          </div>

            <div class="pop-up-login login-page" id="pop-up-login">
                <div class="login-form">
                    <h2 class="font-sub login-heading">&lt;Add user&gt;</h2>
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

          
          </div>
        `;
    }
}
