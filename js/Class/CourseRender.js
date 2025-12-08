import { UIFacade } from "./UIFacade.js";
export class CourseRender {
  static render(courseName) {
    const main = document.querySelector("main");
    main.innerHTML = "";
    

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
      currentDetails = null; // reset
    } else if (lessonMatch) {
      const lessonName = lessonMatch[1].trim();
      const lessonLi = document.createElement("li");
      lessonLi.textContent = lessonName;
      lessonLi.classList.add("lesson");
      lessonLi.setAttribute("tabindex", "0");
      ul.appendChild(lessonLi);
    } else if (detailsMatch) {
      const detailsName = detailsMatch[1].trim();
      const detailsLi = document.createElement("li");

      const detailsElement = UIFacade.createDetails(detailsName, document.createElement("div"));

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

}
