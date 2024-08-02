import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('GameMode');
        this.auth = false;
        this.params = params;
        this.mode = 0;

        this.handle2Player = this.handle2Player.bind(this);
        this.handle4Player = this.handle4Player.bind(this);
        this.handleGonp = this.handleGonp.bind(this);
        this.handleTournament = this.handleTournament.bind(this);

        this.modes = {
          'pong2': 1,
          'gonp': 2,
          'pong4': 3,
          'tournament': 4,
        }
    }

    handle2Player(resolve) {
      resolve(this.modes.pong2);
    }
    
    handle4Player(resolve) {
      resolve(this.modes.pong4);
    }
    
    handleGonp(resolve) {
      resolve(this.modes.gonp);
    }
    
    handleTournament(resolve) {
      resolve(this.modes.tournament);
    }

    // Helper function to make sure getUserInput waits for user to
    // Select game mode to play on --> then returns the mode to main
    waitForUser() {
      return new Promise((resolve) => {
        try {
          document.getElementById('button-2player').addEventListener('click', () => this.handle2Player(resolve));
          document.getElementById('button-4player').addEventListener('click', () => this.handle4Player(resolve));
          document.getElementById('button-gonp').addEventListener('click', () => this.handleGonp(resolve));
          document.getElementById('button-tournament').addEventListener('click', () => this.handleTournament(resolve));
        }
        catch(error) {
          console.log(error);
          this.Redirect('/500');
        }
      });
    }

    // Returns mode to play on --> see constructor for mode details
    async getUserInput() {
      const appDiv = document.getElementById('app');
      if (!appDiv) {
        this.Redirect('/500');
        return;
      }
      
      appDiv.innerHTML = await this.getHtml();
      const mode = await this.waitForUser();
      return mode;
    }

    removeListeners() {
      try {
        document.getElementById('button-2player').removeEventListener('click', this.handle2Player);
        document.getElementById('button-4player').removeEventListener('click', this.handle4Player);
        document.getElementById('button-gonp').removeEventListener('click', this.handleGonp);
        document.getElementById('button-tournament').removeEventListener('click', this.handleTournament);
      }
      catch(error) {
        console.log(error);
      }
    }

    async getHtml() {
        return `
            <div class="game-settings-page">

            <div class="setup-left">
            <div class="buttons-holder-div">
                <div class="buttons-div">

                <button class="font-sub add-button blue" id="button-2player">
                    <div class="text-holder">
                        <span>2 player</span>
                    </div>
                </button>

                <button class="font-sub add-button blue" id="button-4player">
                    <div class="text-holder">
                        <span>4 player</span>
                    </div>
                </button>

                <button class="font-sub add-button blue" id="button-tournament">
                    <div class="text-holder">
                        <span>Tournament</span>
                    </div>
                </button>

                <button class="font-sub add-button blue" id="button-gonp">
                    <div class="text-holder">
                        <span>Gonp</span>
                    </div>
                </button>

            </div>
            </div>
        `;
    }
}