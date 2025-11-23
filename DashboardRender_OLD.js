import { RenderElements } from "./RenderElements.js";
import { RenderMarkdown } from "./RenderMarkdown.js";

import { MarkdownExtenders } from "./MarkdownExtenders.js";

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
      case "tasks":
        contentArea.appendChild(this.renderTasksManagement());
        break;
      // Add cases for other pages as needed
      case "students":
        contentArea.appendChild(this.renderUserManagement(false));
        break;
      case "classes":
        contentArea.appendChild(this.renderClassesPage());
        break;
      case "users":
        contentArea.appendChild(this.renderUserManagement());
        break;
      case "manage-tasks":
        contentArea.appendChild(this.renderTasksEditorManagement());
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
    if (isAdmin) {
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
      const roleOptions = [
        { value: "student", text: "Uczeń" },
        { value: "teacher", text: "Nauczyciel" },
        { value: "admin", text: "Administrator" },
      ];
      form.appendChild(
        RenderElements.selectInputOptions(
          "Rola konta",
          roleOptions,
          "accountRole",
          "account-role",
          true,
          "row"
        )
      );

      const classOptions = [
        { value: "1A", text: "1A" },
        { value: "2B", text: "2B" },
        { value: "3C", text: "3C" },
      ];
      form.appendChild(
        RenderElements.selectInputOptions(
          "Przypisana klasa",
          classOptions,
          "assignedClass",
          "assignedClass",
          true,
          "row"
        )
      );

      const submitButton = RenderElements.renderButton(
        "Dodaj użytkownika",
        "primary"
      );
      form.appendChild(submitButton);

      const details = RenderElements.renderDetailsSummary(
        "Dodawanie nowego użytkownika",
        form
      );
      content.appendChild(details);

      if (window.innerWidth > 600) {
        details.open = true;
      }
    }
    const sectionOptionsLoad = document.createElement("section");
    sectionOptionsLoad.id = "user-list-section";

    const optionsLoad = [
      { vale: "admins", text: "Załaduj administratorów" },
      { vale: "teachers", text: "Załaduj nauczycieli" },
      { vale: "1A", text: "Załaduj klasę 1A" },
      { vale: "2B", text: "Załaduj klasę 2B" },
      { vale: "3C", text: "Załaduj klasę 3C" },
    ];
    if (!isAdmin) {
      optionsLoad.splice(0, 2); // remove first two elements
    }

    const data = [
      [1, "Jan", "Kowalski", "Nowak", "jkowalski001", "🧑🏻‍🎓 Uczeń"],
      [2, "Anna", "Maria", "Wiśniewska", "awisniewska002", "🧑🏻‍🏫 Nauczyciel"],
      [3, "Piotr", "-", "Zieliński", "pzielinski003", "🤖 Administrator"],
    ];

    const selectLoad = RenderElements.selectInputOptions(
      "Wybierz użytkowników do załadowania",
      optionsLoad,
      "loadUsers",
      "load-users",
      true,
      "row"
    );
    sectionOptionsLoad.appendChild(selectLoad);
    selectLoad.appendChild(
      RenderElements.renderButton(
        "Załaduj tabelę",
        "secondary",
        "button",
        () => {
          this.loadUserDataTable(data, isAdmin, sectionOptionsLoad);
        }
      )
    );
    selectLoad.classList.add("mr-10");
    content.appendChild(sectionOptionsLoad);

    userManagement.appendChild(content);
    return userManagement;
  }

  static loadUserDataTable(data, isAdmin, parentSection) {
    const headers = [
      "ID",
      "Imię",
      "Drugie imię",
      "Nazwisko",
      "Login",
      "Rola",
      "Reset hasła",
    ];
    console.log(data, headers);
    data.forEach((row) => {
      if (row.length === headers.length) {
        row.pop();
      }
      if (row[5].includes("Uczeń") || row[5].includes("Nauczyciel")) {
        row.push({
          type: "button",
          label: "Resetuj hasło",
          buttonStyle: "tertiary",
        });
      } else if (isAdmin) {
        row.push({
          type: "button",
          label: "Resetuj hasło",
          buttonStyle: "quaternary",
        });
      } else {
        row.push("Brak uprawnień");
      }
    });

    if (isAdmin) {
    }
    const userListTable = RenderElements.renderResponsiveTable(
      data,
      headers,
      false
    );

    const sectionTable = document.createElement("section");
    sectionTable.id = "user-list-table-section";
    sectionTable.appendChild(userListTable);
    parentSection.querySelector(".table-container")?.remove();
    parentSection.appendChild(sectionTable);
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
    const subjectsOptions = [
      { value: "aso", text: "Administracja Systemami Operacyjnymi" },
      { value: "so", text: "Systemy Operacyjne" },
      { value: "bd", text: "Bazy Danych" },
      { value: "pai", text: "Programowanie Aplikacji Internetowych" },
    ];
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

  static renderClassesPage() {
    const classesPage = document.createElement("section");
    classesPage.id = "classes-page";

    const title = document.createElement("h2");
    title.textContent = "Zarządzanie klasami";
    classesPage.appendChild(title);

    const content = document.createElement("section");

    const classElements = [
      {
        label: "Nazwa klasy",
        name: "className",
        id: "class-name-input",
        type: "text",
        role: "textbox",
        required: true,
      },
      {
        label: "Rok szkolny",
        name: "schoolYear",
        id: "school-year-input",
        type: "number",
        role: "textbox",
        required: true,
      },
    ];

    const addNewClassForm = RenderElements.renderForm(
      classElements,
      "Dodaj nową klasę",
      (e) => {
        console.log("Dodano klasę:", e);
      },
      "row"
    );

    content.appendChild(addNewClassForm);
    classesPage.appendChild(content);

    addNewClassForm.querySelector("#school-year-input").value =
      new Date().getFullYear();

    const tableClassesData = [
      [1, "1A", 2024, 25],
      [2, "2B", 2024, 22],
      [3, "3C", 2024, 20],
    ];

    tableClassesData.forEach((row) => {
      row[1] = {
        type: "text",
        value: row[1],
      };
      row[2] = {
        type: "number",
        value: row[2],
      };
      row.push({
        type: "button",
        label: "Zastosuj zmiany",
        buttonStyle: "tertiary",
      });
      row.push({
        type: "button",
        label: "Usuń klasę",
        buttonStyle: "quaternary",
      });
    });

    const classesTable = RenderElements.renderResponsiveTable(
      tableClassesData,
      ["ID", "Nazwa klasy", "Rok szkolny", "Liczba uczniów", "Zarządzaj"],
      false,
      this.rebrandTableClasses.bind(this)
    );

    content.appendChild(classesTable);

    return classesPage;
  }

  static rebrandTableClasses(classesTable) {
    const headers = classesTable.querySelectorAll("th");
    headers[headers.length - 1].colSpan = 2;

    classesTable.querySelectorAll("tr").forEach((tr) => {
      const applyButton = tr.querySelector("button.bg-tertiary");
      if (!applyButton) return;

      applyButton.disabled = true;
      tr.children[1].addEventListener("input", (e) => {
        applyButton.disabled = false;
      });

      tr.children[2].addEventListener("input", (e) => {
        applyButton.disabled = false;
      });
      const deleteButton = tr.querySelector("button.bg-quaternary");
      if (!deleteButton) return;

      deleteButton.disabled = false;
      deleteButton.addEventListener("click", (e) => {
        console.log("Usuń klasę:", tr.children[1].textContent);
      });
    });
  }

  static renderTasksManagement() {
    // Implementacja strony zarządzania zadaniami
    // Podział na dwie sekcje: lista zadań i podgląd wybranego zadania ładowane z raw.githubusercontent.com markdown
    // lewa sekcja to podzielone na przedmioty listy zadań oznaczone ikonami stanu (🟢, 🟡, 🔴) i małym opisem stanu
    // Przedmioty to: ASO, SO, BD, PAI

    const tasksPage = document.createElement("section");
    tasksPage.id = "tasks-page";

    const tasksHubSection = document.createElement("section");
    tasksHubSection.id = "tasks-hub-page";

    const title = document.createElement("h2");
    title.textContent = "Twoje zadania";
    tasksPage.appendChild(title);

    const navSubjectSection = document.createElement("nav");
    navSubjectSection.id = "nav-subject-section";    

    const listTasksSection = document.createElement("section");
    listTasksSection.id = "list-tasks-section";
    tasksHubSection.appendChild(listTasksSection);

    const taskPreviewSection = document.createElement("section");
    taskPreviewSection.id = "task-preview-section";
    taskPreviewSection.classList.add("preview-markdown");
    tasksHubSection.appendChild(taskPreviewSection);

    tasksPage.appendChild(navSubjectSection);
    tasksPage.appendChild(tasksHubSection);


    const tasks = [
      {
        id: 1,
        name: "Konfiguracja Domeny Active Directory",
        subject: "aso",
        status: "1",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task10.md",
        deadline: "2024-05-20",
      },
      {
        id: 2,
        name: "Sortowanie i filtrowanie danych w SQL",
        subject: "bd",
        status: "1",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task7.md",
        deadline: "2024-06-15",
      },
      {
        id: 3,
        name: "Aliasy nazw domenowych DNS",
        subject: "aso",
        status: "-1",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task8.md",
        deadline: "2026-05-10",
      },
      {
        id: 4,
        name: "Zarządzanie Użytkownikami w Domenie",
        subject: "aso",
        status: "0",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task9.md",
        deadline: "2026-05-25",
      },
      {
        id: 5,
        name: "Tworzenie bazy danych MySQL",
        subject: "bd",
        status: "0",
        link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task4.md",
        deadline: "2026-06-15",
      },
    ];

    // Wybór przedmiotu jeżeli jest ich więcej niż jeden
    const subjects = [...new Set(tasks.map((task) => task.subject))];
    if (subjects.length > 1) {
      const subjectOptions = subjects.map((subject) => {
        let subjectName = "";
        switch (subject) {
          case "aso":
            subjectName = "Administracja Systemami Operacyjnymi";
            break;
          case "so":
            subjectName = "Systemy Operacyjne";
            break;
          case "bd":
            subjectName = "Bazy Danych";
            break;
          case "pai":
            subjectName = "Programowanie Aplikacji Internetowych";
            break;
          default:
            subjectName = subject;
        }
        return { value: subject, text: subjectName };
      });

      subjectOptions.forEach((option) => {
        const button = RenderElements.renderButton(option.text, "secondary", "button",() => {
          const filteredTasks = tasks.filter(
            (task) => task.subject === option.value
          );
          listTasksSection.innerHTML = "";
          const buttons = navSubjectSection.querySelectorAll("button");
          buttons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          // set url as #subject-value
          history.replaceState(
            null,
            "",
            window.location.pathname + `#zadania-${option.value}`
          );

          listTasksSection.appendChild(
            this.renderTaskListElements(filteredTasks, taskPreviewSection)
          );
        });
        button.dataset.subject = option.value;
        navSubjectSection.appendChild(button);
      });

    }

    // Initial load
    const hash = window.location.hash;
    let initialSubject = subjects[0];
    

    if (hash.startsWith("#zadania-")) {
      initialSubject = hash.replace("#zadania-", "");
      const button = navSubjectSection.querySelector("button[data-subject='" + initialSubject + "']");
      if (button) {
        button.click();
      }else {
        navSubjectSection.querySelector("button")?.click();
      }
    }else {
      navSubjectSection.querySelector("button")?.click();
    }

    return tasksPage;
  }

  static renderTaskListElements(tasks, previewSection) {
    let ongoingTasks = [];
    let completedTasks = [];
    let overdueTasks = [];

    tasks.forEach((task) => {
      if (task.status === "0") {
        ongoingTasks.push(task);
      } else if (task.status === "-1") {
        overdueTasks.push(task);
      } else {
        completedTasks.push(task);
      }
    });


    const ulOngoing = document.createElement("ul");
    ongoingTasks.forEach((task) => {
      const li = document.createElement("li");
         const taskName = document.createElement("p");
      taskName.textContent = task.name;
      li.appendChild(taskName);
      const taskDeadline = document.createElement("p");
      const smallDeadline = document.createElement("small");
      smallDeadline.textContent = ` Termin: ${task.deadline}`;
      taskDeadline.appendChild(smallDeadline);
      li.appendChild(taskDeadline);
      li.addEventListener("click", () => {
        fetch(task.link)
          .then((response) => response.text())
          .then((data) => {
            previewSection.innerHTML = "";
            RenderMarkdown.renderMarkdownPreview(previewSection, data);
          });
      });
      ulOngoing.appendChild(li);
    });

    const ongoingDetail = RenderElements.renderDetailsSummary(
      "🟡 Zadania trwające",
      ulOngoing
    );
    ongoingDetail.open = true;
    ongoingDetail.appendChild(ulOngoing);

    const ulCompleted = document.createElement("ul");
    completedTasks.forEach((task) => {
      const li = document.createElement("li");
          const taskName = document.createElement("p");
      taskName.textContent = task.name;
      li.appendChild(taskName);
      const taskDeadline = document.createElement("p");
      const smallDeadline = document.createElement("small");
      smallDeadline.textContent = ` Termin: ${task.deadline}`;
      taskDeadline.appendChild(smallDeadline);
      li.appendChild(taskDeadline);
      li.addEventListener("click", () => {
        fetch(task.link)
          .then((response) => response.text())
          .then((data) => {
            previewSection.innerHTML = "";
            RenderMarkdown.renderMarkdownPreview(previewSection, data);
          });
      });
      ulCompleted.appendChild(li);
    });
    const completedDetail = RenderElements.renderDetailsSummary(
      "🟢 Zadania ukończone",
      ulCompleted
    );
    completedDetail.appendChild(ulCompleted);

    const ulOverdue = document.createElement("ul");
    overdueTasks.forEach((task) => {
      const li = document.createElement("li");


      const taskName = document.createElement("p");
      taskName.textContent = task.name;
      li.appendChild(taskName);
      const taskDeadline = document.createElement("p");
      const smallDeadline = document.createElement("small");
      smallDeadline.textContent = ` Termin: ${task.deadline}`;
      taskDeadline.appendChild(smallDeadline);
      li.appendChild(taskDeadline);

      li.addEventListener("click", () => {
        fetch(task.link)
          .then((response) => response.text())
          .then((data) => {
            previewSection.innerHTML = "";
            RenderMarkdown.renderMarkdownPreview(previewSection, data);
          });
      });
      ulOverdue.appendChild(li);
    });
    const overdueDetail = RenderElements.renderDetailsSummary(
      "🔴 Zadania przeterminowane",
      ulOverdue
    );
    overdueDetail.appendChild(ulOverdue);

    const container = document.createElement("div");
    if (ongoingTasks.length > 0) {
      container.appendChild(ongoingDetail);
    }
    if (overdueTasks.length > 0) {
      container.appendChild(overdueDetail);
    }
    if (completedTasks.length > 0) {
      container.appendChild(completedDetail);
    }
    return container;
  }
}
