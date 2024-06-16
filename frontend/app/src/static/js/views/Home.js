/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Home.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:10:36 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/16 08:25:16 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Home');
  }

  async getHtml() {
    try {
      const response = await fetch('/static/html/home.html');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.text();
    }
    catch (error) {
      console.log(`Error in view: home: ${error}`);
      return '<h1>500 - Internal server error</h1>';
    }
  }
  
}