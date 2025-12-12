export class AuthService {
    constructor(apiUrl = '/backend/api') {
        this.apiUrl = apiUrl;
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async checkSession() {
        try {
            const response = await fetch(`${this.apiUrl}/auth/check`);
            if (response.status === 401) {
                return { loggedIn: false };
            }
            if (!response.ok) {
                return { loggedIn: false };
            }
            return await response.json();
        } catch (error) {
            console.error('Session check error:', error);
            return { loggedIn: false };
        }
    }

    async logout() {
        try {
            const response = await fetch(`${this.apiUrl}/auth/logout`);
            return response.ok;
        } catch (error) {
             console.error('Logout error:', error);
             return false;
        }
    }
}
