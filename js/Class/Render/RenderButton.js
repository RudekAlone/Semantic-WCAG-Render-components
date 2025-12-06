/**
 * Klasa odpowiedzialna za renderowanie przycisków.
 */
export class RenderButton {
  /**
   * Tworzy i zwraca element <button> na podstawie przekazanych parametrów.
   * @param {string} text - Tekst wyświetlany na przycisku.
   * @param {string} [variant="primary"] - Wariant stylu przycisku (np. "primary", "secondary", "tertiary", "quaternary", "fifth").
   * @param {string} [type="button"] - Typ przycisku (np. "button", "submit", "reset").
   * @param {(function|null)} [eventMethod=null] - Funkcja obsługi zdarzenia kliknięcia przycisku.
   * @return {HTMLButtonElement} Utworzony element <button>.
   */
  static renderButton(
    text,
    variant = "primary",
    type = "button",
    eventMethod = null
  ) {
    const button = document.createElement("button");
    button.textContent = text;

    // Utility-first hook
    button.setAttribute("data-ui", "button");
    button.setAttribute("data-variant", variant);

    // Semantyka i dostępność
    button.setAttribute("type", type);
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-label", text);

    // Styl wariantu
    const variantClass = {
      primary: "bg-primary",
      secondary: "bg-secondary",
      tertiary: "bg-tertiary",
      quaternary: "bg-quaternary",
      fifth: "bg-fifth",
      tabButton: "tab-button",
    }[variant];

    if (variantClass) {
      button.classList.add(variantClass);
    }

    // Zdarzenie
    if (typeof eventMethod === "function") {
      button.addEventListener("click", eventMethod);
    }

    return button;
  }
}
