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
      Notification.show("error", "Login failed. Please check your credentials.");
      return null;
    }
  }).then((data) => {
    if (data) {
      Notification.show("success", "Login successful!");
      return true;
    } else {
      return false;
    }
  }).catch((error) => {
    Notification.show("error", "An error occurred. Please try again later.");
    return false;
  });
  }
}