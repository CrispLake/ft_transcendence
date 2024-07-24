/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/15 13:31:25 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/22 08:18:32 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Error pages
import InternalError from './views/500.js';
import NotFoundError from './views/404.js';

import Register from './views/Register.js';
import Profile from './views/Profile.js';
import Search from './views/Search.js';
import Login from './views/Login.js';
import About from './views/About.js';
import Home from './views/Home.js';
import Pong from './views/Pong.js';
import Settings from './views/Settings.js';
import History from './views/History.js';
import GameSetup from './views/gameSetup.js';

// List of current event listeners
let views_memory = new Array();

// No idea of this regeex lol
const PathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

// No idea of this regeex lol
const getParams = (match) => {
    const values = match.result.slice(1);
    if (values.length < 1) {
      return;
    }
    const keys = [...match.route.path.matchAll(/:(\w+)/g)].map(result => result[1]);
  
    return Object.fromEntries(keys.map((key, index) => {
      return [key, values[index]];
    }));
  };
  

// Makes back and forward arrows work in browser 
const navigateTo = (url) => {
  console.log('navigating: ', url);
  history.pushState(null, null, url);
  router();
};


// All links or buttons that change content HAS to have 'data-link' attribute
const navigationEventHandler = (event) => {
  if (event.type === 'navigate') {
    event.preventDefault();
    navigateTo(event.detail.href);
  }
  else if (event.target.closest('[data-link]')) {
    event.preventDefault();
    navigateTo(event.target.href);
  }
};


const router = async () => {
  // Define all possible routes for the frontend
  const routes = [
    { path: '/404', view: NotFoundError },
    { path: '/', view: Home },
    { path: '/login', view: Login },
    { path: '/register', view: Register },
    { path: '/500', view: InternalError },
    { path: '/history', view: History },
    { path: '/history/:id', view: History },
    { path: '/settings', view: Settings },
    { path: '/profile', view: Profile },
    { path: '/profile/:id', view: Profile },
    { path: '/about', view: About },
    { path: '/play', view: Pong },
    { path: '/search', view: Search },
    { path: '/gameSetup', view: GameSetup },
  ];

  // If there are listeners, remove them
  if (views_memory.length > 0) {
    console.log('removing listeners');
    for (let i = views_memory.length - 1; i >= 0; i--) {
      const view = views_memory[i];
      console.log('view ', view);
      view.RemoveListeners();
      views_memory.splice(i, 1);
    }
  }

  // Check route list against browser address path
  const routeList = routes.map(route => {
    return { 
      route: route,
      result: location.pathname.match(PathToRegex(route.path))
    };
  });

  // Use found path and it's associated view to render content
  let match = routeList.find(potentialMatch => potentialMatch.result !== null);

  // If no view was found --> default to 404
  if (!match) {
    match = { route: routes[0], result: [location.pathname] };
  };

  // Creating new instance of the view class
  let view = new match.route.view(getParams(match));

  // Handle authentication if needed
  // redirects to login if not authenticated
  if (view.auth) {
    if (!view.Authenticate()) {
      console.log('not authenticated');
      view.Redirect('/login');
      return;
    }
  }

  // Injecting views HTML to the app
  const app = document.querySelector('#app');
  if (view.childs) {
    app.innerHTML = '';
    app.appendChild(await view.getHtml());  // Some content needs to pe appended
  } else {
    app.innerHTML = await view.getHtml();   // Some content needs can be just set
  }

  // Adding eventlisteners from view and saving it to heap
  if (view.listeners !== false) {
    view.AddListeners();
    views_memory.push(view);
  }
}





// Makes "back" button go trough router
window.addEventListener('popstate', router);

// JS Entrypoint --> add's router to dom once it's loaded
document.addEventListener('DOMContentLoaded', () => {
  // Adding event listener for all the links in the page
  document.body.addEventListener('click', navigationEventHandler);
  document.addEventListener('navigate', navigationEventHandler);
  
  // Initial run of the router to load home page
  router();
});