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

var cors = require('cors');
var fs = require('fs');
// var http = require('http');
var https = require('https');
const path = require('path');
var privateKey  = fs.readFileSync('app/certs/key.pem', 'utf8');
var certificate = fs.readFileSync('app/certs/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

app.use(cors({
    origin: ['https://localhost:3000', 'https://127.0.0.1', 'https://localhost:8000'], // Add allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add allowed methods
    credentials: true // Include credentials (cookies, authorization headers, etc.)
}));

app.use('/static', express.static(path.resolve(__dirname, 'src', 'static')));

app.get('/*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'src', 'index.html'));
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000);
