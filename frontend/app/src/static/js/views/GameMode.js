import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('GameMode');
        this.auth = false;
        this.params = params;
        this.mode = 0;

        this.modes = {
          'pong2': 1,
          'pong4': 2,
          'tournament': 3,
          'gonp': 4,
        }
    }

    // Helper function to make sure getUserInput waits for user to
    // Select game mode to play on --> then returns the mode to main
    waitForUser() {
      return new Promise((resolve) => {
        try {
          document.getElementById('button-2player').addEventListener('click', () => {
            resolve(this.modes.pong2);
          });
          document.getElementById('button-4player').addEventListener('click', () => {
            resolve(this.modes.pong4);
          });
          document.getElementById('button-gonp').addEventListener('click', () => {
            resolve(this.modes.gonp);
          });
          document.getElementById('button-tournament').addEventListener('click', () => {
            resolve(this.modes.tournament);
          });
        }
        catch(error) {
          console.log(error);
          this.Redirect('/500');
        }
      });
    }

    // Returns mode to play on --> see constructor for mode details
    async getUserInput() {
      const appDiv = await document.getElementById('app');
      if (!appDiv) {
        this.Redirect('/500');
        return;
      }
      
      appDiv.innerHTML = await this.getHtml();
      const mode = await this.waitForUser();
      return mode;
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