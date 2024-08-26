import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Home');
    this.listeners = true;

    this.ButtonHandler = this.ButtonHandler.bind(this);
    this.AddListeners = this.AddListeners.bind(this);
    this.RemoveListeners = this.RemoveListeners.bind(this);
  }

  ButtonHandler(event) {
    event.preventDefault();
    this.Redirect('/play');
  }

  AddListeners() {
    const pongButton = document.getElementById('pong-button');
    const gonpButton = document.getElementById('gonp-button');

    try {
      pongButton.addEventListener('click', this.ButtonHandler);
      gonpButton.addEventListener('click', this.ButtonHandler);
    }
    catch(error) {
      this.Redirect('/500');
    }
  }

  RemoveListeners() {
    const pongButton = document.getElementById('pong-button');
    const gonpButton = document.getElementById('gonp-button');
    
    try {
      pongButton.removeEventListener('click', this.ButtonHandler);
      gonpButton.removeEventListener('click', this.ButtonHandler);
    }
    catch(error) {
      this.Redirect('/500');
    }
  }

  async getHtml() {
    return `
      <div class="home-div">

        <div class="home-left">
          <h1 id="pong-button" class="font-heading game-text-left" >PONG</h1>
        </div>

        <div class="home-middle"></div>

        <div class="home-right">
          <h1 id="gonp-button" class="font-heading game-text-right"> GONP</h1>
        </div>

      </div>
    `
  }
}
