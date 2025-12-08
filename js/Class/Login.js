import { Notification } from "./Notification.js";
export class Login {

  static authenticate(username, password) {
    
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      Notification.show("error", "Logowanie nie powiodło się. Sprawdź swoje dane logowania.");
      return null;
    }
  }).then((data) => {
    if (data) {
      Notification.show("success", "Logowanie powiodło się!");
      return true;
    } else {
      return false;
    }
  }).catch((error) => {
    Notification.show("error", "Wystąpił błąd. Spróbuj ponownie później.");
    return false;
  });
  }
}