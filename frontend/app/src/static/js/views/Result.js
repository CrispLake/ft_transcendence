/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Result.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/22 13:36:52 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/01 17:43:22 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Notification } from "../notification.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.results = null;
    this.setTitle('Game finished!');

    this.getHtml = this.getHtml.bind(this);
    this.getUserInput = this.getUserInput.bind(this);
    this.initialize = this.initialize.bind(this);
  }

    handleContinue(resolve) {
        resolve();
    }

    waitForUser() {
        return new Promise((resolve) => {
            try {
                document.getElementById('continueButton').addEventListener('click', () => this.handleContinue(resolve));
            }
            catch(error) {
                console.log(error);
                this.Redirect('/500');
            }
        });
    }

    async getUserInput(results) {
        this.results = results;
        if (this.results === null) {
            this.Redirect('/500');
            return;
        }

        const appDiv = document.getElementById('app');
        if (!appDiv) {
            this.Redirect('/500');
            return;
        }

        appDiv.innerHTML = await this.getHtml();
        await this.waitForUser();
    }

    initialize(results) {
        this.results = results;
    }

  AddListeners() {

  }

  RemoveListeners() {

  }

  async getHtml() {
    console.log(this.results);

    return `
        <div class="result-div">
            <div class="winner-text-div" >
                <h1 class="font-sub winner-text">WINNER</h1>
            </div>

            <div class="winner-card">
                <h3 class="font-text winner-username">ASDAASD</h3>
            </div>

            <a href="/" id="continueButton" class="continue-div">
                <h2 class="font-heading continue-text">CONTINUE</h2>
            </button>
        </a>
    `;
  }

}

