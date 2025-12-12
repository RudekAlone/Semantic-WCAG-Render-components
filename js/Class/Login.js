import { Notification } from "./Notification.js";
import { AuthService } from "./AuthService.js";

const authService = new AuthService();

export class Login {

  static async authenticate(username, password) {
    try {
        await authService.login(username, password);
        Notification.show("success", "Logowanie powiodło się!");
        
        // Po poprawnym zalogowaniu (sesja cookie ustawiona przez backend), przekierowujemy
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
        
        return true;
    } catch (error) {
        Notification.show("error", error.message || "Wystąpił błąd logowania.");
        return false;
    }
  }
}