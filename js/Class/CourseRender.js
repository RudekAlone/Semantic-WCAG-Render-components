import { UIFacade } from "./UIFacade.js";
import { RenderMarkdown } from "./RenderMarkdown.js";
export class CourseRender {
  static render(courseName) {
    const main = document.querySelector("main");
    main.innerHTML = "";
    main.className = ""; // Reset classes
    main.classList.add("course-page");

    fetch(
      `https://raw.githubusercontent.com/Edu-Koala-V/Courses/refs/heads/main/${courseName}/Pages/_index.md`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Failed to fetch _index.md");
        }
      })
      .then((data) => {
        main.appendChild(this.renderModuleMenu(data));
        const lessonPage = document.createElement("section");
        lessonPage.id = "course-lesson-content";
        main.appendChild(lessonPage);

        const lessonContentNav = document.createElement("section");
        lessonContentNav.id = "course-lesson-content-nav";
        main.appendChild(lessonContentNav);

        this.lessonItemEventListener(courseName, lessonContentNav);
      })
      .catch((error) => {
        console.error("Error fetching _index.md:", error);
      });
  }

  // Przykładowy format pliku _index.md:

  // # Lekcja

  // ## Moduł

  // ### Grupa details summary

  // - lekcja do powyższej grupy details sumary

  // - lekcja do powyższej grupy details sumary
  // - lekcja do powyższej grupy details sumary

  // ### Nowa grupa details summary
  // - lekcja do powyższej grupy details sumary

  // ## Kolejny moduł

  // # kolejna lekcja

  // # kolejna lekcja

  static renderModuleMenu(data) {
    const menu = document.createElement("nav");
    menu.classList.add("module-menu");

    const ul = document.createElement("ul");
    menu.appendChild(ul);

    let currentDetails = null;
    let moduleIndex = -1;
    data.split("\n").forEach((line) => {
      line = line.trim();

      const moduleMatch = line.match(/^##\s+(.+)$/);
      const lessonMatch = line.match(/^#\s+(.+)$/);
      const detailsMatch = line.match(/^###\s+(.+)$/);
      const lessonItemMatch = line.match(/^-+\s+(.+)$/);

      if (moduleMatch) {
        const moduleName = moduleMatch[1].trim();
        const moduleLi = document.createElement("li");
        moduleLi.textContent = moduleName;
        moduleLi.classList.add("module");
        ul.appendChild(moduleLi);
        moduleIndex += 1;
        currentDetails = null; // reset
      } else if (lessonMatch) {
        const lessonName = lessonMatch[1].trim();
        const lessonLi = document.createElement("li");
        lessonLi.textContent = lessonName;
        lessonLi.classList.add("lesson");
        lessonLi.setAttribute("tabindex", "0");
        lessonLi.dataset.moduleIndex = moduleIndex;
        ul.appendChild(lessonLi);
      } else if (detailsMatch) {
        const detailsName = detailsMatch[1].trim();
        const detailsLi = document.createElement("li");

        const detailsElement = UIFacade.createDetails(
          detailsName,
          document.createElement("div")
        );

        const detailsUl = document.createElement("ul");
        detailsElement.appendChild(detailsUl);
        detailsLi.appendChild(detailsElement);
        ul.appendChild(detailsLi);
        currentDetails = detailsUl;
      } else if (lessonItemMatch) {
        const itemName = lessonItemMatch[1].trim();
        const itemLi = document.createElement("li");
        itemLi.textContent = itemName;
        itemLi.classList.add("lesson-item");
        itemLi.setAttribute("tabindex", "0");
        if (currentDetails) {
          currentDetails.appendChild(itemLi);
        } else {
          ul.appendChild(itemLi);
        }
      }
    });

    return menu;
  }

  static lessonItemEventListener(courseName, lessonContentNav) {
    const lessonItems = document.querySelectorAll(".lesson-item, .lesson");
    lessonItems.forEach((item) => {
      item.addEventListener("click", () => {
        let lessonPage = item.textContent.trim();
        const lessonModule = item.dataset.moduleIndex;
        if (lessonModule >= 0) {
          lessonPage = `Moduł ${lessonModule}/${lessonPage}`;
        }
        this.renderLessonContent(courseName, lessonPage, lessonContentNav);
      });
      item.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const lessonPage = item.textContent.trim();
          this.renderLessonContent(courseName, lessonPage, lessonContentNav);
        }
      });
    });
  }

  static renderLessonContent(courseName, lessonPage, lessonContentNav) {
    const content = document.querySelector("#course-lesson-content");
    fetch(
      `https://raw.githubusercontent.com/Edu-Koala-V/Courses/refs/heads/main/${courseName}/Pages/${lessonPage}.md`,
      { method: "GET" }
    )
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Failed to fetch lesson page");
        }
      })
      .then((data) => {
        RenderMarkdown.renderMarkdownPreview(content, data);

        // Ensure DOM is updated before creating navigation
        requestAnimationFrame(() => {
          this.createNavLesson(content, lessonContentNav);
        });
      })
      .catch((error) => {
        console.error("Error fetching lesson page:", error);
      });
  }

  static createNavLesson(lessonContentHTML, navSection) {
    if (!navSection) return;
    const headings = lessonContentHTML.querySelectorAll("h1, h2, h3");
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    nav.appendChild(ul);
    headings.forEach((heading) => {
      const li = document.createElement("li");
      li.textContent = heading.textContent;
      li.classList.add(`nav-${heading.tagName.toLowerCase()}`);
      ul.appendChild(li);
      li.addEventListener("click", () => {
        heading.scrollIntoView({ behavior: "smooth" });
      });
    });
    navSection.innerHTML = "";
    navSection.appendChild(nav);
  }
}
