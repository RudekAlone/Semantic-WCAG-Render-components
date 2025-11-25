import { RenderElements } from "../RenderElements.js";

import { SUBJECT_OPTIONS, CLASS_OPTIONS } from "./constants.js";

export class TasksStatusPage {
  static render() {
    const navFilterSection = document.createElement("nav");
    navFilterSection.id = "tasks-status-nav-filter-section";

    const contentArea = document.createElement("section");
    contentArea.id = "tasks-status-content-area";

    navFilterSection.appendChild(this.selectForm(contentArea));

    

    return navFilterSection;
  }

  static selectForm(contentArea) {
    const elements = [
      {
        selectInputOptions: true,
        label: "Wybór klasy",
        options: CLASS_OPTIONS,
        name: "class-select",
        id: "class-select",
        type: "select",
        role: "combobox",
        required: true,
      },
      {
        selectInputOptions: true,
        label: "Wybór przedmiotu",
        options: SUBJECT_OPTIONS,
        name: "subject-select",
        id: "subject-select",
        type: "select",
        role: "combobox",
        required: true,
      },
    ];

    const form = RenderElements.renderForm(
        elements,
        "Filtruj zadania",
        
        () =>{
            this.loadTasksStatus(
                (document.querySelector("select[name='class-select']")).value,
                (document.querySelector("select[name='subject-select']")).value,
                contentArea
            );
        }
      );
    return form;
  }

  static loadTasksStatus(className, subjectName, contentArea) {
    contentArea.innerHTML = "";
    const info = document.createElement("p");
    info.textContent = `Wybrana klasa: ${className}, Wybrany przedmiot: ${subjectName}`;
    contentArea.appendChild(info);
    // Tutaj można dodać logikę do załadowania i wyświetlenia statusu zadań
  }
}
