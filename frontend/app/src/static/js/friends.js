/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friends.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/12 06:52:04 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/13 08:16:37 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./views/AbstractView.js";
const view = new AbstractView();

// Function for <button> tag to open friends panel
export const toggleView = () => {
  // if (!localStorage.getItem('auth_token')) {
    // console.log('not logged in');
    // TODO: create notification to log in
    // return;
  // }

  document.getElementById('dropDownButton').classList.toggle('button-up');
  document.getElementById('dropDownDiv').classList.toggle('show');
}

// Event handler for closing friends panel when clicked else where
window.onclick = (event) => {
  console.log(event.target);
  if (event.target.matches('.friends-drop')) {
    console.log('returning');
    return;
  }

  if (!event.target.matches('.friends-button')) {

    const container = document.getElementById('dropDownDiv');
    if (container.classList.contains('show')) {
      container.classList.remove('show');
    }
    if (!container.classList.contains('hide')) {
      container.classList.add('hide');
    }

    const button = document.getElementById('dropDownButton');
    if (button.classList.contains('button-up')) {
      button.classList.remove('button-up')
    }
  }
}


// Pull friends data from backend
// http://localhost:8000/friend-request/list
// TODO: will probably need a payload with the token?
const fetchData = () => {
  try {
    if (!view.Authenticate()) {
      console.log('No token found in loginDataFetch, exit!');
      // view.Redirect('/login');
      return;
    }
    const payload = { token: view.GetKey() }
    const response = axios.get('http://localhost:8000/friend-request/list');
    return response.data;
  }
  catch(error) {
    console.log('Error fetching friendlist.');
    view.Redirect('/500');
    return { error: 'Error fetching friendlist.' };
  }
}

// Parses backend response to a string containing <li> element for each friend
// Example:   <li class="friend"> <p>Player_123</p> </li>
// TODO: make parser
const parseData = (data) => {
  console.log(data);
  return `
    <li class="friend"><p>Player_123</p></li>
    <li class="friend"><p>hiver_0</p></li>
    <li class="friend"><p>noob85303</p></li>
    <li class="friend"><p>Destroyer666</p></li>
  `
}


// This function will be called when user logs in to fetch friend list data and inject it
const loginDataFetch = (event) => {
  // Prevent default behaviour of event triggered
  event.preventDefault();

  // Get friend list element --> exit if cannot find
  const friendList = document.getElementById('friendList');
  if (!friendList) {
    return;
  }

  // Fetch friendlist from backend
  const response = fetchData();
  if (response.error) {
    return;
  }

  // Parse data to an html content
  const content = parseData(response);
  // Set content
  friendList.innerHTML = content;
}

// Inject event handler for login to fetch data for friends list
window.addEventListener('loginEvent', loginDataFetch);