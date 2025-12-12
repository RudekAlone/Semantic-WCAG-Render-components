import {DashboardRender} from '/js/Class/DashboardRender.js';
import { RenderButton } from '/js/Class/Render/RenderButton.js';
import { AuthService } from '/js/Class/AuthService.js';

const authService = new AuthService();

(async () => {
    // 1. Sprawdź sesję
    const session = await authService.checkSession();

    // 2. Jeśli brak autoryzacji - przekieruj na login
    if (!session.loggedIn) {
        window.location.href = "/";
        return;
    }

    const role = session.role || 'student';

    // 3. Renderuj przycisk wylogowania
    document.querySelector("header").appendChild(
        RenderButton.renderButton("Wyloguj się", "secondary", "button", async () => {
            await authService.logout();
            window.location.href = "/";
        })
    );

    const main = document.querySelector('main');
    main.innerHTML = '';

    // Pobierz menu z sesji (Server-Driven UI)
    const filteredPages = session.menu || [];

    if (filteredPages.length === 0) {
        main.innerHTML = '<p class="error-message">Błąd ładowania menu lub brak uprawnień.</p>';
    } else {
        main.appendChild(DashboardRender.render(filteredPages));
    }
})();
