/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AbstractView.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:08:11 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/20 18:14:14 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Each page will have own class exteninding this one with their own properties
export default class {
  // What ever needs to be done right after the click
  constructor(params) {
    this.params = params; // parameters given to the class during creation
    this.listeners = false; // event listener functions to be added
  }

  // Helper function to set title of the page
  setTitle(title) {
    document.title = title;
  }

  // Helper function to return any html necessary for given view
  async getHtml() {
    return "";
  }

}