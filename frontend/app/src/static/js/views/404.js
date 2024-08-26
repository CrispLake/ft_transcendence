import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Not Found');
  }

  async getHtml() {
    return `
      <div class="profile-div">
        <h1 class="font-heading">404 - Not Found</h1>
      </div>
    `
  }
  
}
