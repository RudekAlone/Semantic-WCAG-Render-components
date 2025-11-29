import { RenderButton } from "./Render/RenderButton.js";

// Dashboard Pages imports
import { TasksPage } from "./Dashboard/TasksPage.js";
import { UsersPage } from "./Dashboard/UsersPage.js";
import { ClassesPage } from "./Dashboard/ClassesPage.js";
import { TasksEditorPage } from "./Dashboard/TasksEditorPage.js";
import { TasksStatusPage } from "./Dashboard/TasksStatusPage.js";
import { QuizzesPage } from "./Dashboard/QuizzesPage.js";
import { CoursesManagerPage } from "./Dashboard/CoursesManagerPage.js";
import { CoursesPage } from "./Dashboard/CoursesPage.js";
import { StudentsTasks } from "./Dashboard/StudentsTasks.js";
import { StatisticsPage } from "./Dashboard/StatisticsPage.js";

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
      navPanels.appendChild(button);
    });

    // delegacja zdarzeń
    navPanels.addEventListener("click", (e) => {
      const btn = e.target.closest("button[id^='nav-']");
      if (!btn) return;
      const page = { id: btn.dataset.pageId };
      this.urlMapping(page, contentArea);
      this.loadPageContent(page, contentArea);
    });
    this.urlMapping(pages, contentArea); // domyślna strona
    return dashboard;
  }

  static createNavButton(page) {
    const button = RenderButton.renderButton(
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
      "manage-tasks": () => TasksEditorPage.render(),
      "tasks-status": () => TasksStatusPage.render(),
      quizzes: () => QuizzesPage.renderQuizzesPage(),
      "manage-courses": () => CoursesManagerPage.renderCoursesManagerPage(),
      "courses": () => CoursesPage.renderCoursesPage(),
      "students-tasks": () => StudentsTasks.renderStudentsTasksPage(),
      "statistics": () => StatisticsPage.renderStatisticsPage()
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

static urlMapping(pages, contentArea) {
  if (Array.isArray(pages)) {
    // jeśli przekazano listę stron, ustaw domyślną (np. pierwszą)
    if (pages.length > 0) {
      const hash = window.location.hash.replace("#", "");
      if(hash.includes("tasks-")){
        const taskId = hash.split("tasks-")[1];
        const page = { id: 'tasks' };
        this.loadPageContent(page, contentArea);
        // symuluj kliknięcie przycisku przedmiotu
  setTimeout(() => {
          const navSection = document.querySelector('#nav-subject-section');
        const subjectButton = navSection.querySelector(`button[data-subject="${taskId}"]`);
        if(subjectButton){
          subjectButton.click();
        }
      }, 100);
        return;
      } else if(hash.includes("course-")){
        const courseName = hash.split("course-")[1];
        const page = { id: 'manage-courses' };
        this.loadPageContent(page, contentArea);
        // symuluj kliknięcie przycisku przedmiotu
  setTimeout(() => {
          const navCourses = document.querySelector('#courses');
        const courseLink = navCourses.querySelector(`a[href="#course-${courseName}"]`);
        if(courseLink){
          courseLink.click();
        }
      }, 100);
        return;
      }
      const page = pages.find(p => p.id === hash)
      let defaultPage;
      if (page) {
        this.loadPageContent(page, contentArea);
        window.location.hash = `#${page.id}`;
        return;
      }else{
       defaultPage = pages[0];
      }
      this.loadPageContent(defaultPage, contentArea);
      window.location.hash = `#${defaultPage.id}`;
    }
  } else {
    // jeśli przekazano pojedynczą stronę
    this.loadPageContent(pages, contentArea);
    window.location.hash = `#${pages.id}`;
  }
}


}
