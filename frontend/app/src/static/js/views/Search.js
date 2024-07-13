/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Search.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/13 08:17:31 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/13 13:02:39 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
      super(params);
      this.setTitle('Search For Friends');
      this.auth = false; //TODO: switch to true
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
            <input type="text" placeholder="Peers...?">
            <button>
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
          </div>
        </div>

        <div class="search-right">
          <img src="//images.ctfassets.net/7oor54l3o0n4/7sxnjP784M2eO8II8UQomO/b026670af1d1d77c4e300381c152f99e/hive-open-community-2.png" class="story-image">
        </div>
      </div>
    `;
  }
}