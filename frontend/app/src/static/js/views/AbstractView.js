// NOTE: Each view that has event listeners will need their own version of
// AddListeners() function and a list of those listeners

// Each page will have own class exteninding this one with their own properties
export default class {
  // What ever needs to be done right after the click
  constructor(params) {
    this.params = params; // parameters given to the class during creation
    this.listeners = false; // event listener functions to be added
    this.auth = false; // if true, user needs to be authenticated
    this.childs = false; // if true, router will use appendChild instead of innerHtml
    this.init();
  }

  async init() {
    this.myID = await this.fetchMyID();
    this.urlParams = new URLSearchParams(window.location.search);
  }

  // Helper function to set title of the page
  setTitle(title) {
    document.title = title;
  }

  async fetchMyID() {
    try {
      const response = await axios.get(
        'https://localhost:8000/account', {
          headers: { 'Authorization': `Token ${this.GetKey()}` }
        });
      const id = response.data.id;
      return id;
    }
    catch(error) {
      return -1;
    }
  }

  async fetchMyName() {
    try {
      const response = await axios.get(
        'https://localhost:8000/account', {
          headers: { 'Authorization': `Token ${this.GetKey()}` }
        });
      const name = response.data.user.username;
      return name;
    }
    catch(error) {
      return -1;
    }
  }

    async Authenticate() {
      try {
          const response = await axios.get(
              'https://localhost:8000/account',
              { headers: {'Authorization': `Token ${this.GetKey()}`} }
          );
          if (response.status === 401) {
              this.DeleteKey();
              return false;
          }
          return true;
      } catch (error) {
          return false;
      }
    }

  CreateKey(token) {
    localStorage.setItem('auth_token', token);
  }

  DeleteKey() {
    localStorage.removeItem('auth_token');
  }

  GetKey() {
    return localStorage.getItem('auth_token');
  }

  Redirect(newRoute, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${newRoute}?${queryString}` : newRoute;
    const newEvent = new CustomEvent('navigate', {
      detail: { href: url },
    });
    document.dispatchEvent(newEvent);
  }

    AddListeners() {

    }

    RemoveListeners() {

    }

  // Helper function to return any html necessary for given view
  async getHtml() {
    return '';
  }

}
