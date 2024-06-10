import axios from "axios";
// const axios = require('axios');

function registerUser() {
    console.log('hello');
    axios.post('/login/register', {
        username: document.getElementById('username'),
        password: document.getElementById('password')
    })
    .then(function (response) {
    console.log(response);
    })
    .catch(function (error) {
    console.log(error);
    });
}