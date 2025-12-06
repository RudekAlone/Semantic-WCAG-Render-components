export class CourseRender {
  static render(courseName) {
    const main = document.querySelector("body");
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

  static renderModuleMenu(data) {
    const menu = document.createElement("nav");
    menu.classList.add("module-menu");
    
    const ul = document.createElement("ul");
    menu.appendChild(ul);

    let menuData = [];
    
    data.split("\n").forEach((line) => {
        line = line.trim(); // Add this line


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
            const moduleUl = document.createElement("ul");
            moduleLi.appendChild(moduleUl);
            menuData.push({ type: "module", element: moduleUl });
        } else if (lessonMatch) {
            const lessonName = lessonMatch[1].trim();
            const lessonLi = document.createElement("li");
            lessonLi.textContent = lessonName;
            lessonLi.classList.add("lesson");
            if (menuData.length > 0) {
                const currentModule = menuData[menuData.length - 1];
                if (currentModule.type === "module") {
                    currentModule.element.appendChild(lessonLi);
                } else {
                    ul.appendChild(lessonLi);
                }
            } else {
                ul.appendChild(lessonLi);
            }
        } else if (detailsMatch) {
            const detailsName = detailsMatch[1].trim();
            const detailsLi = document.createElement("li");
            const detailsElement = document.createElement("details");
            const summaryElement = document.createElement("summary");
            summaryElement.textContent = detailsName;
            summaryElement.classList.add("group");
            detailsElement.appendChild(summaryElement);
            const detailsUl = document.createElement("ul");
            detailsElement.appendChild(detailsUl);
            detailsLi.appendChild(detailsElement);
            if (menuData.length > 0) {
                const currentModule = menuData[menuData.length - 1];
                if (currentModule.type === "module") {
                    currentModule.element.appendChild(detailsLi);
                } else {
                    ul.appendChild(detailsLi);
                }
            } else {
                ul.appendChild(detailsLi);
            }
            menuData.push({ type: "details", element: detailsUl });
        } else if (lessonItemMatch) {
            const itemName = lessonItemMatch[1].trim();
            const itemLi = document.createElement("li");
            itemLi.textContent = itemName;
            itemLi.classList.add("lesson-item");
            if (menuData.length > 0) {
                const currentDetails = menuData[menuData.length - 1];
                if (currentDetails.type === "details") {
                    currentDetails.element.appendChild(itemLi);
                }
            }
        }

    });
    


    return menu;
  }
}
