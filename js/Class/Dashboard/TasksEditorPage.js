import { UIFacade } from "../UIFacade.js";
import { MarkdownEditorComponent } from "./Components/MarkdownEditorComponent.js";
import { DataService } from "../Service/DataService.js";

export class TasksEditorPage {
  static renderTasksEditorPage() {
    const container = document.createElement("section");
    container.id = "tasks-editor-page";
    const title = document.createElement("h2");
    title.textContent = "Edytor zadań";
    container.appendChild(title);

    const contentContainer = document.createElement("div");
    contentContainer.id = "tasks-editor-content";
    contentContainer.innerHTML = '<div class="loader">Ładowanie edytora...</div>';
    container.appendChild(contentContainer);

    this._loadDataAndRender(contentContainer);

    return container;
  }

  static async _loadDataAndRender(container) {
      try {
          const [subjectOptions, tasksData] = await Promise.all([
              DataService.getSubjectOptions(),
              DataService.getTasks()
          ]);
          
          container.innerHTML = ""; // Clear loader

          const formContainer = document.createElement("div");
          formContainer.id = "add-task-form-container";
          container.appendChild(formContainer);
      
          const listContainer = document.createElement("div");
          listContainer.id = "tasks-list-container";
          container.appendChild(listContainer);

          this.renderAddTaskForm(formContainer, subjectOptions);
          this.renderTasksList(listContainer, tasksData);

      } catch (error) {
          console.error("Błąd ładowania edytora zadań:", error);
          container.innerHTML = '<p class="error">Nie udało się pobrać danych.</p>';
      }
  }

  static renderAddTaskForm(container, subjectOptions) {
    const elements = [
      {
        label: "Nazwa zadania",
        type: "text",
        id: "task-name",
        required: true,
        placeholder: "Wpisz nazwę zadania",
      },
      {
        selectInputOptions: true,
        label: "Przedmiot",
        type: "select",
        id: "task-subject",
        options: subjectOptions,
        required: true,
      },
      {
        label: "Termin",
        type: "date",
        id: "task-deadline",
        required: true,
      },
    ];

    const form = UIFacade.createForm(
      elements,
      "Dodaj zadanie",
      () => {
        alert("Funkcja dodawania zadania w przygotowaniu (wymaga backendu).");
      }
    );

    // Add Markdown Editor
    const editorContainer = document.createElement("div");
    editorContainer.className = "markdown-editor-container";
    
    // Create editor component instance
    const editor = new MarkdownEditorComponent("task-content-editor");
    const editorElement = editor.render();
    
    // Insert editor before the submit button (last child of form)
    form.insertBefore(editorElement, form.lastElementChild);

    container.appendChild(form);
  }

  static renderTasksList(container, tasksData) {
    const headers = ["Lp.", "Nazwa", "Przedmiot", "Termin", "Akcje"];
    const data = tasksData.map((task, index) => [
      index + 1,
      task.name,
      task.subject,
      task.deadline || "-",
      {
        type: "actions",
        actions: [
          {
            label: "Edytuj",
            action: () => alert(`Edycja zadania: ${task.name}`),
          },
          {
            label: "Usuń",
            action: () => alert(`Usuwanie zadania: ${task.name}`),
          },
        ],
      },
    ]);

    const table = UIFacade.createTable(data, headers);
    container.appendChild(table);
  }
}
