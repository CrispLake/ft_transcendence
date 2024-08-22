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
    this.getImage = this.getImage.bind(this);
    this.ParseResults = this.ParseResults.bind(this);
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

    async getUserInput(results, players) {
        this.results = results;
        this.players = players;
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

    
    ParseResults() {
        let stats = [];
        this.players.forEach((player, index) => {
            stats.push({
                id: player.id,
                name: player.username,
                score: this.results[`player${index + 1}Score`]
            });
        });
        stats.sort((a, b) => a.score - b.score);
        console.log(stats);

        if (this.players.length === 2) {
           this.winner = stats[1];  
        }
        else {
            this.winner1 = stats[3];
            this.winner2 = stats[2];
            this.winner3 = stats[1];
            this.loser = stats[0];
        }
    }

    AddListeners() {

    }

    RemoveListeners() {

    }

    getImage(player) {
        let imageTag;
        if (player.username === "AI") {
            imageTag = `<img class="winner-img" src="static/images/ai.avif" alt="User icon"/>`
        }
        else if (player.name.includes('Guest')) {
            imageTag = `<img class="winner-img" src="static/images/guest.png" alt="User icon"/>`
        }
        else {
            imageTag = `<img class="winner-img" src="http://localhost:8000/account/${player.id}/image" alt="User icon"/>`
        }
        return imageTag;
    }

  async getHtml() {
    this.ParseResults();
    if (this.players.length === 2) {
        return `
            <div class="result-div">
                <div class="winner-text-div" >
                    <h1 class="font-sub winner-text">WINNER</h1>
                </div>

                <div class="winner-card">
                    ${this.getImage(this.winner)}
                    <h3 class="font-text winner-username">${this.winner.name}</h3>
                </div>

                <a href="/" id="continueButton" class="continue-div">
                    <h2 class="font-heading continue-text">CONTINUE</h2>
                </a>
            </div>
        `;
    }
    else {
        return `
            <div class="result-div-4p">
                <div class="winner-text-div" >
                    <h1 class="font-sub winner-text">WINNERS</h1>
                </div>
                <div class="winner-div-4p">
                    <div class="card winner-card-2">
                        ${this.getImage(this.winner2)}
                        <h3 class="font-text winner-username">${this.winner1.name}</h3>
                    </div>
                    <div class="card winner-card-1">
                        ${this.getImage(this.winner1)}
                        <h3 class="font-text winner-username">${this.winner2.name}</h3>
                    </div>
                    <div class="card winner-card-3">
                        ${this.getImage(this.winner3)}
                        <h3 class="font-text winner-username">${this.winner3.name}</h3>
                    </div>
                </div>
                
                <div class="loser-div">
                    <div class="loser-card">
                        ${this.getImage(this.loser)}
                        <h3 class="font-text winner-username">${this.loser.name}</h3>
                    </div>
                </div>

                <a href="/" id="continueButton" class="continue-div">
                    <h2 class="font-heading continue-text">CONTINUE</h2>
                </a>
            </div>
        `;
    }

  }

}

