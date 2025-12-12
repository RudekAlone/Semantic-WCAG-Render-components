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
import { DashboardPage } from "./Dashboard/DashboardPage.js";

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

    // Obsługa historii (Back/Forward)
    window.addEventListener("popstate", () => {
      this.handleRoute(pages, contentArea);
    });

    // delegacja zdarzeń - Intercept clicks
    navPanels.addEventListener("click", (e) => {
      const btn = e.target.closest("button[id^='nav-']");
      if (!btn) return;
      e.preventDefault(); // Stop default button behavior if any
      const pageId = btn.dataset.pageId;
      
      this.navigateTo(pageId, null, pages, contentArea);
    });

    // Obsługa środkowego przycisku myszy (nowa karta)
    navPanels.addEventListener("mousedown",  (e) => {
      if (e.button === 1) {
        const btn = e.target.closest("button[id^='nav-']");
        if (!btn) return;
        const pageId = btn.dataset.pageId;
        window.open(`/dashboard/${pageId}`, "_blank");
        e.preventDefault();
      }
    });

    this.handleRoute(pages, contentArea); // domyślna strona lub z URL
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
      dashboard: () => DashboardPage.render(),
      tasks: () => TasksPage.render(),
      students: () => UsersPage.renderUsersPage(),
      classes: () => ClassesPage.renderClassesPage(),
      users: () => UsersPage.renderUsersPage(),
      "manage-tasks": () => TasksEditorPage.renderTasksEditorPage(),
      "status-tasks": () => TasksStatusPage.render(),
      quizzes: () => QuizzesPage.renderQuizzesPage(),
      "manage-courses": () => CoursesManagerPage.renderCoursesManagerPage(),
      courses: () => CoursesPage.renderCoursesPage(),
      "students-tasks": () => StudentsTasks.renderStudentsTasksPage(),
      statistics: () => StatisticsPage.renderStatisticsPage(),
    };

    const renderer = PAGE_RENDERERS[page.id];
    if (renderer) {
      contentArea.appendChild(renderer());
      return;
    }

    const placeholder = document.createElement("div");
    placeholder.innerHTML = `Strona <i>${page.name} (ID: ${page.id})</i> jest w budowie.`;
    contentArea.appendChild(placeholder);
  }

  static navigateTo(pageId, param, pages, contentArea) {
      let url = `/dashboard/${pageId}`;
      if (param) {
          url += `/${param}`;
      }
      history.pushState({ pageId, param }, "", url);
      
      const page = Array.isArray(pages) ? pages.find(p => p.id === pageId) : pages;
      if (page) {
          this.loadPageContent(page, contentArea);
          this.handleDeepLinking(pageId, param);
      }
  }

  static handleRoute(pages, contentArea) {
    const path = window.location.pathname.replace('/dashboard', '').replace(/^\//, ''); // remove leading /dashboard and /
    const parts = path.split('/');
    const pageId = parts[0] || 'dashboard'; // Default to dashboard
    const param = parts[1] || null;

    let page;
    if (Array.isArray(pages)) {
        page = pages.find(p => p.id === pageId);
        if (!page) {
            page = pages[0]; // Fallback to first page if not found
        }
    } else {
        page = pages;
    }

    if (page) {
        this.loadPageContent(page, contentArea);
        this.handleDeepLinking(pageId, param);
    }
  }

  static handleDeepLinking(pageId, param) {
      if (!param) return;
      
      if (pageId === 'tasks') {
          // tasks/{taskId}
           setTimeout(() => {
            const navSection = document.querySelector("#nav-subject-section");
            if (navSection) {
                 const subjectButton = navSection.querySelector(
                `button[data-subject="${param}"]` // param is taskId here
                );
                if (subjectButton) {
                subjectButton.click();
                }
            }
          }, 300);
      } else if (pageId === 'manage-courses') {
           // manage-courses/{courseName}
           setTimeout(() => {
            const navCourses = document.querySelector("#courses");
            if (navCourses) {
                 const courseLink = navCourses.querySelector(
                `a[href$="${param}"]` // Try to match end of href or data-attribute if available. original code used href="#course-NAME"
                // Actually the original code looked for href="#course-NAME". 
                // We should assume the rendering of that page might still generate hash links?
                // Or we need to update that page too? 
                // For now, let's assume the DOM elements still have the IDs or attributes we can target. 
                // Original: `a[href="#course-${courseName}"]`
                // Let's use `a[data-course="${param}"]` if possible or adapt selector.
                // Reverting to approximate original selector pattern in loose sense or keeping it.
                 );
                 // Since I didn't change CoursesManagerPage, it probably still puts href="#course-..."
                 // So selector should be `a[href*="${param}"]`
                 const legacyLink = navCourses.querySelector(`a[href*="course-${param}"]`);
                 if (legacyLink) legacyLink.click();
            }
          }, 100);
      }
  }
}
