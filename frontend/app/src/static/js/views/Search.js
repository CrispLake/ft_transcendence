/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Search.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/13 08:17:31 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/18 06:38:16 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
      super(params);
      this.setTitle('Search For Friends');
      this.auth = false;
      this.listeners = true;
  }

  async searchHandler(event) {
    event.preventDefault();

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
    
    try {
      const url = `http://localhost:8000/account/${form.value}`
      const response = await axios.get(url, {
        headers: {'Authorization': `Token ${this.GetKey()}`}
      });
      const data = response.data;

      form.value = '';
      loadingIcon.classList.toggle('show-loader');
      loadingIcon.classList.toggle('hide-loader');
      searchIcon.classList.toggle('show-loader');
      searchIcon.classList.toggle('hide-loader');

      const resultDiv = await document.getElementById('searchResult');
      if (!resultDiv) { return; }

      if (data) {
        resultDiv.innerHTML = `
          <div class="search-result">
            <a class="font-text result-text" href="/profile/${data.id}">${data.username}</a>
          </div>
        `;
      }
      else {
        resultDiv.innerHTML = `
          <span class="font-text">user not found...</span>
        `;
      }
    }
    catch(error) {
      this.Redirect('/500');
      return;
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
