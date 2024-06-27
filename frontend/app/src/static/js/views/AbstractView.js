/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   AbstractView.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/16 07:08:11 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/27 08:32:49 by jmykkane         ###   ########.fr       */
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
    localStorage.getItem('auth_token');
  }

  // content needs to be valid HTML to be injected
  async AddElement(elementID, content) {
    const element = document.findElementById(elementID);
    if (!element) {
      console.log(`Cannot find element with ID: ${elementID}`);
      return;
    }

    element.innerHTML = content;
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