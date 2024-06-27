/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   500.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/20 09:22:19 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/27 08:06:31 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Internal Server Error');
  }

  async getHtml() {
    return `
      <div class="profile-div">
        <div class="profile-card">
          <h1 class="font-heading">505 - Internal Server Error</h1>
          <h2>Sorry :(</h2>
        </div>
      </div>
    `
  }
  
}