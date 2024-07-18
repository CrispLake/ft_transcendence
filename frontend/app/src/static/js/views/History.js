import AbstractView from './AbstractView.js'; // Adjust the import as necessary

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Game Categories');
        this.auth = true;
        this.params = params;
        this.listeners = true;
        this.pong2pURL = 'http://localhost:8000/pong-2p'

        this.CategoryHandler = this.CategoryHandler.bind(this);
        this.fetchGames = this.fetchGames.bind(this);
        this.renderGames = this.renderPong1v1.bind(this);
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
                <div class="tab" data-category="category2">Category 2</div>
                <div class="tab" data-category="category3">Category 3</div>
                <div class="tab" data-category="category4">Category 4</div>
            </div>

            <div id="pong1v1" class="tab-content" style="display: block;">
                <h2>Pong 1v1 Games</h2>
                <ul id="game-list">
                    <!-- Games will be dynamically inserted here -->
                </ul>
            </div>

            <div id="category2" class="tab-content">
                <h2>Category 2 Games</h2>
                <ul>
                    <li>Game 2A</li>
                    <li>Game 2B</li>
                    <li>Game 2C</li>
                </ul>
            </div>

            <div id="category3" class="tab-content">
                <h2>Category 3 Games</h2>
                <ul>
                    <li>Game 3A</li>
                    <li>Game 3B</li>
                    <li>Game 3C</li>
                </ul>
            </div>

            <div id="category4" class="tab-content">
                <h2>Category 4 Games</h2>
                <ul>
                    <li>Game 4A</li>
                    <li>Game 4B</li>
                    <li>Game 4C</li>
                </ul>
            </div>
        `;
    }
}
