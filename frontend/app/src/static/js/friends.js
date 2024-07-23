/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friends.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/12 06:52:04 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/23 08:41:17 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import AbstractView from "./views/AbstractView.js";
const view = new AbstractView();

let friendData = new String('');
let requestData = new Array();

// Function for <button> tag to open friends panel
export const toggleView = () => {
  // if (!localStorage.getItem('auth_token')) {
  //   console.log('not logged in');
  //   // TODO: create notification to log in
  //   return;
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

// Fetch logged in user id with auth token
const fetchMyID = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8000/account', {
        headers: { 'Authorization': `Token ${view.GetKey()}` }
      });
    return response.data.id;
  }
  catch(error) {
    console.log(error);
    return -1;
  }
}


// Pull friends data from backend
// http://localhost:8000/friend-request/list
const fetchFriendData = async () => {
  try {
    if (!view.Authenticate()) {
      console.log('No token found in loginDataFetch, exit!');
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
const parseFriendData = (data) => {
  let res = '';
  data.friends.forEach(friend => {
    console.log(friend);
    res += `<li class="friend"><a href="/profile/${friend.user.id}">${friend.user.username}</a></li>`;
  });
  return res;
}

// Parses friend requests to list just as above friends
const parseRequestData = (data) => {
  if (data.length < 1) {
    return '';
  }
  
  let res = `<div class="request-div"><p class="request-title">Pending requests (${data.length})</p></div>`;
  data.forEach(entry => {
    res += `
      <li class="friend">
        <div class="friend-request">
          <p>${entry.from_user.username}</p>
          <button class="request-button accept" id="accept-${entry.id}">
            <p>Y</p>
          </button>
          <button class="request-button decline" id="decline-${entry.id}">
            <p>N</p>
          </button>
        </div>
      </li>
    `;
  });

  return res;
}

// Fetches friend requests from the backend for a given user
const fetchRequestData = async () => {
  try {
    if (!view.Authenticate()) {
      console.log('No token found in loginDataFetch, exit!');
      // view.Redirect('/login');
      return;
    }
    const response = await axios.get('http://localhost:8000/friend-request/list', {
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

// Adds event listeners to friend request buttons
const addListenersToButtons = (data) => {
  data.forEach(entry => {
    document.getElementById(`accept-${entry.id}`).addEventListener('click', () => sendResponseToRequest(true, entry.id));
    document.getElementById(`decline-${entry.id}`).addEventListener('click', () => sendResponseToRequest(false, entry.id));
  });
}

// This function will be called when user logs in to fetch friend list data and inject it
const loginDataFetch = async (event) => {
  // Prevent default behaviour of event triggered
  event.preventDefault();

  const friendList = document.getElementById('friendList');
  if (!friendList) {
    return;
  }
  
  const responseRequest = await fetchRequestData();
  if (!responseRequest) {
    return;
  }
  
  const myID = await fetchMyID();
  const requests = responseRequest.filter(entry => entry.to_user.id === myID);
  const requestContent = await parseRequestData(requests);

  // Use a MutationObserver to detect when the DOM has been updated
  const observer = new MutationObserver((mutations) => {
    addListenersToButtons(requests);
    observer.disconnect(); // Stop observing after adding the listeners
  });
  
  // Start observing the friend list for changes
  observer.observe(friendList, { childList: true, subtree: true });

  const responseFriend = await fetchFriendData();
  if (!responseFriend) {
    return;
  }
  const friendContent = await parseFriendData(responseFriend);
  friendList.innerHTML = friendContent + requestContent;
  friendData = friendContent;
}

const fillFriendList = () => {
  if (friendData.length < 1) {
    return;
  }

  const friendList = document.getElementById('friendList');
  if (!friendList) {
    return;
  }
  
  friendList.innerHTML = friendData;
}

// Will clear friendlist before updating
const clearFriendList = () => {
  const friendListDiv = document.getElementById('friendList');
  if (!friendListDiv) {
    return;
  }
  friendListDiv.innererHTML = '';
}


// Will send a response to an friend request
// response = true / false
const sendResponseToRequest = async (answer, id) => {
  try {
    const payload = { "accept": answer }
    const response = await axios.post(
      `http://localhost:8000/friend-request/respond/${id}`,
      payload,
      { headers: {'Authorization': `Token ${view.GetKey()}`} }
    );
    clearFriendList();
    loginDataFetch(new Event('friendRequest'));
  }
  catch(error) {
    console.log(error);
    view.Redirect('/500');
  }
}


// Inject event handler for login to fetch data for friends list
window.addEventListener('loginEvent', loginDataFetch);
window.addEventListener('popstate', fillFriendList);

document.addEventListener('DOMContentLoaded', () => {
  loginDataFetch(new Event('loaded'));
});