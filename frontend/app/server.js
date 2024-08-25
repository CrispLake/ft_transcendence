/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: emajuri <emajuri@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/30 08:03:51 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/25 14:22:05 by emajuri          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

var fs = require('fs');
var https = require('https');
const path = require('path');
var privateKey  = fs.readFileSync('app/certs/selfsigned.key', 'utf8');
var certificate = fs.readFileSync('app/certs/selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

app.use('/static', express.static(path.resolve(__dirname, 'src', 'static')));

app.get('/*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'src', 'index.html'));
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000);
