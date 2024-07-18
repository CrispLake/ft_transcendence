import AbstractView from './AbstractView.js'; // Adjust the import as necessary

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Game Categories');
        this.auth = true;
        this.params = params;
        this.listeners = true;
        this.pong2pURL = 'http://localhost:8000/pong-2p'
        this.pong4pURL = 'http://localhost:8000/pong-4p'
        this.gonp2pURL = 'http://localhost:8000/gonp-2p'
        this.gonp4pURL = 'http://localhost:8000/gonp-4p'

        this.CategoryHandler = this.CategoryHandler.bind(this);
        this.fetchGames = this.fetchGames.bind(this);
        this.renderPong1v1 = this.renderPong1v1.bind(this);
    }

    async fetchGames(urlStart) {
        const token = this.GetKey();

        let url = urlStart;
        if (this.params && this.params.id) {
            url += `/${this.params.id}`;
        }

        try {
            const response = await axios.get(
                url,
                { headers: {'Authorization': `Token ${token}`} }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching games:', error);
            return [];
        }
    }

    renderPong1v1(games) {
        const categoryContent = document.getElementById('pong1v1');
        categoryContent.innerHTML = `
            <h2>Pong 1v1 Games</h2>
            <ul>
                ${games.map(game => `
                    <li>
                        <span class="${game.player1Username !== 'Guest' ? 'username' : 'guest'}" data-id="${game.player1}">${game.player1Username}</span> 
                        (${game.player1Score}) vs (${game.player2Score})
                        <span class="${game.player2Username !== 'Guest' ? 'username' : 'guest'}" data-id="${game.player2}">${game.player2Username}</span> 
                        on ${new Date(game.date).toLocaleString()}
                    </li>
                `).join('')}
            </ul>
        `;
    
        // Add event listeners to usernames
        const usernameElements = categoryContent.querySelectorAll('.username');
        usernameElements.forEach(usernameElement => {
            usernameElement.addEventListener('click', () => {
                const playerId = usernameElement.getAttribute('data-id');
                this.Redirect(`/profile/${playerId}`);
            });
        });
    }

    renderPong2v2(games) {
        const categoryContent = document.getElementById('pong2v2');
        categoryContent.innerHTML = `
            <h2>Pong 2v2 Games</h2>
            <ul>
                ${games.map(game => `
                    <li>
                        <span class="${game.player1Username !== 'Guest' ? 'username' : 'guest'}" data-id="${game.player1}">${game.player1Username}</span> 
                        (${game.player1Score}) vs 
                        <span class="${game.player2Username !== 'Guest' ? 'username' : 'guest'}" data-id="${game.player2}">${game.player2Username}</span> 
                        (${game.player2Score}) vs
                        <span class="${game.player3Username !== 'Guest' ? 'username' : 'guest'}" data-id="${game.player3}">${game.player3Username}</span> 
                        (${game.player3Score}) vs
                        <span class="${game.player4Username !== 'Guest' ? 'username' : 'guest'}" data-id="${game.player4}">${game.player4Username}</span> 
                        (${game.player4Score})
                        on ${new Date(game.date).toLocaleString()}
                    </li>
                `).join('')}
            </ul>
        `;
    
        // Add event listeners to usernames
        const usernameElements = categoryContent.querySelectorAll('.username');
        usernameElements.forEach(usernameElement => {
            usernameElement.addEventListener('click', () => {
                const playerId = usernameElement.getAttribute('data-id');
                this.Redirect(`/profile/${playerId}`);
            });
        });
    }

    async CategoryHandler(event) {
        event.preventDefault();

        const tabs = document.getElementsByClassName("tab");
        const tabContents = document.getElementsByClassName("tab-content");

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove("active");
        }

        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = "none";
        }

        const categoryName = event.currentTarget.getAttribute('data-category');
        document.getElementById(categoryName).style.display = "block";
        event.currentTarget.classList.add("active");

        if (categoryName === 'pong1v1') {
            const games = await this.fetchGames(this.pong2pURL);
            this.renderPong1v1(games);
        }
        else if (categoryName === 'pong2v2') {
            const games = await this.fetchGames(this.pong4pURL);
            this.renderPong2v2(games);
        }
        else if (categoryName === 'gonp1v1') {
            const games = await this.fetchGames(this.gonp2pURL);
            console.log(games);
            if (Object.keys(games).length === 0)
                console.log('empty');
            // this.renderPong1v1(games);
        }
        else if (categoryName === 'gonp2v2') {
            const games = await this.fetchGames(this.gonp4pURL);
            if (Object.keys(games).length === 0)
                console.log('empty');
            // this.renderPong1v1(games);
        }
    }

    AddListeners() {
        const tabs = document.getElementsByClassName('tab');

        if (tabs.length > 0) {
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].addEventListener('click', this.CategoryHandler);
            }
        } else {
            console.log('505 - Internal server error - could not find tabs');
            this.Redirect('/500');
        }
    }

    RemoveListeners() {
        const tabs = document.getElementsByClassName('tab');

        if (tabs.length > 0) {
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].removeEventListener('click', this.CategoryHandler);
            }
        } else {
            console.log('505 - Internal server error - could not find tabs');
            this.Redirect('/500');
        }
    }

    async getHtml() {
        return `
            <div id="tabs">
                <div class="tab active" data-category="pong1v1">Pong 1v1</div>
                <div class="tab" data-category="pong2v2">Pong 2v2</div>
                <div class="tab" data-category="gonp1v1">Gonp 1v1</div>
                <div class="tab" data-category="gonp2v2">Gonp 2v2</div>
            </div>

            <div id="pong1v1" class="tab-content" style="display: block;">
                <h2>Pong 1v1 Games</h2>
            </div>

            <div id="pong2v2" class="tab-content">
                <h2>Pong 2v2 games</h2>
            </div>

            <div id="gonp1v1" class="tab-content">
                <h2>Gonp 1v1</h2>
            </div>

            <div id="gonp2v2" class="tab-content">
                <h2>Gonp 2v2 Games</h2>
            </div>
        `;
    }
}
