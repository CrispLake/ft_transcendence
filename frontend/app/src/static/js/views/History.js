import AbstractView from './AbstractView.js'; // Adjust the import as necessary

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Game Categories');
        this.auth = true;
        this.params = params;
        this.listeners = true;
        this.pong2pURL = 'http://localhost:8000/pong-2p';
        this.gonp2pURL = 'http://localhost:8000/gonp-2p';


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
            console.error('Error fetching games:', error);
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

    render2pGames(games, elementID, title) {
        const categoryContent = document.getElementById(elementID);
        console.log(games);
        categoryContent.innerHTML = `
            <ul>
                ${games.map(game => `
                    <li class="game-card ${this.getWinner(game)}">
                      <div class="font-text gamecard-left">
                        <a class="player-name" data-id="${game.player1}">${game.player1Username}</a> 
                      </div>
                      
                      <div class="gamecard-middle font-sub">
                        <p class="score">${game.player1Score} vs ${game.player2Score}</p>
                        <p class="timestamp">${new Date(game.date).toLocaleString()}</p>
                      </div>
                      
                      <div class="font-text gamecard-right">
                        <a class="player-name" data-id="${game.player2}">${game.player2Username}</a> 
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

    // render4pGames(games, elementID, title) {
    //     const categoryContent = document.getElementById(elementID);
    //     categoryContent.innerHTML = `
    //         <ul>
    //             ${games.map(game => `
    //                 <li>
    //                     <span class="${game.player1Username !== 'Guest' ? 'username' : 'guest'}" data-id="${game.player1}">${game.player1Username}</span> 
    //                     (${game.player1Score}) vs 
    //                     <span class="${game.player2Username !== 'Guest' ? 'username' : 'guest'}" data-id="${game.player2}">${game.player2Username}</span> 
    //                     (${game.player2Score}) vs
    //                     <span class="${game.player3Username !== 'Guest' ? 'username' : 'guest'}" data-id="${game.player3}">${game.player3Username}</span> 
    //                     (${game.player3Score}) vs
    //                     <span class="${game.player4Username !== 'Guest' ? 'username' : 'guest'}" data-id="${game.player4}">${game.player4Username}</span> 
    //                     (${game.player4Score})
    //                     on ${new Date(game.date).toLocaleString()}
    //                 </li>
    //             `).join('')}
    //         </ul>
    //     `;
    
    //     // Add event listeners to usernames
    //     const usernameElements = categoryContent.querySelectorAll('.username');
    //     usernameElements.forEach(usernameElement => {
    //         usernameElement.addEventListener('click', () => {
    //             const playerId = usernameElement.getAttribute('data-id');
    //             this.Redirect(`/profile/${playerId}`);
    //         });
    //     });
    // }

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

        // else if (categoryName === 'pong4p') {
        //     const games = await this.fetchGames(this.pong4pURL);

        //     if (Object.keys(games).length === 0)
        //         this.renderEmpty(categoryName, 'Pong 4p');
        //     else
        //         this.render4pGames(games, categoryName, 'Pong 4p');
        // }

        else if (categoryName === 'gonp2p') {
            const games = await this.fetchGames(this.gonp2pURL);

            if (Object.keys(games).length === 0)
                this.renderEmpty(categoryName, 'Gonp 2p');
            else
                this.render2pGames(games, categoryName, 'Gonp 2p');
        }

        // else if (categoryName === 'gonp4p') {
        //     const games = await this.fetchGames(this.gonp4pURL);

        //     if (Object.keys(games).length === 0)
        //         this.renderEmpty(categoryName, 'Gonp 4p');
        //     else
        //         this.render4pGames(games, categoryName, 'Gonp 4p');
        // }
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
