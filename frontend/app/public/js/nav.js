/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   nav.js                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/30 08:48:32 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/10 13:47:24 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Checks that event happened inside a nav bar and forwards it to router
document.addEventListener('click', (event) => {
  const { target } = event;

  // Check if the clicked element is an <a> tag inside the topnav
  if (target.tagName === 'A' && target.parentElement.classList.contains('topnav')) {
    // Prevent default behavior of the <a> tag
    event.preventDefault();

    // Forward a custom event to the router with the href of the clicked link
    const newEvent = new CustomEvent('navigate', { detail: { href: target.href } });
    window.dispatchEvent(newEvent);
  }
});
