import { RenderElements } from "./RenderElements.js";

export class DashboardRender {
  static render(pages = []) {
    const dashboard = document.createElement("section");
    dashboard.id = "dashboard";

    const navPanels = document.createElement("nav");
    dashboard.appendChild(navPanels);

    const contentArea = document.createElement("section");
    contentArea.id = "dashboard-content";
    dashboard.appendChild(contentArea);

    pages.forEach((page) => {
      const button = this.createNavButton(page);
      navPanels.appendChild(button);
      button.addEventListener("click", () => {
        this.loadPageContent(page, contentArea);
      });
    });

    return dashboard;
  }

  static createNavButton(page) {
    const button = RenderElements.renderButton(
      page.icon + " " + page.name,
      "quaternary"
    );
    button.id = `nav-${page.id}`;
    return button;
  }

  static loadPageContent(page, contentArea) {
    contentArea.innerHTML = ""; // Clear previous content
    switch (page.id) {
      case "dashboard":
        contentArea.appendChild(this.renderDashboard());
        break;
      // Add cases for other pages as needed
      case "users":
        contentArea.appendChild(this.renderUserManagement());
        break;
      default:
        const placeholder = document.createElement("div");
        placeholder.innerHTML = `Strona <i>${page.name}</i> jest w budowie.`;
        contentArea.appendChild(placeholder);
    }
  }

  static renderDashboard() {
    const dashboard = document.createElement("section");
    dashboard.id = "dashboard-page";
    dashboard.textContent = "To jest strona Dashboard.";
    return dashboard;
  }

  static renderUserManagement(isAdmin = true) {
    const userManagement = document.createElement("section");
    userManagement.id = "user-management-page";

    const title = document.createElement("h2");
    title.textContent = "Zarządzanie użytkownikami";
    userManagement.appendChild(title);

    const content = document.createElement("section");

    const form = document.createElement("form");
    form.appendChild(
      RenderElements.renderInput(
      "Imię",
        "name",
        "name-input",
        "text",
        "textbox",
        true
      )
    );
    form.appendChild(
      RenderElements.renderInput(
        "Drugie imię",
        "middleName",
        "middle-name-input",
        "text",
        "textbox",
        false
      )
    );
    form.appendChild(
      RenderElements.renderInput(
        "Nazwisko",
        "lastName",
        "last-name-input",
        "text",
        "textbox",
        true
      )
    );
    const roleOptions = [{ value: "student", text: "Uczeń" },
                         { value: "teacher", text: "Nauczyciel" },
                         { value: "admin", text: "Administrator" }];
    form.appendChild(
      RenderElements.selectInputOptions("Rola konta",roleOptions, "accountRole", "account-role", true, "row")
    );

    const classOptions = [{ value: "1A", text: "1A" },
                          { value: "2B", text: "2B" },
                          { value: "3C", text: "3C" }];
    form.appendChild(
      RenderElements.selectInputOptions("Przypisana klasa",classOptions, "assignedClass", "assignedClass", true, "row")
    );

    const submitButton = RenderElements.renderButton("Dodaj użytkownika", "primary");
    form.appendChild(submitButton);

    const details = RenderElements.renderDetailsSummary("Dodawanie nowego użytkownika", form)
    content.appendChild(details);

    if(window.innerWidth > 600){
      details.open = true;
    }




    const sectionOptionsLoad = document.createElement("section");
    sectionOptionsLoad.id = "user-list-section";

    const optionsLoad =[
      { vale: "admins", text: "Załaduj administratorów" },
      { vale: "teachers", text: "Załaduj nauczycieli" },
      { vale: "1A", text: "Załaduj klasę 1A" },
      { vale: "2B", text: "Załaduj klasę 2B" },
      { vale: "3C", text: "Załaduj klasę 3C" }
    ]
    if(!isAdmin){
      optionsLoad.splice(0,2); // remove first two elements
    }

    const data = [
        [1, "Jan", "Kowalski", "Nowak", "🧑🏻‍🎓 Uczeń"],
        [2, "Anna", "Maria", "Wiśniewska", "🧑🏻‍🏫 Nauczyciel"],
        [3, "Piotr", "-", "Zieliński", "🤖 Administrator"]
      ];


    const selectLoad = RenderElements.selectInputOptions("Wybierz użytkowników do załadowania", optionsLoad, "loadUsers", "load-users", true, "row");
    sectionOptionsLoad.appendChild(selectLoad);
    selectLoad.appendChild(
      RenderElements.renderButton("Załaduj tabelę", "secondary", "button", () => {
        this.loadUserDataTable(data, isAdmin, sectionOptionsLoad);
      })
    );
    selectLoad.classList.add("mr-10");
    content.appendChild(sectionOptionsLoad);

    userManagement.appendChild(content);
    return userManagement;
  }

  static loadUserDataTable(data, isAdmin, parentSection) {
        

      const headers = ["ID", "Imię", "Drugie imię", "Nazwisko", "Rola", "Reset hasła"];
      data.forEach(row => {
        if(row[4].includes("Uczeń") || row[4].includes("Nauczyciel")){
        row.push({type: "button", label: "Resetuj hasło", buttonStyle: "tertiary"});
        } else if (isAdmin){
          row.push({type: "button", label: "Resetuj hasło", buttonStyle: "quaternary"});
        } else {
          row.push("Brak uprawnień");
        }
      });

      if(isAdmin){

      }
    const userListTable = RenderElements.renderResponsiveTable(
      data,
      headers,
      false
    );

    const sectionTable = document.createElement("section");
    sectionTable.id = "user-list-table-section";
    sectionTable.appendChild(userListTable);
    parentSection.appendChild(sectionTable);
  }
}