import { RenderForm } from "../Render/RenderForm.js";
import { RenderTable } from "../Render/RenderTable.js";

import { SUBJECT_OPTIONS, CLASS_OPTIONS, TASKS_DATA, TASK_STATUS } from "./constants.js";

export class TasksStatusPage {
  static render() {
    const pageSection = document.createElement("section");
    pageSection.id = "tasks-status-page";
    const navFilterSection = document.createElement("nav");
    navFilterSection.id = "tasks-status-nav-filter-section";
    pageSection.appendChild(navFilterSection);

    const contentArea = document.createElement("section");
    contentArea.id = "tasks-status-content-area";
    pageSection.appendChild(contentArea);

    navFilterSection.appendChild(this.selectForm(contentArea));


    return pageSection;
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

    const form = RenderForm.renderForm(
        elements,
        "Filtruj zadania",
        () =>{
            this.loadTasksStatus(
                (document.querySelector("select[name='class-select']")).value,
                (document.querySelector("select[name='subject-select']")).value,
                contentArea
            );
        },
        "row-center"
      );
      form.querySelector("select[name='subject-select']").value = "aso";
    return form;
  }

  static loadTasksStatus(className, subjectName, contentArea) {
    contentArea.innerHTML = "";
    if (!className || !subjectName) {
    const info = document.createElement("p");

      info.textContent = `Proszę wybrać klasę i przedmiot, aby załadować status zadań.`;
    contentArea.appendChild(info);
    return;
    }
    const studentsTasksStatus = document.createElement("section");
    studentsTasksStatus.className = "status-section";
    const tasksList = document.createElement("ul");
    const filteredTasks = TASKS_DATA.filter(
      (task) =>
        (subjectName === "all" || task.subject === subjectName)
    );;
    filteredTasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.textContent = task.name;
      tasksList.appendChild(taskItem);
      taskItem.addEventListener("click", () => {
        this.renderTaskStatus(studentsTasksStatus, TASK_STATUS, task.name);
      });
    });
    contentArea.appendChild(tasksList);

    
    // Tutaj można dodać logikę do wyświetlenia statusu zadań dla uczniów w danej klasie
    contentArea.appendChild(studentsTasksStatus);
  }

  static renderTaskStatus(container, StudentsTasksData, taskName) {
    container.innerHTML = "";
    const title = document.createElement("h3");
    title.textContent = `Status zadania: ${taskName}`;
    container.appendChild(title);
    console.log("Rendering status for task:", taskName);
    console.log("Task status data:", StudentsTasksData);
    const headers = ["Nr", "Imię", "Nazwisko", "Status"];
    const elements = [
      ...StudentsTasksData.map((status) => [
        status.userNumber,
        status.userName,
        status.userLastName,
        { type: "checkbox", value: status.status},

      ]),
    ]

    console.log(StudentsTasksData[0].status);
    console.log(StudentsTasksData[1].status);
    console.log(StudentsTasksData[2].status);
    const statusList = RenderTable.renderResponsiveTable(elements, headers);

    container.appendChild(statusList);
  }
}
