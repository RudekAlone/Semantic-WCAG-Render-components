import { RenderButton } from "./Render/RenderButton.js";
import { RenderInput } from "./Render/RenderInput.js";
import { RenderForm } from "./Render/RenderForm.js";
import { RenderTable } from "./Render/RenderTable.js";
import { RenderDetails } from "./Render/RenderDetails.js";
import { RenderMarkdown } from "./RenderMarkdown.js";
import { RenderQuiz } from "./RenderQuiz.js";
import { RenderCard } from "./Render/RenderCard.js";

/**
 * Fasada (Facade) dla systemu renderowania elementów interfejsu użytkownika.
 * Klasa ta udostępnia uproszczony interfejs do tworzenia komponentów UI,
 * ukrywając szczegóły implementacyjne poszczególnych klas renderujących.
 *
 * Działa jako "pseudo-interfejs", centralizując dostęp do funkcji UI.
 */
export class UIFacade {
  
  /**
   * Tworzy przycisk.
   * @param {string} text - Tekst wyświetlany na przycisku.
   * @param {string} [variant="primary"] - Styl przycisku (np. "primary", "secondary").
   * @param {string} [type="button"] - Typ przycisku HTML (np. "button", "submit").
   * @param {(function|null)} [action=null] - Funkcja wywoływana po kliknięciu.
   * @returns {HTMLButtonElement} Element przycisku.
   */
  static createButton(text, variant = "primary", type = "button", action = null) {
    return RenderButton.renderButton(text, variant, type, action);
  }

  /**
   * Tworzy pole tekstowe lub inny element input.
   * @param {string} label - Tekst etykiety.
   * @param {string} name - Atrybut name.
   * @param {string} id - Atrybut id.
   * @param {string} [type="text"] - Typ pola (np. "text", "email", "password").
   * @param {boolean} [required=true] - Czy pole jest wymagane.
   * @param {Object} [options={}] - Dodatkowe opcje konfiguracyjne.
   * @param {string} [options.role="textbox"] - Rola ARIA.
   * @param {string} [options.direction="row"] - Kierunek układu (row/column).
   * @param {string|boolean} [options.value=""] - Wartość początkowa.
   * @param {Array<string>} [options.acceptFiles=[]] - Typy plików dla input type="file".
   * @param {string} [options.placeholder=""] - Tekst zastępczy.
   * @returns {HTMLDivElement} Kontener z etykietą i polem input.
   */
  static createInput(label, name, id, type = "text", required = true, options = {}) {
    const {
      role = "textbox",
      direction = "row",
      value = "",
      acceptFiles = [],
      placeholder = ""
    } = options;

    return RenderInput.renderInput(
      label, 
      name, 
      id, 
      type, 
      role, 
      required, 
      direction, 
      value, 
      acceptFiles, 
      placeholder
    );
  }

  /**
   * Tworzy kompletny formularz.
   * @param {Array<Object>} elements - Lista konfiguracji pól formularza.
   * @param {string} submitButtonText - Tekst na przycisku zatwierdzania.
   * @param {function} onSubmitMethod - Funkcja obsługująca wysłanie formularza.
   * @returns {HTMLFormElement} Element formularza.
   */
  static createForm(elements, submitButtonText, onSubmitMethod) {
    return RenderForm.renderForm(elements, submitButtonText, onSubmitMethod);
  }

  /**
   * Tworzy responsywną tabelę danych.
   * @param {Array<Array>} data - Dane do wyświetlenia w tabeli.
   * @param {Array<string>} headers - Nagłówki kolumn.
   * @returns {HTMLDivElement} Kontener z tabelą.
   */
  static createTable(data, headers) {
    return RenderTable.renderResponsiveTable(data, headers);
  }

  /**
   * Tworzy element details/summary (rozwijana sekcja).
   * @param {string} summary - Tekst widoczny zawsze (nagłówek).
   * @param {HTMLElement} content - Element HTML z treścią do rozwinięcia.
   * @returns {HTMLDetailsElement} Element details.
   */
  static createDetails(summary, content) {
    return RenderDetails.renderDetailsSummary(summary, content);
  }

  /**
   * Renderuje podgląd Markdown w kontenerze.
   * @param {HTMLElement} container - Element, w którym ma zostać wyrenderowany Markdown.
   * @param {string} markdownContent - Tekst w formacie Markdown.
   */
  static renderMarkdown(container, markdownContent) {
    RenderMarkdown.renderMarkdownPreview(container, markdownContent);
  }

  /**
   * Tworzy i renderuje quiz.
   * @param {Array<Object>} questions - Lista pytań do quizu.
   * @returns {HTMLElement} Kontener z quizem.
   */
  static createQuiz(questions) {
    return RenderQuiz.renderQuiz(questions);
  }

  /**
   * Tworzy pole wyboru (select).
   * @param {string} label - Etykieta pola.
   * @param {Array<Object>} options - Lista opcji ({value, text}).
   * @param {string} [name] - Atrybut name.
   * @param {string} [id] - Atrybut id.
   * @param {boolean} [required=true] - Czy pole jest wymagane.
   * @returns {HTMLDivElement} Kontener z selectem.
   */
  static createSelect(label, options, name, id, required) {
    return RenderInput.selectInputOptions(label, options, name, id, required);
  }

  /**
   * Tworzy obszar tekstowy (textarea).
   * @param {string} label - Etykieta pola.
   * @param {string} name - Atrybut name.
   * @param {string} id - Atrybut id.
   * @param {number} [rows=4] - Liczba wierszy.
   * @param {number} [cols=50] - Liczba kolumn.
   * @param {boolean} [required=true] - Czy pole jest wymagane.
   * @returns {HTMLDivElement} Kontener z textarea.
   */
  static createTextArea(label, name, id, rows = 4, cols = 50, required = true) {
    return RenderInput.renderTextArea(label, name, id, rows, cols, required);
  }

  /**
   * Tworzy pole wyboru pliku z podglądem.
   * @param {string} label - Etykieta pola.
   * @param {string} name - Atrybut name.
   * @param {string} id - Atrybut id.
   * @returns {HTMLDivElement} Kontener z inputem i podglądem.
   */
  static createFileInputWithPreview(label, name, id) {
    return RenderInput.renderFileInputWithPreview(label, name, id);
  }

  /**
   * Tworzy kartę kursu
   * @param {string} title - Tytuł karty.
   * @param {string} image - URL obrazka.
   * @param {string} hash - Hash do nawigacji.
   * @return {HTMLDivElement} Kontener z kartą kursu.
   */
  static createCourseCard(title, image, hash) {
    return RenderCard.createCourseCard(title, image, hash);
  }
}