/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   nav.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/30 08:48:32 by jmykkane          #+#    #+#             */
/*   Updated: 2024/05/31 07:50:20 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Checks that event happened inside a nav bar and forwards it to router
document.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.parentElement.classList.contains('topnav')) {
    return;
  };
  
  // preventing default handler and modifying the navbar
  event.preventDefault();

  // Forwarding custom event to the router to keep state
  const newEvent = new CustomEvent('navigate', { detail: { href: target.href } });
  window.dispatchEvent(newEvent);
});