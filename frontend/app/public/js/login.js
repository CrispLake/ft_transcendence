const axios = require('axios');

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

const form = document.getElementById("loginform");
form.addEventListener("submit");