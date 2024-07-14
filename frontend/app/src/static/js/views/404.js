/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   404.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/20 09:22:19 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/14 08:23:21 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle('Not Found');
  }

  async getHtml() {
    return `
      <div class="profile-div">
        <h1 class="font-heading">404 - Not Found</h1>
      </div>
    `
  }
  
}