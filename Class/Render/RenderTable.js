import { RenderInput } from "./RenderInput.js";
import { RenderButton } from "./RenderButton.js";

/**
 * Klasa odpowiedzialna za renderowanie tabel.
 */
export class RenderTable {
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
          const input = RenderInput.renderInput(
            cellData.label || "",
            `input-${Math.random().toString(36).slice(2, 8)}`,
            `input-${Math.random().toString(36).slice(2, 8)}`,
            cellData.type,
            cellData.type,
            false,
            "row-center",
            cellData.value || "",
            cellData.acceptFiles || [],
            cellData.placeholder || ""
          );
          td.appendChild(input);
        } else if (typeof cellData === "object" && cellData.type === "select") {
          const select = RenderInput.selectInputOptions("", cellData.options || []);
          td.appendChild(select);
        } else if (typeof cellData === "object" && cellData.type === "button") {
          const button = RenderButton.renderButton(
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
      const input = RenderInput.renderInput(
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
      const select = RenderInput.selectInputOptions("", cellData.options || []);
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
      const button = RenderButton.renderButton(
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

  static renderResponsiveTable(data = [], headers = [], isExportable = true, newFunction = null) {
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
      // Zapisz informacje o spanach z już istniejącej tabeli do kontenera,
      // żeby nie tracić ich przy ponownym renderowaniu.
      try {
        if (currentMode === "desktop") {
          const existingTable = container.querySelector("table");
          if (existingTable) {
        const spans = [];
        existingTable.querySelectorAll("tr").forEach((tr, rIdx) => {
          Array.from(tr.children).forEach((cell, cIdx) => {
            const cspan = cell.colSpan;
            const rspan = cell.rowSpan;
            if (cspan > 1 || rspan > 1) {
          spans.push({ r: rIdx, c: cIdx, cs: cspan, rs: rspan });
            }
          });
        });
        container.dataset.savedTableSpans = JSON.stringify(spans);
          }
        }
      } catch (err) {
        // ignore serialization errors
      }

      // Usuń poprzednie widoki (table / mobile)
      container.querySelector("table")?.remove();
      container.querySelector(".mobile-table")?.remove();

      // Przywróć zapisane spany na nowo wyrenderowanej tabeli (jeśli są)
      if (currentMode === "desktop" && container.dataset.savedTableSpans) {
        try {
          const spans = JSON.parse(container.dataset.savedTableSpans || "[]");
          spans.forEach((s) => {
        const row = table.rows[s.r];
        if (!row) return;
        const cell = row.children[s.c];
        if (!cell) return;
        if (s.cs > 1) cell.colSpan = parseInt(s.cs, 10);
        if (s.rs > 1) cell.rowSpan = parseInt(s.rs, 10);
          });
        } catch (err) {
          // jeśli nie uda się odczytać, pomijamy
        } finally {
          delete container.dataset.savedTableSpans;
        }
      }

      container.appendChild(table);
      if (typeof newFunction === "function") {
        newFunction(container);
      }
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
    const exportCSVButton = RenderButton.renderButton("↯ CSV", "fifth", "button", () =>
      this.exportTableDataToCSV(tableData, headers)
    );
    const exportJSONButton = RenderButton.renderButton(
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
}
