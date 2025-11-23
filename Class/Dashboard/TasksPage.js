import { RenderElements } from "../RenderElements.js";
import { RenderMarkdown } from "../RenderMarkdown.js";


import {
  SUBJECT_NAMES,
  STATUS_MAP,
} from "./constants.js";

export class TasksPage {
    static render() {
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
        const button = RenderElements.renderButton(
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
              window.location.pathname + `#zadania-${option.value}`
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

  static renderTaskList(tasks, previewSection, label) {
  const ul = document.createElement("ul");
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p>${task.name}</p>
      <p><small>Termin: ${task.deadline}</small></p>
    `;
    li.addEventListener("click", () => {
      fetch(task.link)
        .then((res) => res.text())
        .then((data) => {
          previewSection.innerHTML = "";
          RenderMarkdown.renderMarkdownPreview(previewSection, data);
        });
    });
    ul.appendChild(li);
  });

  const detail = RenderElements.renderDetailsSummary(label, ul);
  detail.appendChild(ul);
  return detail;
}


}