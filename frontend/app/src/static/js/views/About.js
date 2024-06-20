/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   About.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/20 09:22:19 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/20 20:07:35 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";



export default class extends AbstractView {

  // Suffles colors between author spans
  async Suffle() {
    const colors = ['yellow', 'pink', 'blue'];
    const authors = document.querySelectorAll('.author');

    authors.forEach((author) => {
      // Remove any previous color class
      author.className = 'author';

      // Assign a color class from the shuffled array
      if (Math.random() - 0.5 > 0) {
        const randomSkewX = (Math.random() - 0.5) * 10;
        const randomSkewY = (Math.random() - 0.5) * 10;
        author.style.transform = `skew(${randomSkewX}deg, ${randomSkewY}deg)`;
        
        const random_index = Math.floor(Math.random() * 3);
        author.classList.add(colors[random_index]);
      } else {
        author.style.transform = `skew(0deg, 0deg)`;
      }
    });
  }

  // Event listener for clicking the page
  AddListeners() {
    document.addEventListener('click', this.Suffle);
  }

  constructor(params) {
    super(params);
    this.setTitle('About');
    this.listeners = [
      { type: 'click', func: this.Suffle }
    ];
  }

  async getHtml() {
    return `
      <div class="about-heading">
        <h1 class="font-sub">the mighty pong contest...</h1>
        <div class="authors-div font-text">
          <h2 id="author-heading" class="font-heading">authors</h2>

          <div class="authors-row">
              <span class="author">jmykkane</span> <span>\u00A0-\u00A0</span> <span class="author">frontend</span>
          </div>

          <div class="authors-row">
              <span class="author">emajuri</span> <span>\u00A0-\u00A0</span> <span class="author">backend</span>
          </div>

          <div class="authors-row">
              <span class="author">nona</span> <span>\u00A0-\u00A0</span> <span class="author">graphics</span>
          </div>

          <div class="authors-row">
              <span class="author">ekinnune</span> <span>\u00A0-\u00A0</span> <span class="author">gameplay</span>
          </div>

          <div class="authors-row">
              <span class="author">jon</span> <span>\u00A0-\u00A0</span> <span class="author">gameplay</span>
          </div>
          
        </div>
      </div>
    `
  }
}