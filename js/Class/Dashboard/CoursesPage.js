import { UIFacade } from "../UIFacade.js";
import { DataService } from "../Service/DataService.js";

export class CoursesPage {
  static renderCoursesPage() {
    const container = document.createElement("section");
    container.id = "courses-page";
    const title = document.createElement("h2");
    title.textContent = "Dostępne kursy";
    container.appendChild(title);

    const contentContainer = document.createElement("div");
    contentContainer.id = "courses-content-container";
    contentContainer.innerHTML = '<div class="loader">Ładowanie kursów...</div>';
    container.appendChild(contentContainer);

    this._loadDataAndRender(contentContainer);

    return container;
  }

  static async _loadDataAndRender(container) {
      try {
          const coursesData = await DataService.getCourses();
          
          container.innerHTML = ""; // Clear loader

          const coursesList = document.createElement("ul");
          coursesList.className = "courses-list";
      
          coursesData.forEach((course) => {
            const courseCard = UIFacade.createCourseCard(
              course.name,
              course.img, 
              `courses/${course.hash}`
            );
            coursesList.appendChild(courseCard);
          });
      
          container.appendChild(coursesList);

      } catch (error) {
          console.error("Błąd ładowania kursów:", error);
          container.innerHTML = '<p class="error">Nie udało się pobrać listy kursów.</p>';
      }
  }
}