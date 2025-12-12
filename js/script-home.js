import {Login} from './Class/Login.js';
import { AuthService } from './Class/AuthService.js';

const authService = new AuthService();

// Auto-redirect if already logged in
(async () => {
    try {
        const session = await authService.checkSession();
        if (session.loggedIn) {
            window.location.href = 'dashboard.html';
        }
    } catch (e) {
        console.error("Session check skipped/failed", e);
    }
})();

const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
        const username = formLogin.querySelector('#login').value;
        const password = formLogin.querySelector('#password').value;
        Login.authenticate(username, password);
    });
}