import AbstractView from './AbstractView.js'; // Adjust the import as necessary

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('GameSetup');
        this.auth = false;
        this.params = params;
        this.listeners = true;
        this.launchPong2PViewHandler = this.launchPong2PViewHandler.bind(this);
        this.launchPong4PViewHandler = this.launchPong4PViewHandler.bind(this);
    }

    launchPong4PViewHandler(event) {
        console.log("4PLAYERHANDLER")
        event.preventDefault();
        const params = {
            players: 1,
            multimode: true
        }
        this.Redirect('/play', params);
    }

    launchPong2PViewHandler(event) {
        console.log("2PLAYERHANDLER")
        event.preventDefault();
        const params = {
            players: 2,
            multimode: false
        }
        this.Redirect('/play', params);
    }

    AddListeners() {
        const launchPong2p = document.getElementById('launch-pong2p');
        const launchPong4p = document.getElementById('launch-pong4p');

        if (launchPong2p) {
            launchPong2p.addEventListener('click', this.launchPong2PViewHandler);
        } else {
            console.log('505 - Internal server error - could not find launch button');
            this.Redirect('/500');
        }
        if (launchPong4p) {
            launchPong4p.addEventListener('click', this.launchPong4PViewHandler);
        } else {
            console.log('505 - Internal server error - could not find launch button');
            this.Redirect('/500');
        }
    }

    RemoveListeners() {
        const launchPong2p = document.getElementById('launch-pong4p');
        const launchPong4p = document.getElementById('launch-pong4p');

        if (launchPong2p) {
            launchPong2p.removeEventListener('click', this.launchPong2PViewHandler);
        } else {
            console.log('505 - Internal server error - could not find launch button');
            this.Redirect('/500');
        }
        if (launchPong4p) {
            launchPong4p.removeEventListener('click', this.launchPong4PViewHandler);
        } else {
            console.log('505 - Internal server error - could not find launch button');
            this.Redirect('/500');
        }
    }

    async getHtml() {
        return `
            <div class="new-page">
                <div class="new-content">
                    
                <button class="font-sub launch-button" id="launch-pong2p">
                <div class="text-holder">
                    <span>Launch Pong 2P</span>
                </div>
                </button>
                <button class="font-sub launch-button" id="launch-pong4p">
                <div class="text-holder">
                    <span>Launch Pong 4P</span>
                </div>
                </button>
                </div>
            </div>
        `;
    }
}
