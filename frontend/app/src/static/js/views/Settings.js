/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: emajuri <emajuri@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/20 09:22:19 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/09 16:09:06 by emajuri          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from './AbstractView.js'; // Adjust the import as necessary

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle('Profile');
        this.auth = true;
        this.params = params;
        this.profileURL = 'http://localhost:8000/account';
    }

    async getHtml() {
        return `
            <div class="settings-div">
                <div class="settings-card">
                    <h1 class="font-heading">Settings</h1>

                </div>
            </div>
        `;
    }
}