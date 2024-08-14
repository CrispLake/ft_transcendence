/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/30 08:03:51 by jmykkane          #+#    #+#             */
/*   Updated: 2024/06/15 13:32:27 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express');
const path = require('path');

const app = express();

app.use('/static', express.static(path.resolve(__dirname, 'src', 'static')));

app.get('/*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'src', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Frontend running on http://127.0.0.1:${PORT}`);
});
