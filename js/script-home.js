import {Login} from './Class/Login.js';
const login = new Login();

const formLogin = document.getElementById('form-login');
console.log(formLogin);
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
    const username = formLogin.querySelector('#login').value;
    const password = formLogin.querySelector('#password').value;
    const isAuthenticated = Login.authenticate(username, password);

});