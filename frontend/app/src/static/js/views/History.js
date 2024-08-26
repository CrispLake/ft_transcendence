import AbstractView from './AbstractView.js'; // Adjust the import as necessary

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Game Categories');
        this.auth = true;
        this.params = params;
        this.listeners = true;
        this.pong2pURL = 'https://localhost:8000/pong-2p';
        this.gonp2pURL = 'https://localhost:8000/gonp-2p';


        this.init();
        this.CategoryHandler = this.CategoryHandler.bind(this);
        this.fetchGames = this.fetchGames.bind(this);
        this.render2pGames = this.render2pGames.bind(this);
        this.renderEmpty = this.renderEmpty.bind(this);
    }

    async init() {
      this.myID = await this.fetchMyID();
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
            return [];
        }
    }

    // returns class .win or .lose based on if logged in player won
    getWinner(game) {
      if (game.player1Score === game.player2Score) {
        return 'stale';
      }
      const result = game.player1Score > game.player2Score ? 1 : 2;
      if (this.myID === game.player1) {
        return result === 1 ? 'win' : 'lose';
      }
      else {
        return result === 2 ? 'win' : 'lose';
      }
    }

    render2pGames(games, elementID) {
        const categoryContent = document.getElementById(elementID);
        categoryContent.innerHTML = `
            <ul>
                ${games.map(game => `
                    <li class="game-card ${this.getWinner(game)}">
                      <div class="font-text gamecard-left">
                        ${
                          game.player1
                          ? `<a class="player-name" href="/profile/${game.player1}" data-id="${game.player1}" data-link>${game.player1Username}</a>`
                          : '<a class="player-name guest" href="#">Guest</a>'
                        }
                      </div>
                      
                      <div class="gamecard-middle font-sub">
                        <p class="score">${game.player1Score} vs ${game.player2Score}</p>
                        <p class="timestamp">${new Date(game.date).toLocaleString()}</p>
                      </div>
                      
                      <div class="font-text gamecard-right">
                        ${
                          game.player2
                          ? `<a class="player-name" href="/profile/${game.player2}" data-id="${game.player2}" data-link>${game.player2Username}</a>`
                          : '<a class="player-name guest" href="#">Guest</a>'
                        }
                      </div>
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

    renderEmpty(elementID, title) {
        const categoryContent = document.getElementById(elementID);
        categoryContent.innerHTML = `
            <ul>
              <li class="game-card">
                <p class="history-title font-text">No match history</p>
              </li>
            </ul>
        `
    }

    async CategoryHandler(event) {
        event.preventDefault();

        const tabs = document.getElementsByClassName('tab');
        const tabContents = document.getElementsByClassName('tab-content');

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
        }

        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].style.display = 'none';
        }

        const categoryName = event.currentTarget.getAttribute('data-category');
        document.getElementById(categoryName).style.display = 'inline';
        event.currentTarget.classList.add('active');

        if (categoryName === 'pong2p') {
            const games = await this.fetchGames(this.pong2pURL);

            if (Object.keys(games).length === 0)
                this.renderEmpty(categoryName, 'Pong 2p');
            else
                this.render2pGames(games, categoryName, 'Pong 2p');
        }

        else if (categoryName === 'gonp2p') {
            const games = await this.fetchGames(this.gonp2pURL);

            if (Object.keys(games).length === 0)
                this.renderEmpty(categoryName, 'Gonp 2p');
            else
                this.render2pGames(games, categoryName, 'Gonp 2p');
        }
    }

    AddListeners() {
        const tabs = document.getElementsByClassName('tab');

        if (tabs.length > 0) {
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].addEventListener('click', this.CategoryHandler);
            }
        } else {
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
            this.Redirect('/500');
        }
    }

    async getHtml() {
        return `
        <div class="history-div">
          <div class="history-card">
            
            <div id="tabs" class="history-category font-heading">
              <div class="tab" data-category="pong2p"><p>Pong</p></div>
              <div class="tab" data-category="gonp2p"><p>Gonp</p></div>
            </div>

            <div class="history-content">
    
              <div id="pong2p" class="tab-content">
              </div>

              <div id="gonp2p" class="tab-content">
              </div>

            </div>

          </div>
        </div>
        `;
    }
}
