import {Login} from './Class/Login.js';

// Auto-redirect if already logged in
if (localStorage.getItem('user_role')) {
    window.location.href = 'dashboard.html';
}

const login = new Login();

const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
        const username = formLogin.querySelector('#login').value;
        const password = formLogin.querySelector('#password').value;
        Login.authenticate(username, password);

    });
}