/**
 * Klasa odpowiedzialna za renderowanie elementu details/summary.
 */
export class RenderDetails {
  /**
   * Tworzy i zwraca element <details> z podsumowaniem i zawartością.
   * @param {string} summaryText Tekst podsumowania wyświetlany w elemencie <summary>
   * @param {HTMLElement} contentHTMLNode Element NodeHTML zawierający zawartość szczegółów. Standardowo opakowywany w div.details-content jeśli nie posiada tej klasy.
   * @returns {HTMLDetailsElement} Utworzony element <details> z podsumowaniem i zawartością
   */
  static renderDetailsSummary(summaryText, contentHTMLNode) {
    const details = document.createElement("details");
    details.classList.add("details-component");

    const summary = document.createElement("summary");
    summary.classList.add("details-summary");
    summary.textContent = summaryText;

    // WCAG: summary musi być klikalny, focusowalny i mieć wyraźny styl focus
    summary.setAttribute("role", "button");
    summary.setAttribute("aria-expanded", "false");

    details.appendChild(summary);

    let content;
    if (contentHTMLNode.classList.contains("details-content")) {
      content = contentHTMLNode;
    } else {
      content = document.createElement("div");
      content.classList.add("details-content");
      content.appendChild(contentHTMLNode);
    }

    details.appendChild(content);

    // Obsługa aria-expanded dla screen readerów
    details.addEventListener("toggle", () => {
      summary.setAttribute("aria-expanded", details.open ? "true" : "false");
    });

    return details;
  }
}
