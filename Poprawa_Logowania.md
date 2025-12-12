# Analiza i Plan Naprawy Mechanizmu Logowania

Obecny system logowania i autoryzacji posiada krytyczne luki bezpieczeństwa i błędy logiczne. Poniżej przedstawiono analizę problemów oraz szczegółowy plan naprawczy.

## 1. Zidentyfikowane Problemy

### A. Frontend ("Bezpieczeństwo" po stronie klienta)
*   **Problem:** Dostęp do stron (np. Dashboard) jest warunkowany obecnością wpisu `user_role` w `localStorage`.
*   **Skutek:** Każdy użytkownik może ręcznie dodać ten wpis w konsoli przeglądarki i uzyskać dostęp do panelu (nawet jeśli backend nie zwróci danych, szkielet strony się załaduje).
*   **Problem:** Brak weryfikacji sesji po odświeżeniu strony.
*   **Skutek:** Jeśli sesja wygaśnie na serwerze, frontend nadal "myśli", że użytkownik jest zalogowany (bo dane są w `localStorage`).

### B. Backend (Brak weryfikacji uprawnień)
*   **Problem:** Kontrolery (np. `TaskController`, `StatsController`) nie sprawdzają, czy użytkownik jest zalogowany.
*   **Skutek:** Każdy, kto zna adres endpointu (np. `/backend/api/tasks`), może pobrać dane (curl, Postman) bez logowania.
*   **Problem:** Brak kontroli ról (RBAC) po stronie serwera.
*   **Skutek:** "Uczeń" może teoretycznie wywołać endpointy "Nauczyciela" (np. usuwanie użytkowników), jeśli tylko zna URL, a API tego nie blokuje.

### C. Architektura
*   **Problem:** Logika uprawnień ("kto co widzi") jest zaszyta na sztywno w `script3.js` na podstawie `localStorage`.
*   **Rozwiązanie:** Frontend powinien jedynie *wyświetlać* to, na co pozwala backend, ale to backend musi być źródłem prawdy.

---

## 2. Plan Naprawczy (To-Do)

### Krok 1: Backend - Zabezpieczenie API (Critical)
Należy wprowadzić mechanizm, który odrzuca żądania do chronionych zasobów dla niezalogowanych użytkowników.

- [x] **Modyfikacja `Core\Auth\AuthController.php`**:
    - [x] Dodać metodę `check()` (endpoint `/api/auth/check` lub `/api/me`), która zwraca status sesji (zalogowany/niezalogowany) oraz rolę użytkownika.
- [x] **Modyfikacja `backend/core/api.php`**:
    - [x] Dodać logikę "Middleware" przed wywołaniem kontrolerów.
    - [x] Sprawdzać `SessionManager::isLoggedIn()`.
    - [x] Jeśli użytkownik nie jest zalogowany, a próbuje dostać się do zasobów chronionych (wszystko poza `login`), zwrócić kod `401 Unauthorized`.
- [x] **Weryfikacja Ról (RBAC)**:
    - [x] Dodać sprawdzanie roli w kontrolerach wrażliwych (np. `UserController` dostępny tylko dla Admina/Nauczyciela, `TaskController` (edycja) dla Nauczyciela).

### Krok 2: Frontend - Implementacja AuthService
Należy przenieść logikę autoryzacji do dedykowanej klasy, która komunikuje się z backendem.

- [x] **Stworzenie `js/Class/AuthService.js`**:
    - [x] Metoda `login(username, password)` – strzela do API, po sukcesie *nie zapisuje roli w localStorage*, ew. tylko flagę "isLoggedIn" dla UX, ale prawdziwa weryfikacja dzieje się przez sesję (cookie).
    - [x] Metoda `checkSession()` – wywoływana przy starcie Dashboardu. Pyta backend o status. Jeśli 401 -> przekierowanie na Login.
    - [x] Metoda `logout()` – strzela do API `/logout` i czyści stan frontendu.

### Krok 3: Refaktoryzacja Dashboardu (`script3.js`)
- [x] Usunąć logikę pobierania roli z `localStorage` (`const role = localStorage.getItem('user_role')`).
- [x] Zastąpić to wywołaniem `AuthService.checkSession()` na starcie.
    - [x] Czekamy na odpowiedź serwera.
    - [x] Serwer zwraca: `{ loggedIn: true, role: 'teacher', name: '...' }`.
    - [x] Dopiero wtedy renderujemy menu (`DashboardRender`) z odpowiednimi opcjami.
    - [x] Loader/Spinner na czas weryfikacji sesji, aby użytkownik nie widział "migającej" treści.

### Krok 4: Czyszczenie `Login.js`
- [x] `Login.js` powinien korzystać z `AuthService`.
- [x] Usunąć `localStorage.setItem('user_role', ...)` – to jest zbędne i niebezpieczne jako źródło prawdy.

## 3. Nowy przepływ (Flow)

1. **Użytkownik wchodzi na `dashboard.html`**.
2. **Skrypt startowy (`script3.js`) uruchamia `AuthService.verify()`**.
3. **Request do backendu (`GET /backend/api/auth/check`)**.
    *   *Backend sprawdza PHP Session ID (cookie).*
4. **Scenariusz A (Zalogowany):**
    *   Backend zwraca `200 OK { role: 'admin' }`.
    *   Frontend renderuje menu dla admina.
5. **Scenariusz B (Niezalogowany/Sesja wygasła):**
    *   Backend zwraca `401 Unauthorized`.
    *   Frontend przekierowuje na `index.html` (strona logowania).

## 4. Uwagi końcowe
- Backend musi korzystać z mechanizmu sesji opartego na ciasteczkach (Cookies) z flagą `HttpOnly` (PHP robi to domyślnie dla PHPSESSID), co zapobiega wykradnięciu sesji przez XSS (w przeciwieństwie do localStorage).
