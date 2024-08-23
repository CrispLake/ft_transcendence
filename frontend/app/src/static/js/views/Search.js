/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Search.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: emajuri <emajuri@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/13 08:17:31 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/23 15:08:34 by emajuri          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { CustomError } from "../CustomError.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Search For Friends');
    this.auth = true;
    this.listeners = true;
    this.addFriendListener = false; // Indicates if addFriendHandler has been attached to document
    this.resultMemory = null;

    this.searchHandler = this.searchHandler.bind(this);
    this.addFriendHandler = this.addFriendHandler.bind(this);
  }

  // Function will assume search has been executed and sends
  // invitation to the user searched by the user who is
  // currently logged in
  async addFriendHandler(event) {
    event.preventDefault();
    const resultDiv = document.getElementById('searchResult');

    try {
      const payload = { "to_user": this.resultMemory }
      const response = await axios.post(
        'http://localhost:8000/friend-request/send',
        payload,
        { headers: {'Authorization': `Token ${this.GetKey()}` } }
      );

      resultDiv.innerHTML = `
        <h3 class="font-text response-success-text">Friend request sent succesfully!</h3>
      `;
    }
    catch(error) {
      if (error.response.status === 400)
        resultDiv.innerHTML = `
          <h3 class="font-text response-fail-text">Sending friend request failed succesfully: ${error.response.data.detail}</h3>
        `;
      else {
        console.log(error);
        this.Redirect('/500');
      }
    }
  }

  // After searching, will check if there already is friend request
  // to this user or if it is already your friend
  async checkFriendAlreadyAdded(search) {
    try {
      const url = 'http://localhost:8000/friend-request/list'
      const response = await axios.get(
        url,
        { headers: {'Authorization': `Token ${this.GetKey()}` }
      });

      const foundUser = response.data.find((entry) => {
        return entry.to_user.username === search;
      });
      return !!foundUser;
    }
    catch(error) {
      console.log(error);
      this.Redirect('/500');
    }
  }

  // Will check with backend for username
  async searchHandler(event) {
    event.preventDefault();

    // Fetching all the elements needed to manipulate
    const searchIcon = await document.getElementById('searcher');
    if (!searchIcon) { return ;}

    searchIcon.classList.toggle('show-loader');
    searchIcon.classList.toggle('hide-loader');

    const loadingIcon = await document.getElementById('loader');
    if (!loadingIcon) { return ;}

    loadingIcon.classList.toggle('show-loader');
    loadingIcon.classList.toggle('hide-loader');

    const form = await document.getElementById('query');
    if (!form) { return; }

    const resultDiv = await document.getElementById('searchResult');
    if (!resultDiv) { return; }
    resultDiv.innerHTML = '';

    // Search friend from database
    try {
      const alreadyAdded = await this.checkFriendAlreadyAdded(form.value);
      if (alreadyAdded) {
        console.log('already added');
        throw new CustomError('Friend already added', 400);
      }

      const url = `http://localhost:8000/account/${form.value}`
      const response = await axios.get(url, {
        headers: {'Authorization': `Token ${this.GetKey()}`}
      });
      const data = response.data;

      if (data) {
        this.resultMemory = data.user.id;

        const searchResult = document.createElement('div');
        searchResult.classList.add('search-result');
        searchResult.id = 'searchResult';

        const profileLink = document.createElement('a');
        profileLink.classList.add('font-text');
        profileLink.classList.add('result-text');
        profileLink.href = `/profile/${data.user.id}`;
        profileLink.textContent = data.user.username;

        const addButton = document.createElement('button');
        addButton.classList.add('add-friend-button');
        addButton.innerHTML = `
          <div class="result-svg">
            <svg class="plus-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M12 6V18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </div>
        `;


        addButton.addEventListener('click', this.addFriendHandler);
        this.addFriendListener = true;

        searchResult.appendChild(profileLink);
        searchResult.appendChild(addButton);
        resultDiv.appendChild(searchResult);
      }
      else {
        console.log(error);
        this.Redirect('/500');
      }
    }
    catch(error) {
      if (error.status === 400) {
        console.log('error detected');
        resultDiv.innerHTML = `
          <span class="font-text response-fail-text">Friend request already sent, wait for them to accept.</span>
        `;
      }
      else if (error.response && error.response.status === 404) {
        resultDiv.innerHTML = `
          <span class="font-text response-fail-text">user not found...</span>
        `;
      }
      else {
        console.log(error);
        this.Redirect('/500');
      }
    }
    finally {
      form.value = '';
      loadingIcon.classList.toggle('show-loader');
      loadingIcon.classList.toggle('hide-loader');
      searchIcon.classList.toggle('show-loader');
      searchIcon.classList.toggle('hide-loader');
    }
  }




  AddListeners() {
    const form = document.getElementById('search-form-button');
    if (!form) {
      return;
    }

    form.addEventListener('click', this.searchHandler);
  }

  RemoveListeners() {
    const form = document.getElementById('search-form-button');
    if (!form) { return; }
    form.removeEventListener('click', this.searchHandler);

    const button = document.getElementById('addFriendButton');
    if (!button || !this.addFriendListener) { return; }
    button.removeEventListener('click', this.addFriendHandler);
  }

  async getHtml() {
    return `
      <div class="search-div">
        <div class="search-left">
          <h1 class="font-sub">Want to find more friends?</h1>
          <div class="search-left-text">
            <p class="font-text">
              Here you can search for all your valued peers <br> Be sure to type their name correct tho...
            </p>
          </div>
          <div class="search-left-input">

            <form id="search-form" role="search" action="" method="">
              <input type="search" id="query" name="q"
              placeholder="&lt;Search&gt;"
              aria-label="Search through site content">
              <button id="search-form-button" type="submit">
                <div id="loader" class="loading hide-loader"> </div>
                <svg id="searcher" class="search-icon show-loader" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
              </button>
            </form>
          </div>

          <div id="searchResult" class="results">

          </div>

        </div>

        <div class="search-right">
          <img src="//images.ctfassets.net/7oor54l3o0n4/7sxnjP784M2eO8II8UQomO/b026670af1d1d77c4e300381c152f99e/hive-open-community-2.png" class="story-image">
        </div>
      </div>
    `;
  }
}
