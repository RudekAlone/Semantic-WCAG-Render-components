import { RenderButton } from "../Render/RenderButton.js";
import { RenderDetails } from "../Render/RenderDetails.js";
import { RenderMarkdown } from "../RenderMarkdown.js";
import { DataService } from "../Service/DataService.js";

/**
 * Klasa renderująca stronę zadań studenta.
 * Podział na listę zadań wg statusu (trwające, ukończone, przeterminowane)
 * oraz podgląd treści zadania w Markdown.
 */
export class TasksPage {
  /**
   * Renderuje całą stronę zadań.
   *
   * @static
   * @returns {HTMLElement} główny element sekcji zadań
   */
  static render() {
    const tasksPage = document.createElement("section");
    tasksPage.id = "tasks-page";

    const header = document.createElement("header");
    const title = document.createElement("h2");
    title.textContent = "Twoje zadania";
    header.appendChild(title);
    tasksPage.appendChild(header);

    const contentContainer = document.createElement("div");
    contentContainer.id = "tasks-content-container";
    contentContainer.innerHTML = '<div class="loader">Ładowanie zadań...</div>';
    tasksPage.appendChild(contentContainer);

    this._loadDataAndRender(contentContainer);

    return tasksPage;
  }

  /**
   * Pobiera dane i renderuje zawartość strony.
   * @param {HTMLElement} container
   */
  static async _loadDataAndRender(container) {
    try {
      const [tasks, subjectNames, statusMap] = await Promise.all([
        DataService.getTasks(),
        DataService.getSubjectNames(),
        DataService.getStatusMap()
      ]);

      container.innerHTML = ""; // Clear loader

      const tasksHubSection = document.createElement("section");
      tasksHubSection.id = "tasks-hub-page";

      const navSubjectSection = document.createElement("nav");
      navSubjectSection.id = "nav-subject-section";

      const listTasksSection = document.createElement("section");
      listTasksSection.id = "list-tasks-section";
      tasksHubSection.appendChild(listTasksSection);

      const taskPreviewSection = document.createElement("section");
      taskPreviewSection.id = "task-preview-section";
      taskPreviewSection.classList.add("preview-markdown");
      tasksHubSection.appendChild(taskPreviewSection);

      container.appendChild(navSubjectSection);
      container.appendChild(tasksHubSection);

      // Wybór przedmiotu jeżeli jest ich więcej niż jeden
      const subjects = [...new Set(tasks.map((task) => task.subject))];
      if (subjects.length > 1) {
        const subjectOptions = subjects.map((s) => ({
          value: s,
          text: subjectNames[s] || s,
        }));

        subjectOptions.forEach((option) => {
          const button = RenderButton.renderButton(
            option.text,
            "secondary",
            "button",
            () => {
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
                window.location.pathname + `#tasks-${option.value}`
              );

              listTasksSection.appendChild(
                this.renderTaskListElements(filteredTasks, taskPreviewSection, statusMap)
              );
            }
          );
          button.dataset.subject = option.value;
          navSubjectSection.appendChild(button);
        });
      }

      // Initial load
      const hash = window.location.hash;
      let initialSubject = subjects[0];

      if (hash.startsWith("#zadania-")) {
        initialSubject = hash.replace("#zadania-", "");
        const button = navSubjectSection.querySelector(
          "button[data-subject='" + initialSubject + "']"
        );
        if (button) {
          button.click();
        } else {
          navSubjectSection.querySelector("button")?.click();
        }
      } else {
        navSubjectSection.querySelector("button")?.click();
      }

    } catch (error) {
      console.error("Błąd ładowania zadań:", error);
      container.innerHTML = '<p class="error">Nie udało się pobrać listy zadań.</p>';
    }
  }

  /**
   * Renderuje listę zadań pogrupowaną wg statusu.
   *
   * @static
   * @param {Array} tasks Tablica obiektów zadań
   * @param {HTMLElement} previewSection Sekcja podglądu Markdown
   * @param {Object} statusMap Mapa statusów
   * @returns {HTMLElement} kontener z sekcjami zadań
   */
  static renderTaskListElements(tasks, previewSection, statusMap) {
    const grouped = { ongoing: [], completed: [], overdue: [] };
    tasks.forEach((task) => {
      const status = statusMap[task.status]?.target || "completed";
      if (grouped[status]) {
          grouped[status].push(task);
      } else {
          // Fallback if status is unknown
          grouped.completed.push(task);
      }
    });

    const container = document.createElement("div");
    Object.entries(grouped).forEach(([key, list]) => {
      if (list.length > 0) {
        // Find label for this target group (reverse lookup or simplified)
        // Since statusMap keys are "0", "1", "-1", we need to find which one maps to 'key'
        // But here we can just use hardcoded labels or find first match
        let label = "Zadania";
        if (key === 'ongoing') label = "🟡 Zadania trwające";
        if (key === 'completed') label = "🟢 Zadania ukończone";
        if (key === 'overdue') label = "🔴 Zadania przeterminowane";
        
        container.appendChild(this.renderTaskList(list, previewSection, label));
      }
    });
    return container;
  }

  /**
   * Generuje sekcję z listą zadań i obsługą kliknięcia (ładowanie Markdown do podglądu).
   *
   * @static
   * @param {Array} tasks Tablica obiektów zadań
   * @param {HTMLElement} previewSection Sekcja podglądu Markdown
   * @param {string} label Etykieta sekcji (np. "🟡 Zadania trwające")
   * @returns {HTMLElement} element <details> z listą zadań
   */
  static renderTaskList(tasks, previewSection, label) {
    const ul = document.createElement("ul");

    // delegacja zdarzeń zamiast listenera na każdym li
    ul.addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      const index = Array.from(ul.children).indexOf(li);
      const task = tasks[index];
      fetch(task.link)
        .then((res) => res.text())
        .then((data) => {
          previewSection.innerHTML = "";
          RenderMarkdown.renderMarkdownPreview(previewSection, data);
        });
    });

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <p>${task.name}</p>
        <p><small>Termin: ${task.deadline}</small></p>
      `;
      ul.appendChild(li);
    });

    const detail = RenderDetails.renderDetailsSummary(label, ul);
    return detail;
  }
}
