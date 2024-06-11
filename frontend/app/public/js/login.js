/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.js                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/06/11 07:59:43 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/11 08:24:42 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Event handler for submit button
const submitButtonHandler = (event) => {
  event.preventDefault();
  console.log('submit button pressed');

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (!username || !password) {
    console.log('please fill the fields :)');
    return;
  }

  console.log(`username: ${username} password: ${password}`);

  axios.post('/login', {
    username: username,
    password: password
  })
  .then(() => {
    console.log('post succesfull');
  })
  .catch(() => {
    console.log(error);
  });
};



// Will be ran on load
window.setTimeout(() => {
  const button = document.querySelector("#submit-button");

  if (button) {
    console.log('button exists');
    button.addEventListener('click', submitButtonHandler);
  } else {
    console.log('button did not exist');
  }
}, 500);
