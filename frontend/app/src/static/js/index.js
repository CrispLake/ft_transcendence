/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/15 13:31:25 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/20 18:23:57 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import Profile from './views/Profile.js';
import About from './views/About.js';
import Home from './views/Home.js';

// List of current event listeners
const event_listeners = new Array();

// No idea of this regeex lol
const PathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

// No idea of this regeex lol
const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g).map(result => result[1]));

  return Object.fromEntries(keys.map((key, index) => {
    return [key, values[index]];
  }));
};

// Makes back and forward arrows work in browser 
const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

// All links or buttons that change content HAS to have 'data-link' attribute
const navigationEventHandler = (event) => {
  if (event.target.closest('[data-link]')) {
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
    { path: '/profile', view: Profile },
    { path: '/profile/:id', view: Profile },
    { path: '/about', view: About },
    // { path: '/login', view: Login },
    // { path: '/register', view: Register },
  ];

  // Check route list against browser address path
  // TODO: change directly to find if possible
  const routeList = routes.map(route => {
    return { 
      route: route,
      result: location.pathname.match(PathToRegex(route.path))
    };
  });

  // Use found path and it's associated view to render content
  let match = routeList.find(potentialMatch => potentialMatch.result !== null);

  // If no view was found --> default to root ('/')
  if (!match) {
    match = { route: routes[0], result: [location.pathname] };
  };

  // Creating new instance of the view class
  const view = new match.route.view(getParams(match));

  // If there are listeners, remove them
  if (event_listeners.length > 0) {
    for (let i = event_listeners.length - 1; i >= 0; i--) {
      const {type, func} = event_listeners[i];
      document.removeEventListener(type, func);
      event_listeners.splice(i, 1);
    }
  }

  // Adding eventlisteners from view
  if (view.listeners !== false) {
    view.AddListeners();
    view.listeners.map(({type, func}) => {
      event_listeners.push({type, func});
    });
  }

  // Injecting views HTML to the app
  const app = document.querySelector('#app');
  app.innerHTML = await view.getHtml();
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