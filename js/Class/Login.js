import { Notification } from "./Notification.js";
export class Login {

  static authenticate(username, password) {
    
    return fetch("backend/api/login", { // Dostosowano ścieżkę do struktury PHP
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
  })
  .then(async (response) => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
        // Rzucamy błąd, aby przejść do catch, ale przekazujemy komunikat z serwera
        throw new Error(data.error || "Nieprawidłowe dane logowania.");
    }
  })
  .then((data) => {
      Notification.show("success", "Logowanie powiodło się!");
      
      // Zapisz dane użytkownika
      localStorage.setItem('user_role', data.role);
      localStorage.setItem('user_name', data.name);
      
      // Przekieruj do dashboardu
      setTimeout(() => {
          window.location.href = "dashboard.html";
      }, 1000);
      
      return true;
  })
  .catch((error) => {
    Notification.show("error", error.message || "Wystąpił błąd. Spróbuj ponownie później.");
    return false;
  });
  }
}