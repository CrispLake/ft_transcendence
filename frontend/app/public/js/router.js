/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/30 07:27:30 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/11 08:14:20 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Global even handlers
// window.addEventListener('click', (event) => {
//   console.log('Global click prevent default');
//   event.preventDefault();
// });

window.addEventListener('navigate', () => {
  urlRoute();
});

// Route definitons avaivable for users
// template: define any html for given page here
// script: define any javascript to be ran when page runs here
// title: title of the page for browser
const urlRoutes = {
	404: {
		template: '/html/404.html',
		title: '404',
	},
	'/': {
		template: '/html/home.html',
		title: 'Home',
	},
  '/home': {
		template: '/html/home.html',
    script: '/js/login.js',
		title: 'Home',
	},
	'/about': {
		template: '/html/about.html',
		title: 'About Us',
	},
	'/contact': {
		template: '/html/contact.html',
		title: 'Contact Us',
	},
};

// handles button clicks and other redirects
const urlRoute = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, '', event.detail.href);
  urlLocationHandler();
};

// Prevents page refresh by directly modifying dom instead of making a new request
const urlLocationHandler = async () => {
	const location = window.location.pathname;

	if (location.length == 0) {
		location = '/';
	}

	const route = urlRoutes[location] || urlRoutes['404'];
	const html = await fetch(route.template).then((response) => response.text());
	document.getElementById('content').innerHTML = html;
	document.title = route.title;

  if (route.script) {
    const newScript = document.createElement('script');
    newScript.src = route.script;
    document.body.appendChild(newScript)
  }

};

window.onpopstate = urlLocationHandler;
urlLocationHandler();