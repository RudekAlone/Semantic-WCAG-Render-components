import { Storage } from "./Class/Service/Storage.js";

// Tworzenie przełączników
const themeSwitcher = document.createElement("label");
themeSwitcher.classList.add("switch");

const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.id = "theme-switcher";
themeSwitcher.appendChild(checkbox);
const slider = document.createElement("span");
slider.classList.add("slider", "round");
themeSwitcher.appendChild(slider);

document.querySelector("header").appendChild(themeSwitcher);

// Obsługa przełącznika motywu

themeSwitcher.addEventListener("change", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute(
    "data-theme",
    currentTheme === "dark" ? "light" : "dark"
  );
    Storage.setCookie("theme", currentTheme === "dark" ? "light" : "dark", 365);

});

const savedTheme = Storage.getCookie("theme");
if (savedTheme === "dark") {
  checkbox.checked = true;
} else {
  checkbox.checked = false;
}

// WCAG Fixes
themeSwitcher.title = "Przełącz motyw jasny/ciemny";
themeSwitcher.setAttribute("aria-label", "Przełącz motyw jasny/ciemny");
themeSwitcher.setAttribute("role", "switch");
themeSwitcher.setAttribute("aria-checked", checkbox.checked.toString());
themeSwitcher.addEventListener("change", () => {
  themeSwitcher.setAttribute("aria-checked", checkbox.checked.toString());
});
// Ustawienie początkowego motywu na podstawie cookie
if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
} else {
  document.documentElement.setAttribute("data-theme", "light");
}