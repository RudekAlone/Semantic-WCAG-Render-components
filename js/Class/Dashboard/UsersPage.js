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
          this.renderUsersList(listContainer, usersData, classOptions);

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

  static renderUsersList(container, usersData, classOptions) {
    const headers = ["Lp.", "Imię", "Drugie imię", "Nazwisko", "Login", "Rola", "Klasa", "Akcje"];
    const data = usersData.map((user, index) => {
        const [id, firstName, middleName, lastName, login, role, className] = user;
        
        return [
          index + 1,
          firstName,
          middleName,
          lastName,
          login,
          role, 
          className ?  {
        type: "select",
        options: classOptions,
      } : "-", 
          {
            type: "button",
                label: "Resetuj Hasło",
                buttonStyle: "primary",
                onClick: async () => {
                    if(confirm(`Czy zresetować hasło dla użytkownika ${firstName} ${lastName}?`)) {
                        try {
                            const res = await DataService.resetUserPassword(id);
                            if(res.success) alert("Hasło zresetowane.");
                            else alert("Błąd: " + (res.error || "Nieznany"));
                        } catch(e) { console.error(e); alert("Wystąpił błąd."); }
                    }
                },
              },
            
            //   {
            // type: "dropdown",
            //     label: "Zmień Klasę",
            //     action: async () => {
            //         // Simple prompt for now
            //         const newClass = prompt("Podaj nową klasę:", className || "");
            //         if(newClass !== null && newClass !== className) {
            //              try {
            //                 const res = await DataService.changeUserClass(id, newClass);
            //                  if(res.success) {
            //                      alert("Klasa zmieniona.");
            //                      // Optional: reload page or update row
            //                      location.reload(); 
            //                  }
            //                 else alert("Błąd: " + (res.error || "Nieznany"));
            //             } catch(e) { console.error(e); alert("Wystąpił błąd."); }
            //         }
            //     },
            //   },
            //   {
            //     label: "Usuń",
            //     action: () => alert(`Funkcja usuwania w przygotowaniu: ${firstName} ${lastName}`),
            //   },
            // ],
          // },
        ];
    });

    const table = UIFacade.createTable(data, headers);
    container.appendChild(table);
  }
}
