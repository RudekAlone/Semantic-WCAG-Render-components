<<<<<<< HEAD
export class RenderElements {
  static isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

  /**
   * Tworzy i zwraca element <button> na podstawie przekazanych parametrów.
   * @param {string} text - Tekst wyświetlany na przycisku.
   * @param {string} [variant="primary"] - Wariant stylu przycisku (np. "primary", "secondary", "tertiary", "quaternary", "fifth").
   * @param {string} [type="button"] - Typ przycisku (np. "button", "submit", "reset").
   * @param {(function|null)} [eventMethod=null] - Funkcja obsługi zdarzenia kliknięcia przycisku.
   * @return {HTMLButtonElement} Utworzony element < button >.
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

  /** Tworzy i zwraca element <input> na podstawie przekazanych parametrów.
   * @param {string|HTMLElement} labelText - Tekst etykiety lub element HTML dla etykiety.
   * @param {string} name - Atrybut name dla elementu input.
   * @param {string|number} id - Atrybut id dla elementu input.
   * @param {string} [type="text"] - Typ inputu (np. "text", "email", "number", "password", "checkbox", "file", "color", "range").
   * @param {string} [role="textbox"] - Dodatkowa informacja/rola używana przez WCAG (np. "textbox", "checkbox").
   * @param {boolean} [required=true] - Czy pole jest wymagane.
   * @param {string} [direction="row"] - Układ etykiety i inputa zapisywany w atrybucie data-layout (np. "row", "row-center", "column" lub "column-center").
   * @param {string} [value=""] - Wstępna wartość inputa jeżeli "true" to zastosuje atrybut checked.
   * @param {Array<string>} [acceptFiles=[]] - Tablica typów plików akceptowanych w przypadku typu "file".
   * @return {HTMLDivElement} Utworzony element <div> zawierający etykietę i input.
   *
   * @example
   * ["application/pdf", "image/*"] // dla plików akceptowanych w input type="file"
   */
  static renderInput(
    labelText,
    name,
    id,
    type = "text",
    role = "textbox",
    required = true,
    direction = "row",
    value = "",
    acceptFiles = []
  ) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-ui", "input-wrapper");
    wrapper.setAttribute("data-layout", direction);

    let label;
    if (typeof labelText === "string" && labelText.trim() !== "") {
      label = document.createElement("label");
      label.textContent = labelText;
      label.setAttribute("for", id);
      label.setAttribute("data-ui", "input-label");
      wrapper.appendChild(label);
    } else if (labelText instanceof HTMLElement) {
      label = labelText;
      label.setAttribute("for", id);
      label.setAttribute("data-ui", "input-label");
      wrapper.appendChild(label);
    }

    const input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("name", name);
    input.setAttribute("id", id);
    input.setAttribute("data-ui", "input");

    // WCAG + semantyka
    input.setAttribute(
      "aria-label",
      typeof labelText === "string" ? labelText : label?.textContent || name
    );
    input.setAttribute("aria-required", required);
    input.setAttribute("role", role);

    if (type !== "radio") {
      input.setAttribute("tabindex", "0");
    }

    // Typowe wartości
    if (type === "color") {
      input.setAttribute("value", value === "" ? "#5d00e7" : value);
      label.setAttribute("for", id);
      label.addEventListener("click", () => {
        input.focus();
      });
      label.addEventListener("mouseover", (event) => {
        input.classList.add("hovered");
      });
      label.addEventListener("mouseout", (event) => {
        input.classList.remove("hovered");
      });
    } else if (type === "file" && acceptFiles.length > 0) {
      input.setAttribute("accept", acceptFiles.join(","));
    } else if (type === "checkbox" || type === "radio") {
      input.checked = value === "true" ? true : false;
    } else if (value) {
      input.setAttribute("value", value);
    }

    // WCAG fix dla checkbox/radio - widoczny fokus przy użyciu klawiatury i wykryty na dziecku przez myszkę
    (function () {
      const setTabbing = () => document.body.classList.add("user-is-tabbing");
      const unsetTabbing = () =>
        document.body.classList.remove("user-is-tabbing");

      window.addEventListener("keydown", (e) => {
        if (e.key === "Tab") setTabbing();
      });

      window.addEventListener("mousedown", unsetTabbing);
      window.addEventListener("touchstart", unsetTabbing);
    })();

    wrapper.appendChild(input);
    return wrapper;
  }

  /**
   * Tworzy i zwraca element <form> na podstawie przekazanej konfiguracji pól.
   *
   * @param {Array<Object>} [elements=[]] - [] Tablica obiektów opisujących pola formularza. Każdy obiekt może zawierać:
   *- {string} label    - Etykieta pola,
   *- {string} name     - Atrybut name dla elementu input,
   *- {string|number} [id]   - Atrybut id dla elementu input,
   *- {string} [type]   - Typ inputu (np. "text", "checkbox", "radio", "file", "color", "range"),
   *- {string} [role]   - Dodatkowa informacja/rola używana przez this.renderInput,
   *- {boolean} [required=false] - Czy pole jest wymagane.
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
      const inputWrapper = this.renderInput(
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
        !["checkbox", "radio", "file", "color", "range"].includes(element.type)
      ) {
        input.setAttribute("autocomplete", "on");
      }

      form.appendChild(inputWrapper);
    });

    const submitButton = this.renderButton(
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
            this.isFirefox || allowedTypes.audio.includes(normalizedType);

          if (!isAllowed) {
            preview.appendChild(
              this.createErrorMessage("audio", this.isFirefox)
            );
            return;
          }

          const blob = new Blob([file], { type });
          const url = URL.createObjectURL(blob);

          const audio = document.createElement("audio");
          audio.src = url;
          audio.controls = true;
          audio.style.width = "100%";

          if (this.isFirefox) {
            audio.addEventListener("error", () => {
              preview.innerHTML = "";
              preview.appendChild(
                this.createErrorMessage("audio", this.isFirefox)
              );
            });
          }

          preview.appendChild(audio);
        } else if (type.startsWith("video/")) {
          const isAllowed = this.isFirefox || allowedTypes.video.includes(type);

          if (!isAllowed) {
            preview.appendChild(
              this.createErrorMessage("video", this.isFirefox)
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

          if (this.isFirefox) {
            video.addEventListener("error", () => {
              preview.innerHTML = "";
              preview.appendChild(
                this.createErrorMessage("video", this.isFirefox)
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
        preview.style.top = tag === "AUDIO" ? "30%" : "-95%";
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

  /**
   * Tworzy i zwraca element <div> zawierający etykietę i pole textarea na podstawie przekazanych parametrów.
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
    name,
    id,
    rows = 4,
    cols = 50,
    required = true
  ) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-ui", "textarea-wrapper");

    const label = document.createElement("label");
    label.textContent = labelText;
    label.setAttribute("for", id);
    label.setAttribute("data-ui", "textarea-label");
    wrapper.appendChild(label);

    const textArea = document.createElement("textarea");
    textArea.setAttribute("name", name);
    textArea.setAttribute("id", id);
    textArea.setAttribute("rows", rows);
    textArea.setAttribute("cols", cols);
    textArea.setAttribute("autocomplete", "on");
    textArea.setAttribute("data-ui", "textarea");

    // WCAG fix
    textArea.setAttribute("aria-label", labelText);
    textArea.setAttribute("aria-required", required);
    textArea.setAttribute("role", "textbox");
    textArea.setAttribute("tabindex", "0");

    wrapper.appendChild(textArea);
    return wrapper;
  }

  /**
   * Tworzy i zwraca element <select> z opcjami na podstawie przekazanej tablicy obiektów.
   *
   * @param {Array<Object>} options Tablica obiektów opisujących opcje selecta. Każdy obiekt powinien zawierać:
   * - {string} value - Wartość atrybutu value dla opcji
   * - {string} text  - Tekst wyświetlany dla opcji
   * @param {string} name Atrybut name dla elementu select
   * @param {string|number} id Atrybut id dla elementu select
   * @param {boolean} required Czy pole jest wymagane
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
  static selectInputOptions(options = [], name = "", id = "", required = true) {
    const select = document.createElement("select");

    options.forEach((optionData) => {
      const option = document.createElement("option");
      option.value = optionData.value ?? "";
      option.textContent = optionData.text;
      select.appendChild(option);
    });

    // Atrybuty semantyczne
    if (name) select.setAttribute("name", name);
    if (id) select.setAttribute("id", id);
    select.setAttribute("autocomplete", "on");

    // WCAG
    select.setAttribute("role", "listbox");
    select.setAttribute("tabindex", "0");
    select.setAttribute("aria-label", "Wybierz opcję");
    select.setAttribute("aria-required", required);

    return select;
  }

  /**
   * Tworzy i zwraca responsywną tabelę, która dostosowuje się do rozmiaru ekranu (desktop/mobile).
   *
   * @param {Array<Array>} data Tablica dwuwymiarowa zawierająca dane tabeli (wiersze i kolumny)
   * @param {Array<string>} headers Tablica nagłówków kolumn
   * @returns Element <div> zawierający tabelę dla viewportów z szerokością powyżej 768px
   */
  static renderTableDesktop(
    data = [],
    headers = [],
    sortCallback = null,
    ariaSort = "ascending"
  ) {
    const table = document.createElement("table");
    table.classList.add("data-table", "br-5");
    table.setAttribute("role", "table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headers.forEach((headerText, index) => {
      const th = document.createElement("th");

      th.textContent =
        ariaSort === "ascending" ? "↓ " + headerText : "↑ " + headerText;

      th.setAttribute("scope", "col");
      th.setAttribute("aria-sort", ariaSort);
      th.style.cursor = "pointer";
      th.setAttribute("title", `Kliknij, aby posortować po ${headerText}`);
      th.addEventListener("click", (e) => {
        sortCallback?.(index);
        e.target.setAttribute(
          "aria-sort",
          th.getAttribute("aria-sort") === "ascending"
            ? "descending"
            : "ascending"
        );
      });
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.forEach((rowData) => {
      const row = document.createElement("tr");
      rowData.forEach((cellData) => {
        const td = document.createElement("td");
        if (typeof cellData === "object" && cellData.type === "image") {
          const img = document.createElement("img");
          img.src = cellData.src;
          td.appendChild(img);
        } else if (
          typeof cellData === "object" &&
          (cellData.type === "text" ||
            cellData.type === "email" ||
            cellData.type === "number" ||
            cellData.type === "password" ||
            cellData.type === "checkbox")
        ) {
          const input = this.renderInput(
            cellData.label || "",
            `input-${Math.random().toString(36).slice(2, 8)}`,
            `input-${Math.random().toString(36).slice(2, 8)}`,
            cellData.type,
            cellData.type,
            false,
            "row-center"
          );
          td.appendChild(input);
        } else if (typeof cellData === "object" && cellData.type === "select") {
          const select = this.selectInputOptions(cellData.options || []);
          td.appendChild(select);
        } else if (typeof cellData === "object" && cellData.type === "button") {
          const button = this.renderButton(
            cellData.label || "Akcja",
            cellData.buttonStyle || "primary",
            "button",
            cellData.onClick || (() => {})
          );
          td.appendChild(button);
        } else {
          td.textContent =
            typeof cellData === "object" ? cellData.label || "" : cellData;
        }
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
  }

  /**
   * Tworzy i zwraca element wartości komórki dla widoku mobilnego tabeli.
   *
   * @param {any} cellData Dane komórki (mogą być różnego typu, w tym obiekty z typem)
   * @param {number} index Indeks kolumny
   * @param {Array<string>} headers Tablica nagłówków kolumn
   * @param {HTMLElement} labelRef Referencja do etykiety powiązanej z wartością
   * @returns {HTMLDivElement} Utworzony element wartości komórki dla widoku mobilnego, czyli viewportów o szerokości poniżej 768px
   */
  static renderMobileValue(cellData, index, headers, labelRef) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("mobile-value");

    if (
      (typeof cellData === "object" && cellData.type === "image") ||
      (typeof cellData === "string" && cellData.match(/\.(jpg|png|webp|gif)$/))
    ) {
      const img = document.createElement("img");
      img.src = cellData.src;
      img.alt = cellData.alt || headers[index];
      wrapper.appendChild(img);
    } else if (
      typeof cellData === "object" &&
      (cellData.type === "text" ||
        cellData.type === "email" ||
        cellData.type === "number" ||
        cellData.type === "password" ||
        cellData.type === "checkbox")
    ) {
      const input = this.renderInput(
        labelRef,
        `input-${index}`,
        `input-${index}-${Math.random().toString(36).slice(2, 8)}`,
        cellData.type,
        cellData.type,
        false,
        "row-center"
      );
      wrapper.appendChild(input);

      if (cellData.type === "checkbox") {
        labelRef.addEventListener("click", () => {
          input.querySelector("input").focus();
        });
        labelRef.addEventListener("mouseover", () => {
          input.querySelector("input").classList.add("hovered");
        });
        labelRef.addEventListener("mouseout", () => {
          input.querySelector("input").classList.remove("hovered");
        });
      }
    } else if (typeof cellData === "object" && cellData.type === "select") {
      const select = this.selectInputOptions(cellData.options || []);
      wrapper.appendChild(select);
      labelRef.addEventListener("click", () => {
        select.focus();
      });
      labelRef.addEventListener("mouseover", () => {
        select.classList.add("hovered");
      });
      labelRef.addEventListener("mouseout", () => {
        select.classList.remove("hovered");
      });
    } else if (typeof cellData === "object" && cellData.type === "button") {
      const button = this.renderButton(
        cellData.label || "Akcja",
        cellData.buttonStyle || "primary",
        "button",
        cellData.onClick || (() => {})
      );
      wrapper.appendChild(button);
      labelRef.addEventListener("click", () => {
        button.focus();
      });
      labelRef.addEventListener("mouseover", () => {
        button.classList.add("hovered");
      });
      labelRef.addEventListener("mouseout", () => {
        button.classList.remove("hovered");
      });
    } else {
      const span = document.createElement("span");
      span.textContent = cellData;
      wrapper.appendChild(span);
    }

    return wrapper;
  }

  /**
   * Tworzy i zwraca responsywną tabelę dla widoków mobilnych (viewporty o szerokości poniżej 768px).
   *
   * @param {Array<Array>} data Tablica dwuwymiarowa zawierająca dane tabeli (wiersze i kolumny)
   * @param {Array<string>} headers Tablica nagłówków kolumn
   * @param {(function|null)} sortCallback Funkcja wywoływana podczas sortowania kolumn
   * @returns Element <div> zawierający tabelę dla viewportów o szerokości poniżej 768px
   */
  static renderTableMobile(
    data = [],
    headers = [],
    sortCallback = null,
    ariaSort = "ascending"
  ) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("mobile-table");
    wrapper.setAttribute("role", "list");

    // Nagłówki jako sortowalne przyciski
    const headerRow = document.createElement("div");
    headerRow.classList.add("mobile-header");
    headers.forEach((headerText, index) => {
      const header = document.createElement("button");
      header.textContent = headerText;
      header.classList.add("mobile-header-button");
      header.setAttribute("aria-label", `Sortuj po ${headerText}`);
      header.setAttribute("aria-sort", ariaSort);
      header.textContent =
        (header.getAttribute("aria-sort") === "ascending" ? "↓ " : "↑ ") +
        headerText;
      header.setAttribute("title", `Kliknij, aby posortować po ${headerText}`);
      header.addEventListener("click", (e) => {
        sortCallback?.(index);
        e.target.setAttribute(
          "aria-sort",
          e.target.getAttribute("aria-sort") === "ascending"
            ? "descending"
            : "ascending"
        );
      });
      headerRow.appendChild(header);
    });
    wrapper.appendChild(headerRow);

    data.forEach((rowData) => {
      const block = document.createElement("section");
      block.classList.add("mobile-row");
      block.setAttribute("role", "listitem");

      rowData.forEach((cellData, index) => {
        const pair = document.createElement("div");
        pair.classList.add("mobile-cell");
        pair.setAttribute("role", "group");

        const label = document.createElement("label");
        label.classList.add("mobile-label");
        label.textContent = headers[index];

        const value = this.renderMobileValue(cellData, index, headers, label);
        pair.appendChild(label);
        pair.appendChild(value);
        block.appendChild(pair);
      });

      wrapper.appendChild(block);
    });

    return wrapper;
  }

  /**
   * Sortuje tablicę danych według określonej kolumny i kierunku sortowania.
   * @param {Array<Array>} data Tablica dwuwymiarowa zawierająca dane tabeli (wiersze i kolumny)
   * @param {number} index Indeks kolumny, według której ma być wykonane sortowanie
   * @param {boolean} [ascending=true] Określa kierunek sortowania: true dla rosnącego, false dla malejącego
   * @returns {Array<Array>} Nowa posortowana tablica danych
   */
  static sortByColumn(data, index, ascending = true) {
    return [...data].sort((a, b) => {
      const valA = a[index];
      const valB = b[index];
      return ascending
        ? valA > valB
          ? 1
          : valA < valB
          ? -1
          : 0
        : valA < valB
        ? 1
        : valA > valB
        ? -1
        : 0;
    });
  }

  /**
   * Tworzy i zwraca responsywną tabelę, która dostosowuje się do rozmiaru ekranu (desktop/mobile).
   *
   * @param {Array<Array>} data Tablica dwuwymiarowa zawierająca dane tabeli (wiersze i kolumny)
   * @param {Array<string>} headers Tablica nagłówków kolumn
   * @param {boolean} isExportable Określa, czy dodać przyciski eksportu danych (CSV/JSON)
   * @returns Element <div> zawierający responsywną tabelę dla ekranów z szerokością powyżej 768px
   *
   * @example
   * [
   *   [1, "Element 1", 100, "2023-01-01"],
   *   [2, "Element 2", 200, {
   *     type: "image",
   *     src: "https://URL_do_obrazka.webp",
   *     alt: "Obrazek"
   *   }],
   *   [3, "Element 3", 150, {
   *     type: "select",
   *     options: [
   *       { value: "option1", text: "Opcja 1" },
   *       { value: "option2", text: "Opcja 2" },
   *       { value: "option3", text: "Opcja 3" }
   *     ]
   *   }]
   * ]
   */

  static renderResponsiveTable(data = [], headers = [], isExportable = true) {
    data = data.sort((a, b) => (a[0] > b[0] ? 1 : -1));

    const container = document.createElement("div");
    container.classList.add("table-container");

    let currentMode = window.innerWidth < 768 ? "mobile" : "desktop";
    let currentData = [...data];
    let ascending = true;

    const render = (ariaSort = "ascending") => {
      const table =
        currentMode === "mobile"
          ? this.renderTableMobile(currentData, headers, handleSort, ariaSort)
          : this.renderTableDesktop(currentData, headers, handleSort, ariaSort);

      if (isExportable) {
        container.querySelector(".export-buttons-wrapper")?.remove();

        const exportButtons = this.renderExportDataTableButtons(
          currentData,
          headers
        );
        container.appendChild(exportButtons);
      }

      container.querySelector("table")?.remove();
      container.querySelector(".mobile-table")?.remove();
      container.appendChild(table);
    };

    const handleSort = (index) => {
      currentData = this.sortByColumn(currentData, index, !ascending);
      ascending = !ascending;
      render(ascending ? "ascending" : "descending");
    };

    render();

    window.addEventListener("resize", () => {
      const newMode = window.innerWidth < 768 ? "mobile" : "desktop";
      if (newMode !== currentMode) {
        currentMode = newMode;
        render();
      }
    });

    return container;
  }

  /**
   *  Tworzy i zwraca elementy przycisków eksportu danych tabeli (CSV i JSON).
   *
   * @param {Array[Object]} tableData  Struktura danych tabeli
   * @param {Array<string>} headers  Tablica nagłówków kolumn
   * @returns
   */
  static renderExportDataTableButtons(tableData = [], headers = []) {
    const wrapper = document.createElement("div");
    wrapper.classList.add(
      "export-buttons-wrapper",
      "flex",
      "flex-column",
      "flex-end-items"
    );
    const exportCSVButton = this.renderButton("↯ CSV", "fifth", "button", () =>
      this.exportTableDataToCSV(tableData, headers)
    );
    const exportJSONButton = this.renderButton(
      "↯ JSON",
      "fifth",
      "button",
      () => this.exportTableDataToJSON(tableData)
    );

    exportCSVButton.classList.add("mr-5");
    exportJSONButton.classList.add("mr-5");

    exportCSVButton.setAttribute(
      "aria-label",
      "Eksportuj dane tabeli do pliku CSV"
    );
    exportJSONButton.setAttribute(
      "aria-label",
      "Eksportuj dane tabeli do pliku JSON"
    );

    exportCSVButton.setAttribute("title", "Eksportuj dane tabeli do pliku CSV");
    exportJSONButton.setAttribute(
      "title",
      "Eksportuj dane tabeli do pliku JSON"
    );

    wrapper.appendChild(exportCSVButton);
    wrapper.appendChild(exportJSONButton);
    return wrapper;
  }

  /**
   * Export danych tabeli do pliku .CSV
   *
   * @static
   * @param {Array} tableData Dane tabeli
   * @param {Array} headers Nagłówki kolumn tabeli
   * @param {string} [filename="table_data.csv"] nazwa pobranego pliku .CSV
   *
   * Po wywołaniu tej metody zostanie wygenerowany i pobrany plik CSV zawierający dane tabeli.
   */
  static exportTableDataToCSV(tableData, headers, filename = "table_data.csv") {
    const csvRows = [];
    csvRows.push(headers.join(","));
    tableData.forEach((row) => {
      const values = row.map((cell) => {
        if (typeof cell === "object") {
          return `"${JSON.stringify(cell).replace(/"/g, '""')}"`;
        }
        return `"${String(cell).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export danych tabeli do pliku .JSON
   * @static
   * @param {Array} tableData Dane tabeli
   * @param {string} [filename="table_data.json"] nazwa pobranego pliku .JSON
   *
   * Po wywołaniu tej metody zostanie wygenerowany i pobrany plik JSON zawierający dane tabeli.
   */
  static exportTableDataToJSON(tableData, filename = "table_data.json") {
    const jsonString = JSON.stringify(tableData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
=======
export class RenderElements {
  static isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

  /**
   * Tworzy i zwraca element <button> na podstawie przekazanych parametrów.
   * @param {string} text - Tekst wyświetlany na przycisku.
   * @param {string} [variant="primary"] - Wariant stylu przycisku (np. "primary", "secondary", "tertiary", "quaternary", "fifth").
   * @param {string} [type="button"] - Typ przycisku (np. "button", "submit", "reset").
   * @param {(function|null)} [eventMethod=null] - Funkcja obsługi zdarzenia kliknięcia przycisku.
   * @return {HTMLButtonElement} Utworzony element < button >.
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

  /** Tworzy i zwraca element <input> na podstawie przekazanych parametrów.
   * @param {string|HTMLElement} labelText - Tekst etykiety lub element HTML dla etykiety.
   * @param {string} name - Atrybut name dla elementu input.
   * @param {string|number} id - Atrybut id dla elementu input.
   * @param {string} [type="text"] - Typ inputu (np. "text", "email", "number", "password", "checkbox", "file", "color", "range").
   * @param {string} [role="textbox"] - Dodatkowa informacja/rola używana przez WCAG (np. "textbox", "checkbox").
   * @param {boolean} [required=true] - Czy pole jest wymagane.
   * @param {string} [direction="row"] - Układ etykiety i inputa zapisywany w atrybucie data-layout (np. "row", "row-center", "column" lub "column-center").
   * @param {string} [value=""] - Wstępna wartość inputa jeżeli "true" to zastosuje atrybut checked.
   * @param {Array<string>} [acceptFiles=[]] - Tablica typów plików akceptowanych w przypadku typu "file".
   * @return {HTMLDivElement} Utworzony element <div> zawierający etykietę i input.
   *
   * @example
   * ["application/pdf", "image/*"] // dla plików akceptowanych w input type="file"
   */
  static renderInput(
    labelText,
    name,
    id,
    type = "text",
    role = "textbox",
    required = true,
    direction = "row",
    value = "",
    acceptFiles = []
  ) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-ui", "input-wrapper");
    wrapper.setAttribute("data-layout", direction);

    let label;
    if (typeof labelText === "string" && labelText.trim() !== "") {
      label = document.createElement("label");
      label.textContent = labelText;
      label.setAttribute("for", id);
      label.setAttribute("data-ui", "input-label");
      wrapper.appendChild(label);
    } else if (labelText instanceof HTMLElement) {
      label = labelText;
      label.setAttribute("for", id);
      label.setAttribute("data-ui", "input-label");
      wrapper.appendChild(label);
    }

    const input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("name", name);
    input.setAttribute("id", id);
    input.setAttribute("data-ui", "input");

    // WCAG + semantyka
    input.setAttribute(
      "aria-label",
      typeof labelText === "string" ? labelText : label?.textContent || name
    );
    input.setAttribute("aria-required", required);
    input.setAttribute("role", role);

    if (type !== "radio") {
      input.setAttribute("tabindex", "0");
    }

    // Typowe wartości
    if (type === "color") {
      input.setAttribute("value", value === "" ? "#5d00e7" : value);
      label.setAttribute("for", id);
      label.addEventListener("click", () => {
        input.focus();
      });
      label.addEventListener("mouseover", (event) => {
        input.classList.add("hovered");
      });
      label.addEventListener("mouseout", (event) => {
        input.classList.remove("hovered");
      });
    } else if (type === "file" && acceptFiles.length > 0) {
      input.setAttribute("accept", acceptFiles.join(","));
    } else if (type === "checkbox" || type === "radio") {
      input.checked = value === "true" ? true : false;
    } else if (value) {
      input.setAttribute("value", value);
    }

    // WCAG fix dla checkbox/radio - widoczny fokus przy użyciu klawiatury i wykryty na dziecku przez myszkę
    (function () {
      const setTabbing = () => document.body.classList.add("user-is-tabbing");
      const unsetTabbing = () =>
        document.body.classList.remove("user-is-tabbing");

      window.addEventListener("keydown", (e) => {
        if (e.key === "Tab") setTabbing();
      });

      window.addEventListener("mousedown", unsetTabbing);
      window.addEventListener("touchstart", unsetTabbing);
    })();

    wrapper.appendChild(input);
    return wrapper;
  }

  /**
   * Tworzy i zwraca element <form> na podstawie przekazanej konfiguracji pól.
   *
   * @param {Array<Object>} [elements=[]] - [] Tablica obiektów opisujących pola formularza. Każdy obiekt może zawierać:
   *- {string} label    - Etykieta pola,
   *- {string} name     - Atrybut name dla elementu input,
   *- {string|number} [id]   - Atrybut id dla elementu input,
   *- {string} [type]   - Typ inputu (np. "text", "checkbox", "radio", "file", "color", "range"),
   *- {string} [role]   - Dodatkowa informacja/rola używana przez this.renderInput,
   *- {boolean} [required=false] - Czy pole jest wymagane.
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
      const inputWrapper = this.renderInput(
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
        !["checkbox", "radio", "file", "color", "range"].includes(element.type)
      ) {
        input.setAttribute("autocomplete", "on");
      }

      form.appendChild(inputWrapper);
    });

    const submitButton = this.renderButton(
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
            this.isFirefox || allowedTypes.audio.includes(normalizedType);

          if (!isAllowed) {
            preview.appendChild(
              this.createErrorMessage("audio", this.isFirefox)
            );
            return;
          }

          const blob = new Blob([file], { type });
          const url = URL.createObjectURL(blob);

          const audio = document.createElement("audio");
          audio.src = url;
          audio.controls = true;
          audio.style.width = "100%";

          if (this.isFirefox) {
            audio.addEventListener("error", () => {
              preview.innerHTML = "";
              preview.appendChild(
                this.createErrorMessage("audio", this.isFirefox)
              );
            });
          }

          preview.appendChild(audio);
        } else if (type.startsWith("video/")) {
          const isAllowed = this.isFirefox || allowedTypes.video.includes(type);

          if (!isAllowed) {
            preview.appendChild(
              this.createErrorMessage("video", this.isFirefox)
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

          if (this.isFirefox) {
            video.addEventListener("error", () => {
              preview.innerHTML = "";
              preview.appendChild(
                this.createErrorMessage("video", this.isFirefox)
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
        preview.style.top = tag === "AUDIO" ? "30%" : "-95%";
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

  /**
   * Tworzy i zwraca element <div> zawierający etykietę i pole textarea na podstawie przekazanych parametrów.
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
    name,
    id,
    rows = 4,
    cols = 50,
    required = true
  ) {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-ui", "textarea-wrapper");

    const label = document.createElement("label");
    label.textContent = labelText;
    label.setAttribute("for", id);
    label.setAttribute("data-ui", "textarea-label");
    wrapper.appendChild(label);

    const textArea = document.createElement("textarea");
    textArea.setAttribute("name", name);
    textArea.setAttribute("id", id);
    textArea.setAttribute("rows", rows);
    textArea.setAttribute("cols", cols);
    textArea.setAttribute("autocomplete", "on");
    textArea.setAttribute("data-ui", "textarea");

    // WCAG fix
    textArea.setAttribute("aria-label", labelText);
    textArea.setAttribute("aria-required", required);
    textArea.setAttribute("role", "textbox");
    textArea.setAttribute("tabindex", "0");

    wrapper.appendChild(textArea);
    return wrapper;
  }

  /**
   * Tworzy i zwraca element <select> z opcjami na podstawie przekazanej tablicy obiektów.
   *
   * @param {Array<Object>} options Tablica obiektów opisujących opcje selecta. Każdy obiekt powinien zawierać:
   * - {string} value - Wartość atrybutu value dla opcji
   * - {string} text  - Tekst wyświetlany dla opcji
   * @param {string} name Atrybut name dla elementu select
   * @param {string|number} id Atrybut id dla elementu select
   * @param {boolean} required Czy pole jest wymagane
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
  static selectInputOptions(options = [], name = "", id = "", required = true) {
    const select = document.createElement("select");

    options.forEach((optionData) => {
      const option = document.createElement("option");
      option.value = optionData.value ?? "";
      option.textContent = optionData.text;
      select.appendChild(option);
    });

    // Atrybuty semantyczne
    if (name) select.setAttribute("name", name);
    if (id) select.setAttribute("id", id);
    select.setAttribute("autocomplete", "on");

    // WCAG
    select.setAttribute("role", "listbox");
    select.setAttribute("tabindex", "0");
    select.setAttribute("aria-label", "Wybierz opcję");
    select.setAttribute("aria-required", required);

    return select;
  }

  /**
   * Tworzy i zwraca responsywną tabelę, która dostosowuje się do rozmiaru ekranu (desktop/mobile).
   *
   * @param {Array<Array>} data Tablica dwuwymiarowa zawierająca dane tabeli (wiersze i kolumny)
   * @param {Array<string>} headers Tablica nagłówków kolumn
   * @returns Element <div> zawierający tabelę dla viewportów z szerokością powyżej 768px
   */
  static renderTableDesktop(
    data = [],
    headers = [],
    sortCallback = null,
    ariaSort = "ascending"
  ) {
    const table = document.createElement("table");
    table.classList.add("data-table", "br-5");
    table.setAttribute("role", "table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headers.forEach((headerText, index) => {
      const th = document.createElement("th");

      th.textContent =
        ariaSort === "ascending" ? "↓ " + headerText : "↑ " + headerText;

      th.setAttribute("scope", "col");
      th.setAttribute("aria-sort", ariaSort);
      th.style.cursor = "pointer";
      th.setAttribute("title", `Kliknij, aby posortować po ${headerText}`);
      th.addEventListener("click", (e) => {
        sortCallback?.(index);
        e.target.setAttribute(
          "aria-sort",
          th.getAttribute("aria-sort") === "ascending"
            ? "descending"
            : "ascending"
        );
      });
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    data.forEach((rowData) => {
      const row = document.createElement("tr");
      rowData.forEach((cellData) => {
        const td = document.createElement("td");
        if (typeof cellData === "object" && cellData.type === "image") {
          const img = document.createElement("img");
          img.src = cellData.src;
          td.appendChild(img);
        } else if (
          typeof cellData === "object" &&
          (cellData.type === "text" ||
            cellData.type === "email" ||
            cellData.type === "number" ||
            cellData.type === "password" ||
            cellData.type === "checkbox")
        ) {
          const input = this.renderInput(
            cellData.label || "",
            `input-${Math.random().toString(36).slice(2, 8)}`,
            `input-${Math.random().toString(36).slice(2, 8)}`,
            cellData.type,
            cellData.type,
            false,
            "row-center"
          );
          td.appendChild(input);
        } else if (typeof cellData === "object" && cellData.type === "select") {
          const select = this.selectInputOptions(cellData.options || []);
          td.appendChild(select);
        } else if (typeof cellData === "object" && cellData.type === "button") {
          const button = this.renderButton(
            cellData.label || "Akcja",
            cellData.buttonStyle || "primary",
            "button",
            cellData.onClick || (() => {})
          );
          td.appendChild(button);
        } else {
          td.textContent =
            typeof cellData === "object" ? cellData.label || "" : cellData;
        }
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
  }

  /**
   * Tworzy i zwraca element wartości komórki dla widoku mobilnego tabeli.
   *
   * @param {any} cellData Dane komórki (mogą być różnego typu, w tym obiekty z typem)
   * @param {number} index Indeks kolumny
   * @param {Array<string>} headers Tablica nagłówków kolumn
   * @param {HTMLElement} labelRef Referencja do etykiety powiązanej z wartością
   * @returns {HTMLDivElement} Utworzony element wartości komórki dla widoku mobilnego, czyli viewportów o szerokości poniżej 768px
   */
  static renderMobileValue(cellData, index, headers, labelRef) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("mobile-value");

    if (
      (typeof cellData === "object" && cellData.type === "image") ||
      (typeof cellData === "string" && cellData.match(/\.(jpg|png|webp|gif)$/))
    ) {
      const img = document.createElement("img");
      img.src = cellData.src;
      img.alt = cellData.alt || headers[index];
      wrapper.appendChild(img);
    } else if (
      typeof cellData === "object" &&
      (cellData.type === "text" ||
        cellData.type === "email" ||
        cellData.type === "number" ||
        cellData.type === "password" ||
        cellData.type === "checkbox")
    ) {
      const input = this.renderInput(
        labelRef,
        `input-${index}`,
        `input-${index}-${Math.random().toString(36).slice(2, 8)}`,
        cellData.type,
        cellData.type,
        false,
        "row-center"
      );
      wrapper.appendChild(input);

      if (cellData.type === "checkbox") {
        labelRef.addEventListener("click", () => {
          input.querySelector("input").focus();
        });
        labelRef.addEventListener("mouseover", () => {
          input.querySelector("input").classList.add("hovered");
        });
        labelRef.addEventListener("mouseout", () => {
          input.querySelector("input").classList.remove("hovered");
        });
      }
    } else if (typeof cellData === "object" && cellData.type === "select") {
      const select = this.selectInputOptions(cellData.options || []);
      wrapper.appendChild(select);
      labelRef.addEventListener("click", () => {
        select.focus();
      });
      labelRef.addEventListener("mouseover", () => {
        select.classList.add("hovered");
      });
      labelRef.addEventListener("mouseout", () => {
        select.classList.remove("hovered");
      });
    } else if (typeof cellData === "object" && cellData.type === "button") {
      const button = this.renderButton(
        cellData.label || "Akcja",
        cellData.buttonStyle || "primary",
        "button",
        cellData.onClick || (() => {})
      );
      wrapper.appendChild(button);
      labelRef.addEventListener("click", () => {
        button.focus();
      });
      labelRef.addEventListener("mouseover", () => {
        button.classList.add("hovered");
      });
      labelRef.addEventListener("mouseout", () => {
        button.classList.remove("hovered");
      });
    } else {
      const span = document.createElement("span");
      span.textContent = cellData;
      wrapper.appendChild(span);
    }

    return wrapper;
  }

  /**
   * Tworzy i zwraca responsywną tabelę dla widoków mobilnych (viewporty o szerokości poniżej 768px).
   *
   * @param {Array<Array>} data Tablica dwuwymiarowa zawierająca dane tabeli (wiersze i kolumny)
   * @param {Array<string>} headers Tablica nagłówków kolumn
   * @param {(function|null)} sortCallback Funkcja wywoływana podczas sortowania kolumn
   * @returns Element <div> zawierający tabelę dla viewportów o szerokości poniżej 768px
   */
  static renderTableMobile(
    data = [],
    headers = [],
    sortCallback = null,
    ariaSort = "ascending"
  ) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("mobile-table");
    wrapper.setAttribute("role", "list");

    // Nagłówki jako sortowalne przyciski
    const headerRow = document.createElement("div");
    headerRow.classList.add("mobile-header");
    headers.forEach((headerText, index) => {
      const header = document.createElement("button");
      header.textContent = headerText;
      header.classList.add("mobile-header-button");
      header.setAttribute("aria-label", `Sortuj po ${headerText}`);
      header.setAttribute("aria-sort", ariaSort);
      header.textContent =
        (header.getAttribute("aria-sort") === "ascending" ? "↓ " : "↑ ") +
        headerText;
      header.setAttribute("title", `Kliknij, aby posortować po ${headerText}`);
      header.addEventListener("click", (e) => {
        sortCallback?.(index);
        e.target.setAttribute(
          "aria-sort",
          e.target.getAttribute("aria-sort") === "ascending"
            ? "descending"
            : "ascending"
        );
      });
      headerRow.appendChild(header);
    });
    wrapper.appendChild(headerRow);

    data.forEach((rowData) => {
      const block = document.createElement("section");
      block.classList.add("mobile-row");
      block.setAttribute("role", "listitem");

      rowData.forEach((cellData, index) => {
        const pair = document.createElement("div");
        pair.classList.add("mobile-cell");
        pair.setAttribute("role", "group");

        const label = document.createElement("label");
        label.classList.add("mobile-label");
        label.textContent = headers[index];

        const value = this.renderMobileValue(cellData, index, headers, label);
        pair.appendChild(label);
        pair.appendChild(value);
        block.appendChild(pair);
      });

      wrapper.appendChild(block);
    });

    return wrapper;
  }

  /**
   * Sortuje tablicę danych według określonej kolumny i kierunku sortowania.
   * @param {Array<Array>} data Tablica dwuwymiarowa zawierająca dane tabeli (wiersze i kolumny)
   * @param {number} index Indeks kolumny, według której ma być wykonane sortowanie
   * @param {boolean} [ascending=true] Określa kierunek sortowania: true dla rosnącego, false dla malejącego
   * @returns {Array<Array>} Nowa posortowana tablica danych
   */
  static sortByColumn(data, index, ascending = true) {
    return [...data].sort((a, b) => {
      const valA = a[index];
      const valB = b[index];
      return ascending
        ? valA > valB
          ? 1
          : valA < valB
          ? -1
          : 0
        : valA < valB
        ? 1
        : valA > valB
        ? -1
        : 0;
    });
  }

  /**
   * Tworzy i zwraca responsywną tabelę, która dostosowuje się do rozmiaru ekranu (desktop/mobile).
   *
   * @param {Array<Array>} data Tablica dwuwymiarowa zawierająca dane tabeli (wiersze i kolumny)
   * @param {Array<string>} headers Tablica nagłówków kolumn
   * @param {boolean} isExportable Określa, czy dodać przyciski eksportu danych (CSV/JSON)
   * @returns Element <div> zawierający responsywną tabelę dla ekranów z szerokością powyżej 768px
   *
   * @example
   * [
   *   [1, "Element 1", 100, "2023-01-01"],
   *   [2, "Element 2", 200, {
   *     type: "image",
   *     src: "https://URL_do_obrazka.webp",
   *     alt: "Obrazek"
   *   }],
   *   [3, "Element 3", 150, {
   *     type: "select",
   *     options: [
   *       { value: "option1", text: "Opcja 1" },
   *       { value: "option2", text: "Opcja 2" },
   *       { value: "option3", text: "Opcja 3" }
   *     ]
   *   }]
   * ]
   */

  static renderResponsiveTable(data = [], headers = [], isExportable = true) {
    data = data.sort((a, b) => (a[0] > b[0] ? 1 : -1));

    const container = document.createElement("div");
    container.classList.add("table-container");

    let currentMode = window.innerWidth < 768 ? "mobile" : "desktop";
    let currentData = [...data];
    let ascending = true;

    const render = (ariaSort = "ascending") => {
      const table =
        currentMode === "mobile"
          ? this.renderTableMobile(currentData, headers, handleSort, ariaSort)
          : this.renderTableDesktop(currentData, headers, handleSort, ariaSort);

      if (isExportable) {
        container.querySelector(".export-buttons-wrapper")?.remove();

        const exportButtons = this.renderExportDataTableButtons(
          currentData,
          headers
        );
        container.appendChild(exportButtons);
      }

      container.querySelector("table")?.remove();
      container.querySelector(".mobile-table")?.remove();
      container.appendChild(table);
    };

    const handleSort = (index) => {
      currentData = this.sortByColumn(currentData, index, !ascending);
      ascending = !ascending;
      render(ascending ? "ascending" : "descending");
    };

    render();

    window.addEventListener("resize", () => {
      const newMode = window.innerWidth < 768 ? "mobile" : "desktop";
      if (newMode !== currentMode) {
        currentMode = newMode;
        render();
      }
    });

    return container;
  }

  /**
   *  Tworzy i zwraca elementy przycisków eksportu danych tabeli (CSV i JSON).
   *
   * @param {Array[Object]} tableData  Struktura danych tabeli
   * @param {Array<string>} headers  Tablica nagłówków kolumn
   * @returns
   */
  static renderExportDataTableButtons(tableData = [], headers = []) {
    const wrapper = document.createElement("div");
    wrapper.classList.add(
      "export-buttons-wrapper",
      "flex",
      "flex-column",
      "flex-end-items"
    );
    const exportCSVButton = this.renderButton("↯ CSV", "fifth", "button", () =>
      this.exportTableDataToCSV(tableData, headers)
    );
    const exportJSONButton = this.renderButton(
      "↯ JSON",
      "fifth",
      "button",
      () => this.exportTableDataToJSON(tableData)
    );

    exportCSVButton.classList.add("mr-5");
    exportJSONButton.classList.add("mr-5");

    exportCSVButton.setAttribute(
      "aria-label",
      "Eksportuj dane tabeli do pliku CSV"
    );
    exportJSONButton.setAttribute(
      "aria-label",
      "Eksportuj dane tabeli do pliku JSON"
    );

    exportCSVButton.setAttribute("title", "Eksportuj dane tabeli do pliku CSV");
    exportJSONButton.setAttribute(
      "title",
      "Eksportuj dane tabeli do pliku JSON"
    );

    wrapper.appendChild(exportCSVButton);
    wrapper.appendChild(exportJSONButton);
    return wrapper;
  }

  /**
   * Export danych tabeli do pliku .CSV
   *
   * @static
   * @param {Array} tableData Dane tabeli
   * @param {Array} headers Nagłówki kolumn tabeli
   * @param {string} [filename="table_data.csv"] nazwa pobranego pliku .CSV
   *
   * Po wywołaniu tej metody zostanie wygenerowany i pobrany plik CSV zawierający dane tabeli.
   */
  static exportTableDataToCSV(tableData, headers, filename = "table_data.csv") {
    const csvRows = [];
    csvRows.push(headers.join(","));
    tableData.forEach((row) => {
      const values = row.map((cell) => {
        if (typeof cell === "object") {
          return `"${JSON.stringify(cell).replace(/"/g, '""')}"`;
        }
        return `"${String(cell).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export danych tabeli do pliku .JSON
   * @static
   * @param {Array} tableData Dane tabeli
   * @param {string} [filename="table_data.json"] nazwa pobranego pliku .JSON
   *
   * Po wywołaniu tej metody zostanie wygenerowany i pobrany plik JSON zawierający dane tabeli.
   */
  static exportTableDataToJSON(tableData, filename = "table_data.json") {
    const jsonString = JSON.stringify(tableData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
>>>>>>> 088b8cb090ab51e8084b3af46fab348f659a90d3
