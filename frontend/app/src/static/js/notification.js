/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   notification.js                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/27 12:45:45 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/27 12:57:49 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Using this requires inner div with id of 'notification-div'
export const Notification = async (elementID, content, type) => {
  // mode following C style return codes
  const ERROR = 1;
  const OK = 0; 

  // Find element --> exit if cannot
  const element = document.getElementById(elementID);
  if (!element) {
    console.log(`ERROR - Cannot find element with ID: ${elementID}`);
    return;
  }

  // set content --> message of the notification
  element.innerHTML = content;

  // Select error or success message, more could be added
  if (type === OK) {
    element.setAttribute('style', 'background-color: light-green');
  }
  else if (type === ERROR) {
    element.setAttribute('style', 'background-color: coral');
  }

  // Make notification appear and disappear
  await element.setAttribute('style', 'opacity: 1');
  setTimeout(() => element.setAttribute('style', 'opacity: 0'), 5000);
}