/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   About.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/20 09:22:19 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/17 09:11:26 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  
  constructor(params) {
    super(params);
    this.setTitle('About');
    this.listeners = true;
  }

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

  RemoveListeners() {
    document.removeEventListener('click', this.Suffle);
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

        <div class="footer">
          <svg class="footer-logo" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 121 32" class="logo"><path d="M115.89,13.7H97.74v-.06C98,9.89,101.46,6,106.81,6c5.1-.1,8.81,3.86,9.07, 7.62Zm.94-8A14.46,14.46,0,0,0,96.58,6a14.39,14.39,0,0,0-4.07,10.11,14.19,14.19, 0,0,0,14.35,14.3,13.71,13.71,0,0,0,7.72-2.29A14.75,14.75,0,0,0,120,21.45h-5.27a8.53,8.53, 0,0,1-7.9,4.61c-4.28,0-9-2.93-9.22-8.36v-.07h23.28A14.51,14.51,0,0,0,116.83,5.68Z"></path><polygon points="74.87 30.31 90.95 10.69 83.42 10.69 83.42 1.69 66.32 1.69 66.32 10.69 58.79 10.69 74.87 30.31"></polygon><path d="M51.59,21.74a.63.63,0,0,0,.82-.29l.06-.12,0-.07a.64.64,0,0,0,0-.07,1.64,1.64, 0,0,0-.07-1.61,2.15,2.15,0,0,0-1.89-.73c-.36,0-1.56.12-3.39.34h-.06c-1.62.16-2.66, 0-2.86-1.31-.16-1.11.06-1.84,4.43-2.54,4.93-.82,5.75.2,6.14.69l.14.17A6,6,0,0,1,56, 18.09a5.7,5.7,0,0,1,.33,1.47c0,.25,0,1.51,0,1.51a9.16,9.16,0,0,1-9.2,8.18,9.5,9.5,0,0, 1-9.47-9.13V4.36a1.7,1.7,0,0,1,1.68-1.61A1.61,1.61,0,0,1,41,4.36v9.7a.62.62,0,0,0,1.23, 0V11.68A1.71,1.71,0,0,1,44,10.16a2.77,2.77,0,0,1,3,2.4,9.74,9.74,0,0,1,.25,1.79A11, 11,0,0,0,45,15,1.77,1.77,0,0,0,44,13.46a.69.69,0,0,0-.76.21.5.5,0,0,0-.07.38.5.5,0,0,0, .21.3,1.15,1.15,0,0,1,.47.89,2.35,2.35,0,0,1,0,.47A2.4,2.4,0,0,0,43,18.06c.4,2.71,3.14, 2.44,4.18,2.34h.05c1.12-.13,2.91-.33,3.3-.33.57,0,.81.13.87.2s0,.26-.06.45a2.14,2.14,0,0, 1-.1.22.61.61,0,0,0,.31.81m3.52-7.15a5.14,5.14,0,0,0-2.75-.76c0-2-.27-3.44-1.28-4.49l-.18-.18a2.88, 2.88,0,0,1,1.92-.35h0a1.75,1.75,0,0,1,1.24.72c.76.94,1.14,2.82,1,5.06m-4.93-4.42c.74.77.91,1.93.94, 3.67a22.6,22.6,0,0,0-2.6.3,10.32,10.32,0,0,0-.28-1.88,4.24,4.24,0,0,0-1.51-2.49,2.06,2.06,0,0,1, 1.4-.53v0a3,3,0,0,1,2,.93m7.39,10.9c0-.33,0-1.11,0-1.11a6.45,6.45,0,0,0-.42-2.29,8.13,8.13,0,0, 0-.93-1.82c.14-1.18.43-5-1.21-7.07A3,3,0,0,0,53,7.6a3.75,3.75,0,0,0-3.1.85A3.77,3.77,0,0,0,48.13, 8a3.27,3.27,0,0,0-2.54,1.16A5.92,5.92,0,0,0,44.05,9a2.91,2.91,0,0,0-1.86.52V4.36a2.83,2.83,0,0, 0-2.85-2.83,2.9,2.9,0,0,0-2.92,2.83V19.8a10.79,10.79,0,0,0,10.7,10.67,10.39,10.39,0,0,0,10.45-9.4"></path><path d="M24.34,25.45H20.55V17.61H12.13v7.84H8.37V6.55h3.76v7.6h8.42V6.55h3.79ZM32.71, 16A16.18,16.18,0,0,0,16.36,0,16.18,16.18,0,0,0,0,16,16.18,16.18,0,0,0,16.36,32,16.18,16.18,0,0,0,32.71,16Z"></path></svg>        
        </div>

      </div>
    `
  }
}