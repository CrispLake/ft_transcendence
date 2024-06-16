/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/15 13:31:25 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/16 07:18:36 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Home from './views/Home.js';

// Makes back and forward arrows work in browser 
const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

// Global event handler for navigation links
// NOTE: all links in the page needs to have 'data-link' attribute
const navigationEventHandler = (event) => {
  if (event.target.matches('[data-link]')) {
    event.preventDefault();
    navigateTo(event.target.href);
  }
};

const router = async () => {
  // Define all possible routes for the frontend
  const routes = [
    // { path: '/404', view: () => console.log('not found') },
    { path: '/', view: Home },
    // { path: '/history', view: () => console.log('viewing history') },
    // { path: '/settings', view: () => console.log('viewing settings') },
  ];

  // Check route list against browser address path
  // TODO: change directly to find if possible
  const routeList = routes.map(route => {
    return { route: route, isMatch: location.pathname === route.path };
  });

  // Use found path and it's associated view to render content
  let match = routeList.find(routeList => routeList.isMatch);

  // If no view was found --> default to root ('/')
  if (!match) {
    match = { route: routes[0], isMatch: true }
  };

  // Creating new instance of the view class
  const view = new match.route.view();

  // Injecting views HTML to the app
  document.querySelector('#app').innerHTML = await view.getHtml();
};

// Makes "back" button go trough router
window.addEventListener('popstate', router);

// JS Entrypoint --> add's router to dom once it's loaded
document.addEventListener('DOMContentLoaded', () => {
  // Adding event listener for all the links in the page
  document.body.addEventListener('click', navigationEventHandler);
  
  // Initial run of the router to load home page
  router();
});