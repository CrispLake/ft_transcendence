/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Result.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: emajuri <emajuri@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/22 13:36:52 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/25 13:00:05 by emajuri          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

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
        console.log('players: ', this.players);
        console.log('results: ', this.results);
        let stats = [];
        this.players.forEach((player, index) => {
            console.log('with: ', this.results[`player${index+1}Score`], ' --> ', `player${index+1}Score`);
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
        if (player.name.includes('AI')) {
            imageTag = `<img class="winner-img" src="static/images/ai.avif" alt="User icon"/>`
        }
        else if (player.name.includes('Guest')) {
            imageTag = `<img class="winner-img" src="static/images/guest.png" alt="User icon"/>`
        }
        else {
            imageTag = `<img class="winner-img" src="https://localhost:8000/account/${player.id}/image" alt="User icon"/>`
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

                <a href="/" id="continueButton" class="continue-div-2p">
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
                        <h3 class="font-text winner-username-4p">${this.winner2.name}</h3>
                        <p class="font-sub winner-score-4p">score: ${this.winner2.score}</p>
                    </div>
                    <div class="card winner-card-1">
                        ${this.getImage(this.winner1)}
                        <h3 class="font-text winner-username-4p">${this.winner1.name}</h3>
                        <p class="font-sub winner-score-4p">score: ${this.winner1.score}</p>
                    </div>
                    <div class="card winner-card-3">
                        ${this.getImage(this.winner3)}
                        <h3 class="font-text winner-username-4p">${this.winner3.name}</h3>
                        <p class="font-sub winner-score-4p">score: ${this.winner3.score}</p>
                    </div>
                </div>
                
                <div class="loser-div">
                    <div class="loser-card">
                        ${this.getImage(this.loser)}
                        <h3 class="font-text winner-username-4p">${this.loser.name}</h3>
                    </div>
                    <a href="/" id="continueButton" class="continue-div">
                        <h2 class="font-heading continue-text">CONTINUE</h2>
                    </a>
                </div>
                <div class="arrow">

       <svg viewBox="0 -28.56 147.25 147.25" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style>.cls-1{fill:#ffffff;}</style> </defs> <g id="Layer_2" data-name="Layer 2"> <g id="Layer_1-2" data-name="Layer 1"> <path d="M79.34,22.4A35.81,35.81,0,0,0,89.89,21c14.44-3.8,29.16-5.94,43.94-7.75,6.81-.83,10.07,1.75,11.64,8.3,2.16,9,2.07,18.11,1.23,27.28-.37,4-2.36,6.44-6.08,7.28-4.45,1-9,1.7-13.48,2.45-12.12,2-24.25,4-36.37,6a12.33,12.33,0,0,0-2.46,1c-3.4,7,1.11,14.83-1.93,21.79-4.06,3.45-8.33,3.51-12.87,1.3-3.09-1.5-6.32-2.7-9.37-4.27A441.69,441.69,0,0,0,14.7,62.48,117.42,117.42,0,0,1,2.28,56.71a4,4,0,0,1-2-5.12c.94-3,1.9-6,4.8-7.88,2.38-1.57,4.46-3.57,6.74-5.28,9.39-7.06,18.66-14.26,28.23-21C47.72,11.93,55.77,7,63.69,1.83A13.93,13.93,0,0,1,66.84.5C70.56-.75,73.75.34,75.41,4a37.9,37.9,0,0,1,2.34,8.19C78.43,15.45,78.8,18.81,79.34,22.4ZM67.2,12.82a18.83,18.83,0,0,0-9,3.8c-5.5,4.09-11.09,8.07-16.63,12.12C33.06,35,24.51,41.2,16,47.53c-1.26.94-2.13,2.41-3.44,3.93C23.8,55.89,34.45,60,45,64.32S65.09,74.94,76.55,78.93a34.36,34.36,0,0,0,.8-5.41c-.08-2.85-.61-5.69-.73-8.55-.2-5.19.91-6.85,5.8-7.83Q103,53,123.7,49.23c4.17-.78,8.41-1.21,12.43-3.24,1-7.62-.69-14.79-2.17-22a13.24,13.24,0,0,0-2.85-.25C115,26.44,98.94,29.1,82.9,32.05a11.62,11.62,0,0,1-9.63-2A12,12,0,0,1,68,20.69C67.78,18.21,67.49,15.73,67.2,12.82Z"></path> <path class="cls-1" d="M67.2,12.82c.29,2.91.58,5.39.77,7.87A12,12,0,0,0,73.27,30a11.62,11.62,0,0,0,9.63,2c16-2.95,32.13-5.61,48.21-8.34A13.24,13.24,0,0,1,134,24c1.48,7.24,3.16,14.41,2.17,22-4,2-8.26,2.46-12.43,3.24Q103,53.07,82.42,57.14c-4.89,1-6,2.64-5.8,7.83.12,2.86.65,5.7.73,8.55a34.36,34.36,0,0,1-.8,5.41c-11.46-4-21-10.34-31.52-14.61S23.8,55.89,12.59,51.46c1.31-1.52,2.18-3,3.44-3.93C24.51,41.2,33.06,35,41.6,28.74c5.54-4,11.13-8,16.63-12.12A18.83,18.83,0,0,1,67.2,12.82Z"></path> </g> </g> </g></svg> 
                    <h3 class="font-text loser-text">loser! :D</h3>



                <div>
            </div>
        `;
    }

  }

}

