import { RenderButton } from "../Render/RenderButton.js";
import { RenderInput } from "../Render/RenderInput.js";
import { RenderForm } from "../Render/RenderForm.js";
import { RenderTable } from "../Render/RenderTable.js";
import { MarkdownEditorComponent } from "./Components/MarkdownEditorComponent.js";
import { SUBJECT_OPTIONS, TASKS_DATA } from "./constants.js";

/**
 * Klasa renderująca stronę edycji i zarządzania zadaniami studenta.
 * - Edytor markdown + podgląd z synchronizacją przewijania (z użyciem MarkdownEditorComponent)
 * - Dodawanie nowego zadania
 * - Filtrowanie i ładowanie zadań do edytora
 */
export class TasksEditorPage {
  /**
   * Renderuje całą stronę edytora zadań.
   * @returns {HTMLElement} korzeń strony edytora zadań
   */
  static render() {
    const tasksManagement = document.createElement("section");
    tasksManagement.id = "tasks-management-page";

    const tasksHeader = document.createElement("section");
    tasksHeader.classList.add("task-header");

    const addTaskSection = document.createElement("section");
    addTaskSection.classList.add("add-task-section");

    const filtersSection = document.createElement("section");
    filtersSection.classList.add("filters-section");

    tasksHeader.appendChild(addTaskSection);
    tasksHeader.appendChild(filtersSection);

    const tasksMain = document.createElement("section");
    tasksMain.classList.add("tasks-main");

    const editorSection = document.createElement("section");
    editorSection.classList.add("editor-section");

    // Preview section is now handled inside the component, but the layout expects it separately?
    // The original layout had editorSection and previewSection side-by-side in tasksMain.
    // The new component encapsulates both.
    // We need to adapt. The component returns a container with both.
    // So we can append the component to tasksMain directly or wrap it.
    // However, the original code passed editorSection and previewSection to taskEditor.
    // Let's adjust the layout structure here.
    
    // We will use a single container for the editor component which includes preview.
    const editorContainer = document.createElement("section");
    editorContainer.classList.add("editor-container");
    editorContainer.style.width = "100%"; // Ensure it takes full width

    tasksMain.appendChild(editorContainer);

    tasksManagement.appendChild(tasksHeader);
    tasksManagement.appendChild(tasksMain);

    const footerTasksSection = document.createElement("section");
    footerTasksSection.classList.add("tasks-footer");
    tasksManagement.appendChild(footerTasksSection);

    const saveButton = RenderButton.renderButton("Zapisz zadanie", "primary");
    saveButton.disabled = true;
    footerTasksSection.appendChild(saveButton);

    // Sekcje funkcjonalne
    this.taskEditor(editorContainer, saveButton);
    
    // Note: newTask and taskFilters need access to the editor instance or DOM.
    // We pass editorContainer to help them find the textarea.
    addTaskSection.appendChild(this.newTask(editorContainer));
    filtersSection.appendChild(this.taskFilters(editorContainer));

    return tasksManagement;
  }

  /**
   * Renderuje edytor markdown i podgląd z synchronizacją przewijania.
   * @param {HTMLElement} container
   * @param {HTMLButtonElement} buttonSave
   */
  static taskEditor(container, buttonSave = null) {
    const editorComponent = new MarkdownEditorComponent("Edytor zadania (markdown)", "task-editor");
    const editorElement = editorComponent.render();
    
    // Obsługa przycisku zapisu
    if (buttonSave) {
      editorElement.addEventListener("editor-change", (e) => {
        buttonSave.disabled = e.detail.value === "";
      });
    }

    container.appendChild(editorElement);
  }

  /**
   * Formularz tworzenia nowego zadania: czyści edytor, ustawia metadane i fokusuje textarea.
   * @param {HTMLElement} container - kontener zawierający edytor
   * @returns {HTMLFormElement}
   */
  static newTask(container) {
    const elementsInputs = [
      {
        label: "Nazwa zadania",
        name: "taskName",
        id: "task-name-input",
        type: "text",
        role: "textbox",
        required: true,
      },
      {
        selectInputOptions: true,
        label: "Przedmiot",
        options: SUBJECT_OPTIONS,
        name: "subject",
        id: "subject-select",
        required: true,
        layout: "row",
      },
    ];

    const form = RenderForm.renderForm(
      elementsInputs,
      "Dodaj nowe zadanie",
      (formData) => {
        // Znajdź textarea wewnątrz komponentu
        const textArea = container.querySelector("#task-editor-input");
        if (!textArea) return;

        textArea.value = "";
        textArea.dispatchEvent(new Event("input"));
        textArea.focus();
        textArea.scrollIntoView({ behavior: "smooth" });
        textArea.setAttribute("data-subject", formData.get("subject"));
        textArea.setAttribute("data-task-name", formData.get("taskName"));
      },
      "row"
    );

    // Rozciągnij pola na całą szerokość
    form.querySelector("#task-name-input")?.classList.add("w-full");
    form.querySelector("#subject-select")?.classList.add("w-full");
    form.querySelectorAll('[data-ui="input-wrapper"]').forEach((wrapper) => {
      wrapper.classList.add("w-full");
    });

    return form;
  }

  /**
   * Sekcja filtrów i listy zadań do wczytania w edytor.
   * @param {HTMLElement} container - kontener zawierający edytor
   * @returns {HTMLElement} sekcja filtrów
   */
  static taskFilters(container) {
    const filtersSection = document.createElement("section");
    filtersSection.id = "task-filters-section";

    // Konwersja SUBJECT_OPTIONS (tablica) + stałe pozycje
    const selectSubjectOptions = SUBJECT_OPTIONS;

    const selectSubject = RenderInput.selectInputOptions(
      "Filtruj według przedmiotu",
      selectSubjectOptions,
      "filter-subject",
      "filter-subject",
      false,
      "column"
    );
    filtersSection.appendChild(selectSubject);

    const tasksList = document.createElement("section");
    tasksList.id = "tasks-list-section";
    filtersSection.appendChild(tasksList);

    const tasks = TASKS_DATA.slice(); // kopia defensywna

    selectSubject.querySelector("select").addEventListener("change", (e) => {
      const filterSubject = e.target.value;
      tasksList.innerHTML = "";
      const filteredTasks =
        filterSubject === "all"
          ? tasks
          : tasks.filter((task) => task.subject === filterSubject);

      if (filteredTasks.length === 0 && filterSubject !== "") {
        tasksList.textContent = "Brak zadań do wyświetlenia.";
        return;
      }
      tasksList.appendChild(this.renderTaskElement(filteredTasks, container));
    });

    // Initial load of all tasks
    selectSubject.querySelector("select").dispatchEvent(new Event("change"));

    return filtersSection;
  }

  /**
   * Renderuje tabelę z listą zadań i obsługuje kliknięcie wiersza (ładowanie markdown do edytora).
   * @param {Array<{name:string, partName:string, link:string}>} tasks
   * @param {HTMLElement} container - kontener zawierający edytor
   * @returns {HTMLElement} tabela z zadaniami
   */
  static renderTaskElement(tasks, container) {
    const tasksListTable = RenderTable.renderResponsiveTable(
      tasks.map((task) => [task.name, task.partName]),
      ["Nazwa zadania", "Rozdział"],
      false
    );

    const tableContainer = document.querySelector("#tasks-list-section");
    if (tableContainer) {
      tableContainer.innerHTML = "";
      tableContainer.appendChild(tasksListTable);

      // Delegacja kliknięć na cały kontener tabeli
      tableContainer.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        if (!row) return;
        const allRows = [...tableContainer.querySelectorAll("tr")];
        const index = allRows.indexOf(row);
        if (index === 0) return; // pomiń nagłówek

        const task = tasks[index - 1];
        const editorTextarea = container.querySelector("#task-editor-input");
        if (!editorTextarea) return;

        fetch(task.link)
          .then((response) => (response.ok ? response.text() : Promise.reject(response)))
          .then((data) => {
            editorTextarea.value = data;
            editorTextarea.dispatchEvent(new Event("input"));
          })
          .catch(() => {
            // Fallback: nie wczytano treści
            editorTextarea.value = `Nie udało się wczytać treści zadania z ${task.link}`;
            editorTextarea.dispatchEvent(new Event("input"));
          });
      });
    }

    return tasksListTable;
  }
}
