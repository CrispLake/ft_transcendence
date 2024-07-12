/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   friends.js                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/07/12 06:52:04 by jmykkane          #+#    #+#             */
/*   Updated: 2024/07/12 08:43:47 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const toggleView = () => {
  // if (!localStorage.getItem('auth_token')) {
    // console.log('not logged in');
    // TODO: create notification to log in
    // return;
  // }

  document.getElementById('dropDownButton').classList.toggle('button-up');
  document.getElementById('dropDownDiv').classList.toggle('show');
}

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