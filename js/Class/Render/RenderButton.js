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
    button.innerHTML = this.searchEmojiFromText(text);

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

  static searchEmojiFromText(text) {
    // wyszukiwanie emoji w tekście i wrapowanie go w span z klasą emoji + zwracanie zmodyfikowanego tekstu
    // Przykłąd: "🎓 Kursy" => "Hello <span class="emoji">🎓</span><span> Kursy"
    const emojiRegex = /([\u231A-\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|[\uD83C][\uDC00-\uDFFF]|[\uD83D][\uDC00-\uDFFF]|[\uD83E][\uDC00-\uDFFF])/g;
    return text.replace(emojiRegex, (match) => {
      return `<span class="emoji">${match}</span>`;
    });   
  }

}
