/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmykkane <jmykkane@student.hive.fi>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/30 08:03:51 by jmykkane          #+#    #+#             */
/*   Updated: 2024/05/30 08:12:51 by jmykkane         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'public', 'html', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend running on http://127.0.0.1:${PORT}`);
});
