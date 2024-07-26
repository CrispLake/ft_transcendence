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
        console.log(localStorage.auth_token)
        this.loginURL = 'http://localhost:8000/login';

        this.getFirstEntry()
        this.launchPongViewHandler = this.launchPongViewHandler.bind(this);
        // this.launchPong2PViewHandler = this.launchPong2PViewHandler.bind(this);
        // this.launchPong4PViewHandler = this.launchPong4PViewHandler.bind(this);
        this.addGuestEntryHandler = this.addGuestEntryHandler.bind(this);
        this.addAiEntryHandler = this.addAiEntryHandler.bind(this);
        this.addExistingUserEntryHandler = this.addExistingUserEntryHandler.bind(this);
        this.LoginHandler = this.LoginHandler.bind(this);
    }

    async getFirstEntry() {
        let response;
        try {
            response = await axios.get(
                'http://localhost:8000/account',
                { headers: {'Authorization': `Token ${localStorage.auth_token}`} }
            );
            console.log("Response: " + response);
            this.entries = [{
                id: this.entryIdCounter++,
                title: response.data.user.username,
                image: `<img src="static/images/pfp.png" alt="Profile picture" width="50" height="50">`
            }]
        } catch (error) {
            console.error('Error fetching profile data', error);
            this.addGuestEntryHandler();
        }
        console.log(response)

    }
    launchPongViewHandler(event) {
        console.log("4PLAYERHANDLER");
        event.preventDefault();
        console.log(this.entryIdCounter)
        const params = {
            players: this.playerCounter,
            multimode: this.entryIdCounter > 2 ? true : false
        };
        this.Redirect('/play', params);
    }
    launchPong4PViewHandler(event) {
        console.log("4PLAYERHANDLER");
        event.preventDefault();
        const params = {
            players: 1,
            multimode: true
        };
        this.Redirect('/play', params);
    }

    launchPong2PViewHandler(event) {
        console.log("2PLAYERHANDLER");
        event.preventDefault();
        const params = {
            players: 2,
            multimode: false
        };
        this.Redirect('/play', params);
    }

    addAiEntryHandler(event) {
        if (event) {
            event.preventDefault();
        }
        const newEntry = {
            id: this.entryIdCounter++,
            title: `AI`,
            image: `<img src="static/images/ai.avif" alt="AI icon" width="50" height="50">`
        };
        this.entries.push(newEntry);
        this.renderEntries();
    }

    addGuestEntryHandler(event) {
        if (event) {
            event.preventDefault();
        }
        const newEntry = {
            id: this.entryIdCounter++,
            title: `Guest Player`,
            image: `<img src="static/images/guest.png" alt="Guest icon" width="50" height="50">`
        };
        this.playerCounter++;
        this.entries.push(newEntry);
        this.renderEntries();
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
        const newEntry = {
            id: this.entryIdCounter++,
            title: userData.data.username,
            image: `<img src="static/images/user.png" alt="User icon" width="50" height="50">`
        };
        this.playerCounter++;
        this.entries.push(newEntry);
        this.renderEntries();
    }

    removeEntryHandler(entryId) {
        console.log("ENTRY ID:" + entryId);
        if (entryId == 0) {
            return ;
        }
        this.entries = this.entries.filter(entry => entry.id !== entryId);
        this.entryIdCounter = this.entries.length;
        this.playerCounter = 0;
        this.renderEntries();
        for (let i = 0; i < this.entries.length; i++)
        {
            if (this.entries[i].title != "AI") {
                console.log("PLAYER FOUND")
                this.playerCounter++;
            }
        }
        console.log(this.playerCounter);
    }

    renderEntries() {
        const listContainer = document.getElementById('list-container');
        if (listContainer) {
            listContainer.innerHTML = this.entries.map(entry => `
                <div class="entry" id="entry-${entry.id}">
                ${entry.image}
                <h3>${entry.title}</h3>
                    <ul>
                    </ul>
                    <button class="remove-button" data-id="${entry.id}">Remove</button>
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
    async returnFirstEntry() {
        console.log(this.entries);
        if (this.entries.length <= 0) { 
            return ;
        }
        return (`<div class="entry" id="entry-${this.entries[0].id``}">
                ${this.entries[0].image}
                <h3>${this.entries[0].title}</h3>
                    <ul>
                    </ul>
                </div>
    `);
    }
    async LoginHandler(event) {
        event.preventDefault();
        const formElement = document.getElementById('login-form');
        const usernameInput = document.getElementById('username');
        const errorMessageDiv = document.getElementById('error-message');
    
        if (!formElement) {
            this.Redirect('/500');
            return;
        }
    
        const formData = new FormData(formElement);
        const payload = Object.fromEntries(formData);
    
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
    }
    


    AddListeners() {
        const launchPong = document.getElementById('launch-pong');
        // const launchPong2p = document.getElementById('launch-pong2p');
        // const launchPong4p = document.getElementById('launch-pong4p');
        const addButton = document.getElementById('add-button');
        const addAiButton = document.getElementById('add-ai-button');
        const submitButton = document.getElementById('LoginSubmitButton');
        const loginForm = document.getElementById('login-form');

        if (launchPong) {
            launchPong.addEventListener('click', this.launchPongViewHandler);
        } else {
            console.log('505 - Internal server error - could not find launch button');
            this.Redirect('/500');
        }
        // if (launchPong2p) {
        //     launchPong2p.addEventListener('click', this.launchPong2PViewHandler);
        // } else {
        //     console.log('505 - Internal server error - could not find launch button');
        //     this.Redirect('/500');
        // }
        // if (launchPong4p) {
        //     launchPong4p.addEventListener('click', this.launchPong4PViewHandler);
        // } else {
        //     console.log('505 - Internal server error - could not find launch button');
        //     this.Redirect('/500');
        // }
        if (addButton) {
            addButton.addEventListener('click', this.addGuestEntryHandler);
        } else {
            console.log('505 - Internal server error - could not find add button');
            this.Redirect('/500');
        }
        if (addAiButton) {
            addAiButton.addEventListener('click', this.addAiEntryHandler);
        } else {
            console.log('505 - Internal server error - could not find add AI button');
            this.Redirect('/500');
        }
        if (submitButton && loginForm) {
            loginForm.addEventListener('submit', this.LoginHandler);
        } else {
            console.log('505 - Internal server error - could not find LoginSubmitButton');
            this.Redirect('/500');
        }
    }

    RemoveListeners() {
        const launchPong = document.getElementById('launch-pong');
        // const launchPong2p = document.getElementById('launch-pong2p');
        // const launchPong4p = document.getElementById('launch-pong4p');
        const addButton = document.getElementById('add-button');
        const addAiButton = document.getElementById('add-ai-button');
        const submitButton = document.getElementById('LoginSubmitButton');
        const loginForm = document.getElementById('login-form');

        if (launchPong) {
            launchPong.removeEventListener('click', this.launchPongViewHandler);
        } else {
            console.log('505 - Internal server error - could not find launch button');
            this.Redirect('/500');
        }
        // if (launchPong2p) {
        //     launchPong2p.removeEventListener('click', this.launchPong2PViewHandler);
        // } else {
        //     console.log('505 - Internal server error - could not find launch button');
        //     this.Redirect('/500');
        // }
        // if (launchPong4p) {
        //     launchPong4p.removeEventListener('click', this.launchPong4PViewHandler);
        // } else {
        //     console.log('505 - Internal server error - could not find launch button');
        //     this.Redirect('/500');
        // }
        if (addButton) {
            addButton.removeEventListener('click', this.addGuestEntryHandler);
        } else {
            console.log('505 - Internal server error - could not find add button');
            this.Redirect('/500');
        }
        if (addAiButton) {
            addAiButton.removeEventListener('click', this.addAiEntryHandler);
        } else {
            console.log('505 - Internal server error - could not find add AI button');
            this.Redirect('/500');
        }
        if (submitButton && loginForm) {
            loginForm.removeEventListener('submit', this.LoginHandler);
        } else {
            console.log('505 - Internal server error - could not find LoginSubmitButton');
            this.Redirect('/500');
        }
    }
        // </button>
        // <button class="font-sub launch-button" id="launch-pong2p">
        //     <div class="text-holder">
        //         <span>Launch Pong 2P</span>
        //     </div>
        // </button>
        // <button class="font-sub launch-button" id="launch-pong4p">
        //     <div class="text-holder">
        //         <span>Launch Pong 4P</span>
        //     </div>
        // </button>

    async getHtml() {
        return `
            <div class="new-page">
                <div class="new-content">
                    <button class="font-sub launch-button" id="launch-pong">
                        <div class="text-holder">
                            <span>Play Pong</span>
                        </div>
                    <button class="font-sub add-button" id="add-button">
                        <div class="text-holder">
                            <span>Add Guest</span>
                        </div>
                    </button>
                    <button class="font-sub add-button" id="add-ai-button">
                        <div class="text-holder">
                            <span>Add AI</span>
                        </div>
                    </button>
                    <div id="list-container" class="font-text list-container scrollable-container">
                    </div>
                </div>
            </div>
            <div class="login-page">
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
                        <div id="notification-div"></div>
                    </form>
                </div>
            </div>
        `;
    }
}
