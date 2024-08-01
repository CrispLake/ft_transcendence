import AbstractView from './AbstractView.js';

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('GameMode');
        this.auth = false;
        this.params = params;
        this.mode = 0;

        this.player2_mode = this.player2_mode.bind(this);
        this.player4_mode = this.player4_mode.bind(this);
        this.tournament_mode = this.tournament_mode.bind(this);
        this.gonp_mode = this.gonp_mode.bind(this);
    }

    getMode() {
      return this.mode;
    }

    player2_mode() {
        this.mode = 1;
    }

    player4_mode() {
        this.mode = 2;
    }

    tournament_mode() {
        this.mode = 3;
    }

    gonp_mode() {
        this.mode = 4;
    }

    async getUserInput() {
      const appDiv = await document.getElementById('app');
      if (!appDiv) {
        this.Redirect('/500');
        return;
      }

      // inject html
      // wait for input
      // return data
    }

    AddListeners() {
        const button_2player = document.getElementById('button-2player');
        const button_4player = document.getElementById('button-4player');
        const button_tournament = document.getElementById('button-tournament');
        const button_gonp = document.getElementById('button-gonp');

        button_2player.addEventListener('click', this.player2_mode);
        button_4player.addEventListener('click', this.player4_mode);
        button_tournament.addEventListener('click', this.tournament_mode);
        button_gonp.addEventListener('click', this.gonp_mode);
    }

    RemoveListeners() {
        const button_2player = document.getElementById('button-2player');
        const button_4player = document.getElementById('button-4player');
        const button_tournament = document.getElementById('button-tournament');

        button_2player.removeEventListener('click', this.player2_mode);
        button_4player.removeEventListener('click', this.player4_mode);
        button_tournament.removeEventListener('click', this.tournament_mode);
        button_gonp.removeEventListener('click', this.gonp_mode);
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