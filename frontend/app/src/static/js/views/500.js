import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Internal Server Error');
  }

    sleep() {
        return new Promise(resolve => setTimeout(resolve, 250));
    }

    addListeners() {

    }

    removeListeners() {

    }

  async getHtml() {
    const app = document.getElementById('app');
    if (!app) {
        console.log('/500 --> Fatal Error cannot find app div');
        return;
    }

    // Clear the window of any and all elements when error occurs
    // because the original view handler probably could not do this
    // before exception and re routing here
    app.innerHtml = '';
    await this.sleep();

    return `
      <div class="profile-div">
        <div class="profile-card">
          <h1 class="font-heading">505 - Internal Server Error</h1>
          <h2>Sorry :(</h2>
        </div>
      </div>
    `
  }

}
