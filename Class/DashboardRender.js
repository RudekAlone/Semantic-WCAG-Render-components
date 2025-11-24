import { RenderElements } from "./RenderElements.js";
import { RenderMarkdown } from "./RenderMarkdown.js";

// importuj stałe
import {
  ROLE_OPTIONS,
  CLASS_OPTIONS,
  SUBJECT_OPTIONS,
  LOAD_USER_OPTIONS_ADMIN,
  LOAD_USER_OPTIONS_NON_ADMIN,
  USERS_DATA,
} from "./Dashboard/constants.js";

// Dashboard Pages imports
import { TasksPage } from "./Dashboard/TasksPage.js";
import { UsersPage } from "./Dashboard/UsersPage.js";
import { ClassesPage } from "./Dashboard/ClassesPage.js";

export class DashboardRender {
  static render(pages = []) {
    const dashboard = document.createElement("section");
    dashboard.id = "dashboard";

    const navPanels = document.createElement("nav");
    dashboard.appendChild(navPanels);

    const contentArea = document.createElement("section");
    contentArea.id = "dashboard-content";
    dashboard.appendChild(contentArea);

    // renderuj przyciski nawigacji
    pages.forEach((page) => {
      const button = this.createNavButton(page);
      // zapisz page.id i page.name w data
      button.dataset.pageId = page.id;
      button.dataset.pageName = page.name;
      navPanels.appendChild(button);
    });

    // delegacja zdarzeń
    navPanels.addEventListener("click", (e) => {
      const btn = e.target.closest("button[id^='nav-']");
      if (!btn) return;
      const page = { id: btn.dataset.pageId, name: btn.dataset.pageName };
      this.loadPageContent(page, contentArea);
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

    const PAGE_RENDERERS = {
      dashboard: () => this.renderDashboard(),
      tasks: () => TasksPage.render(),
      students: () => UsersPage.render(false),
      classes: () => ClassesPage.renderClassesPage(),
      users: () => UsersPage.render(true),
      "manage-tasks": () => DashboardRender.renderTasksEditorManagement(),
    };
    const renderer = PAGE_RENDERERS[page.id];
    if (renderer) {
      contentArea.appendChild(renderer());
      return;
    }
    const placeholder = document.createElement("div");
    placeholder.innerHTML = `Strona <i>${page.name}</i> jest w budowie.`;
    contentArea.appendChild(placeholder);
  }

  static renderDashboard() {
    const dashboard = document.createElement("section");
    dashboard.id = "dashboard-page";
    dashboard.textContent = "To jest strona Dashboard.";
    return dashboard;
  }

 

  static renderTasksEditorManagement() {
    const tasksManagement = document.createElement("section");
    tasksManagement.id = "tasks-management-page";
    tasksManagement.textContent = "To jest strona Zarządzanie zadaniami.";

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
    footerTasksSection.appendChild(saveButton);

    saveButton.disabled = true;

    this.taskEditor(editorSection, previewSection, saveButton);
    addTaskSection.appendChild(this.newTask(editorSection));
    filtersSection.appendChild(this.taskFilters());

    return tasksManagement;
  }

  static finalizeAlign(textareaEditor, preview) {
    // procent przewinięcia preview
    const ratio =
      preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    // docelowy scrollTop w edytorze
    let targetTop =
      ratio * (textareaEditor.scrollHeight - textareaEditor.clientHeight);

    // dopasowanie do wysokości linii, żeby „piksel” był równy linii tekstu
    const lh =
      parseFloat(getComputedStyle(textareaEditor).lineHeight) ||
      parseFloat(getComputedStyle(textareaEditor).fontSize);
    if (lh && Number.isFinite(lh)) {
      targetTop = Math.round(targetTop / lh) * lh;
    }

    activeSource = "preview";
    textareaEditor.scrollTop = targetTop;
    activeSource = null;
  }

  static taskEditor(editorSection, previewSection, buttonSave) {
    const editor = RenderElements.renderTextArea(
      "",
      "task-editor",
      "task-editor",
      44,
      80
    );
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
      if (textareaEditor.value == "") {
        buttonSave.disabled = true;
      } else {
        buttonSave.disabled = false;
      }
      const markdownText = textareaEditor.value;
      RenderMarkdown.renderMarkdownPreview(preview, markdownText);
    });

    let activeSource = null;
    let skipPreviewSync = false;
    let finalizeTimer = null;

    // — wykrycie klawiatury w preview: w trakcie trzymania strzałek wyłączamy sync —
    preview.addEventListener("keydown", (e) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(
          e.key
        )
      ) {
        skipPreviewSync = true;
        // w trakcie przewijania klawiaturą nie synchronizujemy
        if (finalizeTimer) {
          clearTimeout(finalizeTimer);
          finalizeTimer = null;
        }
      }
    });

    // — po puszczeniu klawisza: pojedyncze, płynne wyrównanie —
    preview.addEventListener("keyup", (e) => {
      if (
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(
          e.key
        )
      ) {
        skipPreviewSync = false;
        // minimalne opóźnienie pozwala domknąć ostatni „skok” scrolla
        finalizeTimer = setTimeout(() => {
          this.finalizeAlign(textareaEditor, preview);
          finalizeTimer = null;
        }, 30);
      }
    });

    // — zwykła synchronizacja edytor → preview (zawsze włączona) —
    textareaEditor.addEventListener("scroll", () => {
      if (activeSource === "preview") return;
      activeSource = "editor";
      requestAnimationFrame(() => {
        const ratio =
          textareaEditor.scrollTop /
          (textareaEditor.scrollHeight - textareaEditor.clientHeight);
        preview.scrollTop =
          ratio * (preview.scrollHeight - preview.clientHeight);
        activeSource = null;
      });
    });

    // — synchronizacja preview → edytor: tylko dla myszy/touchpada, bez klawiatury —
    preview.addEventListener("scroll", () => {
      if (activeSource === "editor") return;
      if (skipPreviewSync) return; // podczas trzymania strzałek pomijamy

      activeSource = "preview";
      requestAnimationFrame(() => {
        const ratio =
          preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
        textareaEditor.scrollTop =
          ratio * (textareaEditor.scrollHeight - textareaEditor.clientHeight);
        activeSource = null;
      });
    });

    const markdownContent = fetch("sample-task.md");

    markdownContent
      .then((response) => response.text())
      .then((data) => {
        textareaEditor.value = data;
        textareaEditor.dispatchEvent(new Event("input"));
      });
  }

  static newTask(editorSection) {
    const subjectsOptions = SUBJECT_OPTIONS;
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
        options: subjectsOptions,
        name: "subject",
        id: "subject-select",
        required: true,
        layout: "row",
      },
    ];

    const form = RenderElements.renderForm(
      elementsInputs,
      "Dodaj nowe zadanie",
      (e) => {
        const textArea = editorSection.querySelector(
          "#task-editor-section textarea"
        );
        textArea.value = "";
        textArea.dispatchEvent(new Event("input"));
        textArea.focus();
        textArea.scrollIntoView({ behavior: "smooth" });
        textArea.setAttribute("data-subject", e.get("subject"));
        textArea.setAttribute("data-task-name", e.get("taskName"));
      },
      "row"
    );
    form.querySelector("#task-name-input").classList.add("w-full");
    form.querySelector("#subject-select").classList.add("w-full");
    form.querySelectorAll('[data-ui="input-wrapper"]').forEach((wrapper) => {
      wrapper.classList.add("w-full");
    });

    return form;
  }

  static taskFilters() {
    const filtersSection = document.createElement("section");
    filtersSection.id = "task-filters-section";

    const selectSubjectOptions = [
      { value: "", text: "Wybierz przedmiot" },
      { value: "all", text: "Wszystkie przedmioty" },
      { value: "aso", text: "Administracja Systemami Operacyjnymi" },
      { value: "so", text: "Systemy Operacyjne" },
      { value: "bd", text: "Bazy Danych" },
      { value: "pai", text: "Programowanie Aplikacji Internetowych" },
    ];
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

    const tasks = [
      {
        id: 1,
        name: "Konfiguracja Domeny Active Directory",
        subject: "aso",
        partName: "Active Directory",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task10.md",
      },
      {
        id: 2,
        name: "Zarządzanie Użytkownikami w Domenie",
        subject: "aso",
        partName: "Active Directory",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task9.md",
      },
      {
        id: 3,
        name: "Aliasy nazw domenowych DNS",
        subject: "aso",
        partName: "DNS",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task8.md",
      },
      {
        id: 4,
        name: "Tworzenie strefy DNS",
        subject: "aso",
        partName: "DNS",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task7.md",
      },
      {
        id: 5,
        name: "Instalacja systemu Linux",
        subject: "so",
        partName: "Linux",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task6.md",
      },
      {
        id: 6,
        name: "Zarządzanie uprawnieniami plików w Linux",
        subject: "so",
        partName: "Linux",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task5.md",
      },
      {
        id: 7,
        name: "Tworzenie bazy danych MySQL",
        subject: "bd",
        partName: "MySQL",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task4.md",
      },
      {
        id: 8,
        name: "Optymalizacja zapytań SQL",
        subject: "bd",
        partName: "MySQL",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task3.md",
      },
      {
        id: 9,
        name: "Tworzenie responsywnej strony internetowej",
        subject: "pai",
        partName: "Frontend",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task2.md",
      },
      {
        id: 10,
        name: "Obsługa formularzy w JavaScript",
        subject: "pai",
        partName: "Frontend",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task1.md",
      },
    ];

    selectSubject.querySelector("select").addEventListener("change", (e) => {
      const filterSubject = e.target.value;
      console.log(filterSubject);
      tasksList.innerHTML = "";
      const filteredTasks = tasks.filter((task) => {
        return filterSubject === "all" || task.subject === filterSubject;
      });

      if (filteredTasks.length === 0) {
        tasksList.textContent = "Brak zadań do wyświetlenia.";
        return;
      } else {
        tasksList.appendChild(this.renderTaskElement(filteredTasks));
      }
    });

    // Initial load of all tasks
    selectSubject.querySelector("select").dispatchEvent(new Event("change"));

    return filtersSection;
  }

  static renderTaskElement(tasks) {
    const tasksListTable = RenderElements.renderResponsiveTable(
      tasks.map((task) => [task.name, task.partName]),
      ["Nazwa zadania", "Rozdział"],
      false
    );

    const tableContainer = document.querySelector("#tasks-list-section");
    tableContainer.innerHTML = ""; // wyczyść stare
    tableContainer.appendChild(tasksListTable);

    tableContainer.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      if (!row) return;
      const index = [...tableContainer.querySelectorAll("tr")].indexOf(row);
      if (index === 0) return; // pomiń nagłówek

      const task = tasks[index - 1];
      const editorTextarea = document.querySelector(
        "#task-editor-section textarea"
      );
      fetch(task.link)
        .then((response) => response.text())
        .then((data) => {
          editorTextarea.value = data;
          editorTextarea.dispatchEvent(new Event("input"));
        });
    });

    return tasksListTable;
  }

 
}
