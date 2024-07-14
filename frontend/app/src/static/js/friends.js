/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friends.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/12 06:52:04 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/14 08:44:20 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./views/AbstractView.js";
const view = new AbstractView();

let friendData = new String(''); 

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
const fetchData = async () => {
  try {
    if (!view.Authenticate()) {
      console.log('No token found in loginDataFetch, exit!');
      // view.Redirect('/login');
      return;
    }
    const response = await axios.get('http://localhost:8000/account', {
      headers: { 'Authorization': `Token ${view.GetKey()}` }
    });
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
const parseData = (data) => {
  let res = '';

  data.friends.forEach(friend => {
    res += `<li class="friend"><a href="/profile/${friend.user.id}">${friend.user.username}</a></li>`;
    console.log(res);
  });
  
  return res;
}


// This function will be called when user logs in to fetch friend list data and inject it
const loginDataFetch = async (event) => {
  // Prevent default behaviour of event triggered
  event.preventDefault();

  // Get friend list element --> exit if cannot find
  const friendList = document.getElementById('friendList');
  if (!friendList) {
    return;
  }

  // Fetch friendlist from backend
  const response = await fetchData();
  if (!response) {
    return;
  }

  // Parse data to an html content
  const content = await parseData(response);
  // Set content
  friendList.innerHTML = content;

  // Save data to allocated memory
  friendData = content;
}

const fillFriendList = () => {
  console.log('fillFriendList called');
  if (friendData.length < 1) {
    console.log('exit str len');
    return;
  }

  const friendList = document.getElementById('friendList');
  if (!friendList) {
    console.log('exit friendlist elem')
    return;
  }
  
  console.log(`Setting friendlit to ${friendData}`);
  friendList.innerHTML = friendData;
}

// Inject event handler for login to fetch data for friends list
window.addEventListener('loginEvent', loginDataFetch);
window.addEventListener('popstate', fillFriendList);

document.addEventListener('DOMContentLoaded', () => {
  loginDataFetch(new Event('loaded'));
});