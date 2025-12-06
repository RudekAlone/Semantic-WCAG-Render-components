import { RenderForm } from "../Render/RenderForm.js";
import { RenderTable } from "../Render/RenderTable.js";
import { DataService } from "../Service/DataService.js";

export class TasksStatusPage {
  static render() {
    const pageSection = document.createElement("section");
    pageSection.id = "tasks-status-page";
    
    const contentContainer = document.createElement("div");
    contentContainer.id = "tasks-status-container";
    contentContainer.innerHTML = '<div class="loader">Ładowanie opcji...</div>';
    pageSection.appendChild(contentContainer);

    this._loadDataAndRender(contentContainer);

    return pageSection;
  }

  static async _loadDataAndRender(container) {
    try {
        const [classOptions, subjectOptions] = await Promise.all([
            DataService.getClassOptions(),
            DataService.getSubjectOptions()
        ]);

        container.innerHTML = ""; // Clear loader

        const navFilterSection = document.createElement("nav");
        navFilterSection.id = "tasks-status-nav-filter-section";
        container.appendChild(navFilterSection);
    
        const contentArea = document.createElement("section");
        contentArea.id = "tasks-status-content-area";
        container.appendChild(contentArea);
    
        navFilterSection.appendChild(this.selectForm(contentArea, classOptions, subjectOptions));

    } catch (error) {
        console.error("Błąd ładowania strony statusu zadań:", error);
        container.innerHTML = '<p class="error">Nie udało się pobrać danych.</p>';
    }
  }

  static selectForm(contentArea, classOptions, subjectOptions) {
    const elements = [
      {
        selectInputOptions: true,
        label: "Wybór klasy",
        options: classOptions,
        name: "class-select",
        id: "class-select",
        type: "select",
        role: "combobox",
        required: true,
        direction: "row-full",

      },
      {
        selectInputOptions: true,
        label: "Wybór przedmiotu",
        options: subjectOptions,
        name: "subject-select",
        id: "subject-select",
        type: "select",
        role: "combobox",
        required: true,
        direction: "row-full",

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
      // Set default value if exists
      const subjectSelect = form.querySelector("select[name='subject-select']");
      if(subjectSelect && subjectSelect.options.length > 0) {
          // Try to select 'aso' if exists, otherwise first
          const asoOption = Array.from(subjectSelect.options).find(opt => opt.value === 'aso');
          if(asoOption) subjectSelect.value = 'aso';
      }
      
    return form;
  }

  static async loadTasksStatus(className, subjectName, contentArea) {
    contentArea.innerHTML = '<div class="loader">Ładowanie listy zadań...</div>';
    
    if (!className || !subjectName) {
        contentArea.innerHTML = "";
        const info = document.createElement("p");
        info.textContent = `Proszę wybrać klasę i przedmiot, aby załadować status zadań.`;
        contentArea.appendChild(info);
        return;
    }

    try {
        const tasksData = await DataService.getTasks();
        
        contentArea.innerHTML = ""; // Clear loader

        const studentsTasksStatus = document.createElement("section");
        studentsTasksStatus.className = "status-section";
        const tasksList = document.createElement("ul");
        const filteredTasks = tasksData.filter(
          (task) =>
            (subjectName === "all" || task.subject === subjectName)
        );;
        filteredTasks.forEach((task) => {
          const taskItem = document.createElement("li");
          taskItem.textContent = task.name;
          tasksList.appendChild(taskItem);
          taskItem.addEventListener("click", () => {
            this.renderTaskStatus(studentsTasksStatus, task.name);
          });
        });
        contentArea.appendChild(tasksList);
    
        // Tutaj można dodać logikę do wyświetlenia statusu zadań dla uczniów w danej klasie
        contentArea.appendChild(studentsTasksStatus);

    } catch (error) {
        console.error("Błąd pobierania zadań:", error);
        contentArea.innerHTML = '<p class="error">Błąd pobierania listy zadań.</p>';
    }
  }

  static async renderTaskStatus(container, taskName) {
    container.innerHTML = '<div class="loader">Ładowanie statusów...</div>';
    
    try {
        const studentsTasksData = await DataService.getTaskStatus(taskName);
        
        container.innerHTML = "";
        const title = document.createElement("h3");
        title.textContent = `Status zadania: ${taskName}`;
        container.appendChild(title);
        
        const headers = ["Nr", "Imię", "Nazwisko", "Status"];
        const elements = [
          ...studentsTasksData.map((status) => [
            status.userNumber,
            status.userName,
            status.userLastName,
            { type: "checkbox", value: [status.status,"Brak dostępu - zadanie po terminie"] },
    
          ]),
        ]
    
        const statusList = RenderTable.renderResponsiveTable(elements, headers);
    
        container.appendChild(statusList);

    } catch (error) {
        console.error("Błąd pobierania statusów:", error);
        container.innerHTML = '<p class="error">Błąd pobierania statusów zadania.</p>';
    }
  }
}
