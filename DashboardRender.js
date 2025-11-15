import { RenderElements } from "./RenderElements.js";

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
      // Add cases for other pages as needed
      default:
        const placeholder = document.createElement("div");
        placeholder.innerHTML = `Strona <i>${page.name}</i> jest w budowie.`;
        contentArea.appendChild(placeholder);
    }
  }

  static renderDashboard() {
    const dashboard = document.createElement("div");
    dashboard.id = "dashboard-page";
    dashboard.textContent = "To jest strona Dashboard.";
    return dashboard;
  }
}
