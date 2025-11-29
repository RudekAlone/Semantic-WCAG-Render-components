import { RenderInput } from "./RenderInput.js";
import { RenderButton } from "./RenderButton.js";

/**
 * Klasa odpowiedzialna za renderowanie formularzy.
 */
export class RenderForm {
  /**
   * Tworzy i zwraca element <form> na podstawie przekazanej konfiguracji pól.
   *
   * @param {Array<Object>} [elements=[]] - [] Tablica obiektów opisujących pola formularza. Każdy obiekt może zawierać:
   * - {string} label    - Etykieta pola,
   * - {string} name     - Atrybut name dla elementu input,
   * - {string|number} [id]   - Atrybut id dla elementu input,
   * - {string} [type]   - Typ inputu (np. "text", "checkbox", "radio", "file", "color", "range"),
   * - {string} [role]   - Dodatkowa informacja/rola używana przez RenderInput.renderInput,
   * - {boolean} [required=false] - Czy pole jest wymagane.
   *
   * @example
   * [
   *   {
   *     label: "Nazwa użytkownika",
   *     name: "username",
   *     id: "login-username",
   *     type: "text",
   *     role: "textbox",
   *     required: true,
   *   },
   *   {
   *     label: "Hasło",
   *     name: "password",
   *     id: "login-password",
   *     type: "password",
   *     role: "textbox",
   *     required: true,
   *   },
   * ]
   *
   * @param {string} [submitButtonText="Submit"] - Tekst wyświetlany na przycisku submit.
   * @param {(function|null)} [onSubmitMethod=null] - Opcjonalna funkcja obsługi zdarzenia submit. Jeśli przekazano funkcję
   *
   * @param {string} [direction="column"] - Układ formularza zapisywany w atrybucie data-layout (np. "column" lub "row").
   * @returns {HTMLFormElement} Utworzony element <form> zawierający wyrenderowane pola oraz przycisk submit.
   */
  static renderForm(
    elements = [],
    submitButtonText = "Submit",
    onSubmitMethod = null,
    direction = "column"
  ) {
    const form = document.createElement("form");
    form.setAttribute("data-ui", "form");
    form.setAttribute("data-layout", direction);

    elements.forEach((element) => {
      let inputWrapper;
      if (!element.selectInputOptions) {
        inputWrapper = RenderInput.renderInput(
          element.label,
          element.name,
          element.id,
          element.type,
          element.role,
          element.required
        );

        const input = inputWrapper.querySelector("input");
        if (
          input &&
          !["checkbox", "radio", "file", "color", "range"].includes(
            element.type
          )
        ) {
          input.setAttribute("autocomplete", "on");
        }
      } else {
        inputWrapper = RenderInput.selectInputOptions(
          element.label,
          element.options,
          element.name,
          element.id,
          element.required,
          element.layout
        );
      }
      form.appendChild(inputWrapper);
    });

    const submitButton = RenderButton.renderButton(
      submitButtonText,
      "primary",
      "submit"
    );
    form.appendChild(submitButton);

    if (typeof onSubmitMethod === "function") {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        onSubmitMethod(new FormData(form));
      });
    }

    return form;
  }
}
