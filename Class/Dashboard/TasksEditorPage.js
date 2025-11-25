import { RenderElements } from "../RenderElements.js";
import { RenderMarkdown } from "../RenderMarkdown.js";
import { SUBJECT_OPTIONS, TASKS_DATA } from "./constants.js";

/**
 * Klasa renderująca stronę edycji i zarządzania zadaniami studenta.
 * - Edytor markdown + podgląd z synchronizacją przewijania
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

    const previewSection = document.createElement("section");
    previewSection.classList.add("preview-section");

    tasksMain.appendChild(editorSection);
    tasksMain.appendChild(previewSection);

    tasksManagement.appendChild(tasksHeader);
    tasksManagement.appendChild(tasksMain);

    const footerTasksSection = document.createElement("section");
    footerTasksSection.classList.add("tasks-footer");
    tasksManagement.appendChild(footerTasksSection);

    const saveButton = RenderElements.renderButton("Zapisz zadanie", "primary");
    saveButton.disabled = true;
    footerTasksSection.appendChild(saveButton);

    // Sekcje funkcjonalne
    this.taskEditor(editorSection, previewSection, saveButton);
    addTaskSection.appendChild(this.newTask(editorSection));
    filtersSection.appendChild(this.taskFilters(editorSection));

    return tasksManagement;
  }

  /**
   * Precyzyjnie wyrównuje scroll edytora względem podglądu, z dopasowaniem do wysokości linii.
   * @param {HTMLTextAreaElement} textareaEditor
   * @param {HTMLElement} preview
   * @param {{activeSource: string|null}} state
   */
  static finalizeAlign(textareaEditor, preview, state) {
    const ratio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    let targetTop = ratio * (textareaEditor.scrollHeight - textareaEditor.clientHeight);

    const lh =
      parseFloat(getComputedStyle(textareaEditor).lineHeight) ||
      parseFloat(getComputedStyle(textareaEditor).fontSize);
    if (lh && Number.isFinite(lh)) {
      targetTop = Math.round(targetTop / lh) * lh;
    }

    state.activeSource = "preview";
    textareaEditor.scrollTop = targetTop;
    state.activeSource = null;
  }

  /**
   * Renderuje edytor markdown i podgląd z synchronizacją przewijania.
   * @param {HTMLElement} editorSection
   * @param {HTMLElement} previewSection
   * @param {HTMLButtonElement} buttonSave
   */
  static taskEditor(editorSection, previewSection, buttonSave) {
    const editor = RenderElements.renderTextArea("", "task-editor", "task-editor", 44, 80);
    editor.id = "task-editor-section";

    const headerEditor = document.createElement("h3");
    headerEditor.textContent = "Edytor zadania (markdown)";
    editorSection.appendChild(headerEditor);
    editorSection.appendChild(editor);

    const preview = document.createElement("section");
    preview.id = "task-preview-section";
    preview.classList.add("preview-markdown");

    const headerPreview = document.createElement("h3");
    headerPreview.textContent = "Podgląd zadania";
    previewSection.appendChild(headerPreview);
    previewSection.appendChild(preview);

    const textareaEditor = editor.querySelector("textarea");

    textareaEditor.addEventListener("input", () => {
      buttonSave.disabled = textareaEditor.value === "";
      RenderMarkdown.renderMarkdownPreview(preview, textareaEditor.value);
    });

    // Wspólny, lokalny stan synchronizacji
    const state = {
      activeSource: null,
      skipPreviewSync: false,
      finalizeTimer: null,
    };

    // Klawiatura w preview: tymczasowe wyłączenie sync
    preview.addEventListener("keydown", (e) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key)) {
        state.skipPreviewSync = true;
        if (state.finalizeTimer) {
          clearTimeout(state.finalizeTimer);
          state.finalizeTimer = null;
        }
      }
    });

    preview.addEventListener("keyup", (e) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(e.key)) {
        state.skipPreviewSync = false;
        state.finalizeTimer = setTimeout(() => {
          this.finalizeAlign(textareaEditor, preview, state);
          state.finalizeTimer = null;
        }, 30);
      }
    });

    // Sync edytor → preview (zawsze)
    textareaEditor.addEventListener("scroll", () => {
      if (state.activeSource === "preview") return;
      state.activeSource = "editor";
      requestAnimationFrame(() => {
        const ratio =
          textareaEditor.scrollTop /
          (textareaEditor.scrollHeight - textareaEditor.clientHeight);
        preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
        state.activeSource = null;
      });
    });

    // Sync preview → edytor (tylko mysz/touchpad)
    preview.addEventListener("scroll", () => {
      if (state.activeSource === "editor") return;
      if (state.skipPreviewSync) return;
      state.activeSource = "preview";
      requestAnimationFrame(() => {
        const ratio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
        textareaEditor.scrollTop =
          ratio * (textareaEditor.scrollHeight - textareaEditor.clientHeight);
        state.activeSource = null;
      });
    });

    // Załaduj przykładowy markdown (bez crasha na błąd sieci)
    fetch("sample-task.md")
      .then((response) => (response.ok ? response.text() : Promise.reject(response)))
      .then((data) => {
        textareaEditor.value = data;
        textareaEditor.dispatchEvent(new Event("input"));
      })
      .catch(() => {
        // spokojny fallback; brak logów produkcyjnych
      });
  }

  /**
   * Formularz tworzenia nowego zadania: czyści edytor, ustawia metadane i fokusuje textarea.
   * @param {HTMLElement} editorSection
   * @returns {HTMLFormElement}
   */
  static newTask(editorSection) {
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

    const form = RenderElements.renderForm(
      elementsInputs,
      "Dodaj nowe zadanie",
      (formData) => {
        const textArea = editorSection.querySelector("#task-editor-section textarea");
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
   * @param {HTMLElement} editorSection - referencja do sekcji edytora
   * @returns {HTMLElement} sekcja filtrów
   */
  static taskFilters(editorSection) {
    const filtersSection = document.createElement("section");
    filtersSection.id = "task-filters-section";

    // Konwersja SUBJECT_OPTIONS (tablica) + stałe pozycje
    const selectSubjectOptions = SUBJECT_OPTIONS;

    const selectSubject = RenderElements.selectInputOptions(
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
      tasksList.appendChild(this.renderTaskElement(filteredTasks, editorSection));
    });

    // Initial load of all tasks
    selectSubject.querySelector("select").dispatchEvent(new Event("change"));

    return filtersSection;
  }

  /**
   * Renderuje tabelę z listą zadań i obsługuje kliknięcie wiersza (ładowanie markdown do edytora).
   * @param {Array<{name:string, partName:string, link:string}>} tasks
   * @param {HTMLElement} editorSection - sekcja z textarea edytora
   * @returns {HTMLElement} tabela z zadaniami
   */
  static renderTaskElement(tasks, editorSection) {
    const tasksListTable = RenderElements.renderResponsiveTable(
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
        const editorTextarea = editorSection.querySelector("#task-editor-section textarea");
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
