import { RenderUtils } from "./RenderUtils.js";

/**
 * Klasa odpowiedzialna za renderowanie pól formularza (input, textarea, select, file).
 */
export class RenderInput {
  /**
   * Tworzy i zwraca element <input> na podstawie przekazanych parametrów.
   * @param {string|HTMLElement} labelText - Tekst etykiety lub element HTML dla etykiety.
   * @param {string} name - Atrybut name dla elementu input.
   * @param {string|number} id - Atrybut id dla elementu input.
   * @param {string} [type="text"] - Typ inputu (np. "text", "email", "number", "password", "checkbox", "file", "color", "range").
   * @param {string} [role="textbox"] - Dodatkowa informacja/rola używana przez WCAG (np. "textbox", "checkbox").
   * @param {boolean} [required=true] - Czy pole jest wymagane.
   * @param {string} [direction="row"] - Układ etykiety i inputa zapisywany w atrybucie data-layout (np. "row", "row-center", "column" lub "column-center").
   * @param {string} [value=""] - Wstępna wartość inputa jeżeli "true" to zastosuje atrybut checked.
   * @param {Array<string>} [acceptFiles=[]] - Tablica typów plików akceptowanych w przypadku typu "file".
   * @param {string} [placeholder=""] - Tekst zastępczy (placeholder).
   * @return {HTMLDivElement} Utworzony element <div> zawierający etykietę i input.
   *
   * @example
   * ["application/pdf", "image/*"] // dla plików akceptowanych w input type="file"
   */
  static renderInput(
    labelText,
    name = "",
    id = "",
    type = "text",
    role = "textbox",
    required = true,
    direction = "row",
    value = "",
    acceptFiles = [],
    placeholder = ""
  ) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("input-wrapper", `layout-${direction}`);

    if( name === "") {
      name = this._generateId();
    }
    if( id === "") {
      id = this._generateId();
    }

    // === LABEL ===
    const label = (() => {
      let lbl;
      if (typeof labelText === "string") {
        lbl = document.createElement("label");
        lbl.textContent = labelText;
      } else if (labelText instanceof HTMLElement) {
        lbl = labelText;
      } else {
        lbl = document.createElement("label");
        lbl.textContent = "";
      }
      lbl.classList.add("input-label");
      lbl.setAttribute("for", id);
      return lbl;
    })();
    wrapper.appendChild(label);

    // === INPUT ===
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.id = id;
    input.setAttribute("data-ui", "input");

    if (role) input.setAttribute("role", role);
    if (required) input.required = true;
    if (type !== "radio") input.setAttribute("tabindex", "0");

    // Typowe wartości
    if (type === "color") {
      input.value = value || "#008be7";
      label.addEventListener("click", () => input.focus());
    } else if (type === "file" && acceptFiles.length > 0) {
      input.accept = acceptFiles.join(",");
    } else if (["checkbox", "radio"].includes(type)) {
      input.checked = value === "true" || value === true;
    } else if (value) {
      input.defaultValue = value;
    }

    // Label pusty → sr-only + placeholder
    if (!label.textContent) {
      label.classList.add("sr-only");
      label.textContent = "Wpisz wartość";
      if (placeholder) input.placeholder = placeholder;
    }

    // === Obsługa number (uniwersalna) ===
    if (type === "number") {
      input.setAttribute("inputmode", "numeric");
      input.setAttribute("pattern", "[0-9]*");
      input.addEventListener("keypress", (e) => {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
      });

      const buttonUp = document.createElement("button");
      buttonUp.type = "button";
      buttonUp.classList.add("koala-number-arrow", "koala-number-arrow-up");
      buttonUp.textContent = "▲";
      buttonUp.setAttribute("aria-label", "Increase value");
      buttonUp.addEventListener("click", () => {
        input.stepUp();
        input.dispatchEvent(new InputEvent("input", { bubbles: true }));
      });

      const buttonDown = document.createElement("button");
      buttonDown.type = "button";
      buttonDown.classList.add("koala-number-arrow", "koala-number-arrow-down");
      buttonDown.textContent = "▼";
      buttonDown.setAttribute("aria-label", "Decrease value");
      buttonDown.addEventListener("click", () => {
        input.stepDown();
        input.dispatchEvent(new InputEvent("input", { bubbles: true }));
      });

      const numericInput = document.createElement("div");
      numericInput.classList.add("numeric-input");
      const numericArrowWrapper = document.createElement("div");
      numericArrowWrapper.classList.add("numeric-arrow-wrapper");

      numericInput.appendChild(input);
      numericArrowWrapper.appendChild(buttonUp);
      numericArrowWrapper.appendChild(buttonDown);
      numericInput.appendChild(numericArrowWrapper);

      wrapper.appendChild(numericInput);
    } else {
      wrapper.appendChild(input);
    }
    // === Obsługa password (uniwersalna) ===
    if (type === "password") {
      input.setAttribute("autocomplete", "new-password");
      const indicator = document.createElement("div");
      indicator.classList.add("password-strength-indicator");
      indicator.textContent = "Siła hasła: 0/5";
      wrapper.appendChild(indicator);
      input.addEventListener("input", () => {
        const value = input.value;
        const strength = this._checkPasswordStrength(value);
        this._updatePasswordStrengthIndicator(strength, indicator);
      });
    }



    return wrapper;
  }

  /**
   * Tworzy i zwraca element <div> zawierający etykietę i pole textarea na podstawie przekazanych parametrów.
   *
   * Domyślne pozostawianie wartości name i id generuje unikalne identyfikatory.
   * 
   * @param {string} labelText Tekst etykiety
   * @param {string} name
   * @param {string} id
   * @param {int} rows ilość wierszy, domyślnie 4
   * @param {int} cols ilość kolumn znakowych, domyślnie 50
   * @param {boolean} required Czy pole jest wymagane
   * @returns Element <div> zawierający etykietę i pole textarea
   */
  static renderTextArea(
    labelText,
    name = "",
    id = "",
    rows = 4,
    cols = 50,
    required = true
  ) {
    const wrapper = document.createElement("div");
    // wrapper.setAttribute("data-ui", "textarea-wrapper");
    wrapper.classList.add("textarea-wrapper");

    const label = document.createElement("label");
    label.textContent = labelText;
    label.setAttribute("for", id);
    label.setAttribute("data-ui", "textarea-label");
    wrapper.appendChild(label);

    const textArea = document.createElement("textarea");

    if(id === "") {
      textArea.setAttribute("id", this._generateId());
    } else {
      textArea.setAttribute("id", id);
    }
    if(name === "") {
      textArea.setAttribute("name", this._generateId());
    } else {
      textArea.setAttribute("name", name);
    }

    textArea.setAttribute("rows", rows);
    textArea.setAttribute("cols", cols);
    textArea.setAttribute("autocomplete", "on");
    textArea.setAttribute("data-ui", "textarea");

    // WCAG fix
    textArea.setAttribute("aria-label", labelText);
    textArea.setAttribute("aria-required", required);
    textArea.setAttribute("role", "textbox");
    textArea.setAttribute("tabindex", "0");

    // --- Dodajemy obsługę Ctrl+] i Ctrl+[ ---
    const indent = "  "; // dwie spacje

    textArea.addEventListener("keydown", function (e) {
      const value = this.value;
      const start = this.selectionStart;
      const end = this.selectionEnd;

      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const lineEnd = value.indexOf("\n", end);
      const sliceEnd = lineEnd === -1 ? value.length : lineEnd;

      // INDENT: Ctrl+]
      if (e.ctrlKey && e.key === "]") {
        e.preventDefault();
        const block = value
          .slice(lineStart, sliceEnd)
          .split("\n")
          .map((line) => indent + line)
          .join("\n");

        this.value = value.slice(0, lineStart) + block + value.slice(sliceEnd);

        this.selectionStart = start + indent.length;
        this.selectionEnd = end + indent.length * block.split("\n").length;
      }

      // OUTDENT: Ctrl+[
      if (e.ctrlKey && e.key === "[") {
        e.preventDefault();
        const lines = value.slice(lineStart, sliceEnd).split("\n");
        let removedTotal = 0;

        const block = lines
          .map((line) => {
            if (line.startsWith(indent)) {
              removedTotal += indent.length;
              return line.slice(indent.length);
            }
            return line;
          })
          .join("\n");

        this.value = value.slice(0, lineStart) + block + value.slice(sliceEnd);

        this.selectionStart = Math.max(start - indent.length, lineStart);
        this.selectionEnd = Math.max(end - removedTotal, this.selectionStart);
      }
    });

    wrapper.appendChild(textArea);
    return wrapper;
  }

  /**
   * Tworzy i zwraca element <select> z opcjami na podstawie przekazanej tablicy obiektów.
   *
   * Domyślne pozostawianie wartości name i id generuje unikalne identyfikatory.
   * 
   * @param {string} label - Etykieta pola.
   * @param {Array<Object>} options Tablica obiektów opisujących opcje selecta. Każdy obiekt powinien zawierać:
   * - {string} value - Wartość atrybutu value dla opcji
   * - {string} text  - Tekst wyświetlany dla opcji
   * @param {string} name Atrybut name dla elementu select
   * @param {string|number} id Atrybut id dla elementu select
   * @param {boolean} required Czy pole jest wymagane
   * @param {string} direction Kierunek układu.
   * @returns Element <select> z dodanymi opcjami
   *
   * @example
   * [
   * { value: "", text: "Wybierz opcję" },
   * { value: "option1", text: "Opcja 1" },
   * { value: "option2", text: "Opcja 2" },
   * { value: "option3", text: "Opcja 3" },
   * ]
   */
  static selectInputOptions(
    label = "",
    options = [],
    name = "",
    id = "",
    required = true,
    direction = "row"
  ) {
    const select = document.createElement("select");
    options.forEach((optionData) => {
      const option = document.createElement("option");
      option.value = optionData.value ?? "";
      option.textContent = optionData.text;
      select.appendChild(option);
    });

    // Atrybuty semantyczne

    select.setAttribute("autocomplete", "on");

    // WCAG
    select.setAttribute("role", "listbox");
    select.setAttribute("tabindex", "0");
    select.setAttribute("aria-label", "Wybierz opcję");
    select.setAttribute("aria-required", required);

    const labelElement = document.createElement("label");
    labelElement.textContent = label;
    // labelElement.setAttribute("data-ui", "select-label");

    if (name == "") {
      select.setAttribute("name", this._generateId());
    } else {
      select.setAttribute("name", name);
    }
    if (id == "") {
      select.setAttribute("id", this._generateId());
      labelElement.setAttribute("for", select.getAttribute("id"));
    } else {
      select.setAttribute("id", id);
      labelElement.setAttribute("for", id);
    }

    const wrapper = document.createElement("div");
    // wrapper.setAttribute("data-ui", "input-wrapper");
    wrapper.classList.add("input-wrapper");
    wrapper.setAttribute("data-layout", direction);
    wrapper.appendChild(labelElement);
    wrapper.appendChild(select);

    if (label == "") {
      labelElement.classList.add("sr-only");

      labelElement.textContent = "Wybierz opcję";
    }

    return wrapper;
  }

  /**
   * Tworzy element input typu file z podglądem wybranego pliku.
   * Obsługuje podgląd obrazów, audio, wideo oraz plików tekstowych.
   *
   * @param {string} labelText - Tekst etykiety dla pola wyboru pliku.
   * @param {string} name - Atrybut name dla inputa.
   * @param {string} id - Atrybut id dla inputa.
   * @returns {HTMLDivElement} Kontener zawierający etykietę, input i obszar podglądu.
   */
  static renderFileInputWithPreview(labelText, name, id) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("file-wrapper");

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.classList.add(
      "bg-secondary",
      "pd-10",
      "br-5",
      "cursor-pointer",
      "text-center"
    );
    label.textContent = labelText;
    label.setAttribute("aria-label", labelText);
    label.setAttribute("aria-required", "true");
    label.setAttribute("role", "button");
    label.setAttribute("tabindex", "0");
    label.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        document.getElementById(id).click();
      }
    });

    const input = document.createElement("input");
    input.type = "file";
    input.name = name;
    input.id = id;
    input.classList.add("file-input");
    input.setAttribute("aria-label", labelText);
    input.setAttribute("aria-required", "false");
    input.setAttribute("role", "textbox");
    input.setAttribute("tabindex", "0");

    const fileName = document.createElement("div");
    fileName.classList.add("file-name");
    fileName.textContent = "Nie wybrano pliku";

    const preview = document.createElement("div");
    preview.classList.add("file-preview");

    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) return;

      fileName.textContent = file.name;
      preview.innerHTML = "";

      const type = file.type;
      const reader = new FileReader();

      const allowedTypes = {
        audio: [
          "audio/mpeg",
          "audio/wav",
          "audio/ogg",
          "audio/flac",
          "audio/aac",
          "audio/opus",
          "audio/mp4",
        ],
        video: ["video/mp4", "video/webm", "video/ogg", "video/x-matroska"],
      };

      reader.onload = () => {
        if (type.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = reader.result;
          img.alt = file.name;
          img.style.maxWidth = "100%";
          preview.appendChild(img);
        } else if (type.startsWith("audio/")) {
          const normalizedType = type === "audio/m4a" ? "audio/mp4" : type;
          const isAllowed =
            RenderUtils.isFirefox ||
            allowedTypes.audio.includes(normalizedType);

          if (!isAllowed) {
            preview.appendChild(
              this.createErrorMessage("audio", RenderUtils.isFirefox)
            );
            return;
          }

          const blob = new Blob([file], { type });
          const url = URL.createObjectURL(blob);

          const audio = document.createElement("audio");
          audio.src = url;
          audio.controls = true;
          audio.style.width = "100%";

          if (RenderUtils.isFirefox) {
            audio.addEventListener("error", () => {
              preview.innerHTML = "";
              preview.appendChild(
                this.createErrorMessage("audio", RenderUtils.isFirefox)
              );
            });
          }

          preview.appendChild(audio);
        } else if (type.startsWith("video/")) {
          const isAllowed =
            RenderUtils.isFirefox || allowedTypes.video.includes(type);

          if (!isAllowed) {
            preview.appendChild(
              this.createErrorMessage("video", RenderUtils.isFirefox)
            );
            return;
          }

          const blob = new Blob([file], { type });
          const url = URL.createObjectURL(blob);

          const video = document.createElement("video");
          video.src = url;
          video.controls = true;
          video.muted = true;
          video.style.maxWidth = "100%";

          if (RenderUtils.isFirefox) {
            video.addEventListener("error", () => {
              preview.innerHTML = "";
              preview.appendChild(
                this.createErrorMessage("video", RenderUtils.isFirefox)
              );
            });
          }

          preview.appendChild(video);
        } else if (
          type.startsWith("text/") ||
          file.name.match(/\.(js|php|json|txt|md)$/)
        ) {
          const text = document.createElement("pre");
          text.textContent = reader.result.slice(0, 1000);
          text.style.whiteSpace = "pre-wrap";
          preview.appendChild(text);
        }
      };

      if (
        type.startsWith("text/") ||
        file.name.match(/\.(js|php|json|txt|md)$/)
      ) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }

      preview.classList.add("has-preview");

      setTimeout(() => {
        const tag = preview.firstChild?.tagName;
        preview.style.top = tag === "AUDIO" ? "30%" : "-65%";
      }, 50);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(fileName);
    wrapper.appendChild(preview);

    return wrapper;
  }

  /**
   * Tworzy komunikat o błędzie ładowania podglądu pliku wraz z listą obsługiwanych formatów.
   *
   * @param {string} type Rozszerzenie pliku którego nie udało się załadować
   * @param {boolean} isFirefox Czy przeglądarka to Firefox
   * @returns Komunikat o nie udanej próbie załadowania podglądu pliku i listy obsługiwanych formatów jako innerHTML
   */
  static createErrorMessage(type, isFirefox) {
    const wrapper = document.createElement("div");

    const heading = document.createElement("strong");
    heading.textContent = `Nie można załadować podglądu tego pliku ${type}.`;
    wrapper.appendChild(heading);

    const info = document.createElement("p");
    info.textContent = `Spróbuj użyć jednego z obsługiwanych formatów:`;
    wrapper.appendChild(info);

    const list = document.createElement("ul");

    const formats =
      type === "audio"
        ? isFirefox
          ? ["MP3", "WAV", "OGG", "Opus", "FLAC", "AAC", "M4A"]
          : ["MP3", "WAV", "OGG", "Opus", "FLAC", "AAC"]
        : isFirefox
        ? ["MP4", "WebM", "OGG"]
        : ["MP4", "WebM", "OGG", "MKV"];

    formats.forEach((format) => {
      const li = document.createElement("li");
      li.textContent = format;
      list.appendChild(li);
    });

    wrapper.appendChild(list);
    return wrapper;
  }

  static _generateId() {
    return 'input-' + Math.random().toString(36).substr(2, 9);
  }

  static _checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W]/.test(password)) strength++;
    return strength;
  }
  static _updatePasswordStrengthIndicator(strength, indicator) {
      if (!indicator) return;

      indicator.textContent = `Siła hasła: ${strength}/5`;
      indicator.className = "password-strength-indicator";

      if (strength < 3) {
        indicator.classList.add("weak");
      } else if (strength < 5) {
        indicator.classList.add("medium");
      } else {
        indicator.classList.add("strong");
      }
    }
}
