export class Notification {
  constructor() {
    console.log("Notification class initialized");
  }

  static show(status, msg) {
    const notify = document.querySelector(".notification");
    if (notify) {
      notify.classList.remove("active");
      setTimeout(() => {
        notify.remove();
      }, 500);
    }

    const notification = document.createElement("div");
    notification.classList.add("notification");

    const notificationContent = document.createElement("div");
    notificationContent.classList.add("notification-content");
    const checkIcon = document.createElement("b");
    checkIcon.classList.add("check");

    switch (status) {
      case "success":
        checkIcon.textContent = "✓";
        checkIcon.style.backgroundColor = "var(--hint-success-border-color)";
        break;
      case "error":
        checkIcon.textContent = "✗";
        checkIcon.style.backgroundColor = "var(--hint-danger-border-color)";
        break;
      default:
        status = "info";
        checkIcon.textContent = "ℹ";
        checkIcon.style.backgroundColor = "var(--hint-info-border-color)";
    }
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    const text1 = document.createElement("span");
    text1.classList.add("text", "text-1");
    text1.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    const text2 = document.createElement("span");
    text2.classList.add("text", "text-2");
    text2.textContent = msg;
    messageDiv.appendChild(text1);
    messageDiv.appendChild(text2);
    notificationContent.appendChild(checkIcon);
    notificationContent.appendChild(messageDiv);
    notification.appendChild(notificationContent);
    const closeIcon = document.createElement("b");
    closeIcon.classList.add("close");
    closeIcon.textContent = "×";
    notification.appendChild(closeIcon);
    const progressDiv = document.createElement("div");
    progressDiv.classList.add("progress");
    notification.appendChild(progressDiv);
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("active");
      progressDiv.classList.add("active");
    }, 100);
    let timer1, timer2;
    timer1 = setTimeout(() => {
      notification.classList.remove("active");
    }, 5000);
    timer2 = setTimeout(() => {
      progressDiv.classList.remove("active");
    }, 5300);
    closeIcon.addEventListener("click", () => {
      notification.classList.remove("active");
      setTimeout(() => {
        progressDiv.classList.remove("active");
        notification.remove();
      }, 300);
      clearTimeout(timer1);
      clearTimeout(timer2);
    });
  }
}
