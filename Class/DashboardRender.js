import { RenderElements } from "./RenderElements.js";

// Dashboard Pages imports
import { TasksPage } from "./Dashboard/TasksPage.js";
import { UsersPage } from "./Dashboard/UsersPage.js";
import { ClassesPage } from "./Dashboard/ClassesPage.js";
import { TasksEditorPage } from "./Dashboard/TasksEditorPage.js";
import { TasksStatusPage } from "./Dashboard/TasksStatusPage.js";

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
      "manage-tasks": () => TasksEditorPage.render(),
      "tasks-status": () => TasksStatusPage.render(),
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

 

  

 
}
