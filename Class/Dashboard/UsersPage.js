import { RenderButton } from "../Render/RenderButton.js";
import { RenderInput } from "../Render/RenderInput.js";
import { RenderForm } from "../Render/RenderForm.js";
import { RenderTable } from "../Render/RenderTable.js";
import { RenderDetails } from "../Render/RenderDetails.js";

import {
  ROLE_OPTIONS,
  CLASS_OPTIONS,
  LOAD_USER_OPTIONS_ADMIN,
  LOAD_USER_OPTIONS_NON_ADMIN,
  USERS_DATA,
} from "../Dashboard/constants.js";

/**
 * Klasa renderująca stronę zarządzania użytkownikami.
 * Obsługuje formularz dodawania nowych użytkowników oraz tabelę z listą użytkowników.
 */

export class UsersPage {
  /**
   * Renderuje sekcję zarządzania użytkownikami.
   *
   * @static
   * @param {boolean} isAdmin - Czy użytkownik ma uprawnienia administratora
   * @returns {HTMLElement} Sekcja zarządzania użytkownikami
   */
  static render(isAdmin = true) {
    const userManagement = document.createElement("section");
    userManagement.id = "user-management-page";

    const title = document.createElement("h2");
    title.textContent = "Zarządzanie użytkownikami";
    userManagement.appendChild(title);

    const content = document.createElement("section");
    if (isAdmin) {
      const userFormElements = [
        {
          label: "Imię",
          name: "name",
          id: "name-input",
          type: "text",
          role: "textbox",
          required: true,
        },
        {
          label: "Drugie imię",
          name: "middleName",
          id: "middle-name-input",
          type: "text",
          role: "textbox",
          required: false,
        },
        {
          label: "Nazwisko",
          name: "lastName",
          id: "last-name-input",
          type: "text",
          role: "textbox",
          required: true,
        },
        {
          selectInputOptions: true,
          label: "Rola konta",
          options: ROLE_OPTIONS,
          name: "accountRole",
          id: "account-role",
          required: true,
          layout: "row",
        },
        {
          selectInputOptions: true,
          label: "Przypisana klasa",
          options: CLASS_OPTIONS,
          name: "assignedClass",
          id: "assignedClass",
          required: true,
          layout: "row",
        },
      ];

      const form = RenderForm.renderForm(
        userFormElements,
        "Dodaj użytkownika",
        (formData) => {
          console.log("Dodano użytkownika:", Object.fromEntries(formData));
        },
        "column"
      );

      const details = RenderDetails.renderDetailsSummary(
        "Dodawanie nowego użytkownika",
        form
      );
      content.appendChild(details);

      if (window.innerWidth > 600) {
        details.open = true;
      }
    }
    const sectionOptionsLoad = document.createElement("section");
    sectionOptionsLoad.id = "user-list-section";

    const optionsLoad = isAdmin
      ? LOAD_USER_OPTIONS_ADMIN
      : LOAD_USER_OPTIONS_NON_ADMIN;

    const data = USERS_DATA;

    const selectLoad = RenderInput.selectInputOptions(
      "Wybierz użytkowników do załadowania",
      optionsLoad,
      "loadUsers",
      "load-users",
      true,
      "row"
    );
    sectionOptionsLoad.appendChild(selectLoad);
    selectLoad.appendChild(
      RenderButton.renderButton(
        "Załaduj tabelę",
        "secondary",
        "button",
        () => {
          this.renderUserTable(data, isAdmin, sectionOptionsLoad);
        }
      )
    );
    selectLoad.classList.add("mr-10");
    content.appendChild(sectionOptionsLoad);

    userManagement.appendChild(content);
    return userManagement;
  }

  /**
   * Renderuje tabelę użytkowników z przyciskami resetu hasła.
   *
   * @static
   * @param {Array} data - Dane użytkowników
   * @param {boolean} isAdmin - Czy użytkownik ma uprawnienia administratora
   * @param {HTMLElement} parentSection - Sekcja, do której ma być dodana tabela
   * @returns {void}
   */
  static renderUserTable(data, isAdmin, parentSection) {
    const headers = [
      "ID",
      "Imię",
      "Drugie imię",
      "Nazwisko",
      "Login",
      "Rola",
      "Reset hasła",
    ];

    const roleButtonStyles = {
      Uczeń: "tertiary",
      Nauczyciel: "tertiary",
      Administrator: isAdmin ? "quaternary" : null,
    };

    const processedData = data.map((row) => {
      const roleText = row[5];
      let resetCell;
      if (roleText.includes("Uczeń"))
        resetCell = {
          type: "button",
          label: "Resetuj hasło",
          buttonStyle: roleButtonStyles["Uczeń"],
        };
      else if (roleText.includes("Nauczyciel"))
        resetCell = {
          type: "button",
          label: "Resetuj hasło",
          buttonStyle: roleButtonStyles["Nauczyciel"],
        };
      else if (roleText.includes("Administrator") && isAdmin)
        resetCell = {
          type: "button",
          label: "Resetuj hasło",
          buttonStyle: roleButtonStyles["Administrator"],
        };
      else resetCell = "Brak uprawnień";

      return [...row.slice(0, 6), resetCell];
    });

    const userListTable = RenderTable.renderResponsiveTable(
      processedData,
      headers,
      false
    );

    const sectionTable = document.createElement("section");
    sectionTable.id = "user-list-table-section";
    sectionTable.appendChild(userListTable);
    parentSection.querySelector(".table-container")?.remove();
    parentSection.appendChild(sectionTable);

    sectionTable.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.textContent.includes("Resetuj hasło")) {
        console.log(
          "Reset hasła dla:",
          btn.closest("tr").children[4].textContent
        );
      }
    });
  }
}
