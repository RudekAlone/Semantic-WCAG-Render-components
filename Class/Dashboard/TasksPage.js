import { RenderButton } from "../Render/RenderButton.js";
import { RenderDetails } from "../Render/RenderDetails.js";
import { RenderMarkdown } from "../RenderMarkdown.js";

import { SUBJECT_NAMES, STATUS_MAP, TASKS_DATA } from "./constants.js";

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

    const tasks = TASKS_DATA;

    // Wybór przedmiotu jeżeli jest ich więcej niż jeden
    const subjects = [...new Set(tasks.map((task) => task.subject))];
    if (subjects.length > 1) {
      const subjectOptions = subjects.map((s) => ({
        value: s,
        text: SUBJECT_NAMES[s] || s,
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
              this.renderTaskListElements(filteredTasks, taskPreviewSection)
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

    return tasksPage;
  }

  /**
   * Renderuje listę zadań pogrupowaną wg statusu.
   *
   * @static
   * @param {Array} tasks Tablica obiektów zadań
   * @param {HTMLElement} previewSection Sekcja podglądu Markdown
   * @returns {HTMLElement} kontener z sekcjami zadań
   */
  static renderTaskListElements(tasks, previewSection) {
    const grouped = { ongoing: [], completed: [], overdue: [] };
    tasks.forEach((task) => {
      const status = STATUS_MAP[task.status]?.target || "completed";
      grouped[status].push(task);
    });

    const container = document.createElement("div");
    Object.entries(grouped).forEach(([key, list]) => {
      if (list.length > 0) {
        const label = STATUS_MAP[list[0].status]?.label || "Zadania";
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
