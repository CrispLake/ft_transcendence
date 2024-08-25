/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: emajuri <emajuri@student.hive.fi>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/05/30 08:03:51 by jmykkane          #+#    #+#             */
/*   Updated: 2024/08/25 12:25:33 by emajuri          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

var fs = require('fs');
// var http = require('http');
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

// var httpApp = express();
// httpApp.use((req, res, next) => {
//   res.redirect('https://' + req.headers.host + req.url);
// });

// var httpServer = http.createServer(httpApp);
var httpsServer = https.createServer(credentials, app);

// httpServer.listen(8080);
httpsServer.listen(3000);
