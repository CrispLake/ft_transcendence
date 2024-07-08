/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Profile.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/20 09:22:19 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/22 13:24:16 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Profile');
    this.auth = true;
  }

  async getHtml() {
    const profileId = this.params.id ? this.params.id : 'Unknown ID'; // Safe access to this.params.id
    return `
      <div class="profile-div">
        <div class="profile-card">
          <h1 class="font-heading">PROFILE: ${profileId}</h1>
          <h2>test</h2>
        </div>
      </div>
    `
  }
  
}