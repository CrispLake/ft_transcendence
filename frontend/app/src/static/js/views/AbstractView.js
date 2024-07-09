/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AbstractView.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: emajuri <emajuri@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:08:11 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/09 14:19:53 by emajuri          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// NOTE: Each view that has event listeners will need their own version of
// AddListeners() function and a list of those listeners

// Each page will have own class exteninding this one with their own properties
export default class {
  // What ever needs to be done right after the click
  constructor(params) {
    this.params = params; // parameters given to the class during creation
    this.listeners = false; // event listener functions to be added
    this.auth = false; // if true, user needs to be authenticated
  }

  // Helper function to set title of the page
  setTitle(title) {
    document.title = title;
  }

  Authenticate() {
    const key = localStorage.getItem('auth_token');
    if (key) {
      console.log('key WAS found');
      return true;
    } else {
      console.log('key WAS NOT found');
      return false;
    }
  }

  CreateKey(token) {
    localStorage.setItem('auth_token', token);
  }

  DeleteKey() {
    localStorage.removeItem('auth_token');
  }

  GetKey() {
    return localStorage.getItem('auth_token');
  }

  // AddListeners()
  // RemoveListeners()

  Redirect(newRoute) {
    const newEvent = new CustomEvent('navigate', {
      detail: { href: newRoute },
    });
    document.dispatchEvent(newEvent);
  }

  // Helper function to return any html necessary for given view
  async getHtml() {
    return "";
  }

}