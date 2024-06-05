/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/30 07:27:30 by jmykkane          #+#    #+#             */
/*   Updated: 2024/05/30 16:21:49 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Global even handlers
window.addEventListener('click', (event) => {
  event.preventDefault();
});

window.addEventListener('navigate', () => {
  urlRoute();
});

// Route definitons avaivable for users
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
};

window.onpopstate = urlLocationHandler;
urlLocationHandler();