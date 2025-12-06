import { UIFacade } from "../UIFacade.js";
import { DataService } from "../Service/DataService.js";

export class UsersPage {
  static renderUsersPage() {
    const container = document.createElement("section");
    container.id = "users-page";
    const title = document.createElement("h2");
    title.textContent = "Zarządzaj użytkownikami";
    container.appendChild(title);

    const contentContainer = document.createElement("div");
    contentContainer.id = "users-content-container";
    contentContainer.innerHTML = '<div class="loader">Ładowanie użytkowników...</div>';
    container.appendChild(contentContainer);

    this._loadDataAndRender(contentContainer);

    return container;
  }

  static async _loadDataAndRender(container) {
      try {
          const [usersData, roleOptions, classOptions] = await Promise.all([
              DataService.getUsers(),
              DataService.getRoleOptions(),
              DataService.getClassOptions()
          ]);
          
          container.innerHTML = ""; // Clear loader

          const formContainer = document.createElement("div");
          formContainer.id = "add-user-form-container";
          container.appendChild(formContainer);
      
          const listContainer = document.createElement("div");
          listContainer.id = "users-list-container";
          container.appendChild(listContainer);
      
          this.renderAddUserForm(formContainer, roleOptions, classOptions);
          this.renderUsersList(listContainer, usersData);

      } catch (error) {
          console.error("Błąd ładowania użytkowników:", error);
          container.innerHTML = '<p class="error">Nie udało się pobrać danych użytkowników.</p>';
      }
  }

  static renderAddUserForm(container, roleOptions, classOptions) {
    const elements = [
      {
        label: "Imię",
        type: "text",
        id: "user-name",
        required: true,
        placeholder: "Wpisz imię",
        direction: "row-full",
      },
      {
        label: "Drugie imię",
        type: "text",
        id: "user-middle-name",
        placeholder: "Wpisz drugie imię",
        direction: "row-full",

      },
      {
        label: "Nazwisko",
        type: "text",
        id: "user-last-name",
        required: true,
        placeholder: "Wpisz nazwisko",
        direction: "row-full",

      },
      {
        label: "Email",
        type: "email",
        id: "user-email",
        required: true,
        placeholder: "Wpisz email",
        direction: "row-full",

      },
      {
        selectInputOptions: true,
        label: "Rola",
        type: "select",
        id: "user-role",
        options: roleOptions,
        required: true,
        direction: "row-full",

      },
      {
        selectInputOptions: true,
        label: "Klasa",
        type: "select",
        id: "user-class",
        options: classOptions,
        direction: "row-full",

      },
    ];

    const form = UIFacade.createForm(
      elements,
      "Dodaj użytkownika",
      () => {
        alert("Funkcja dodawania użytkownika w przygotowaniu (wymaga backendu).");
      }
    );
    container.appendChild(form);
  }

  static renderUsersList(container, usersData) {
    const headers = ["Lp.", "Imię", "Drugie imię", "Nazwisko", "Email", "Rola", "Klasa", "Akcje"];
    const data = usersData.map((user, index) => [
      index + 1,
      user[0],
      user[1],
      user[2],
      user[3],
      user[5], // Role
      user[6] || "-", // Class
      {
        type: "actions",
        actions: [
          {
            label: "Edytuj",
            action: () => alert(`Edycja użytkownika: ${user[0]} ${user[2]}`),
          },
          {
            label: "Usuń",
            action: () => alert(`Usuwanie użytkownika: ${user[0]} ${user[2]}`),
          },
        ],
      },
    ]);

    const table = UIFacade.createTable(data, headers);
    container.appendChild(table);
  }
}
