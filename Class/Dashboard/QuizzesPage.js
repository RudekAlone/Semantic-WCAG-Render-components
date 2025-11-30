import { UIFacade } from "../UIFacade.js";
import { DataService } from "../Service/DataService.js";

export class QuizzesPage {
  static renderQuizzesPage() {
    const container = document.createElement("section");
    container.id = "quizzes-page";

    const title = document.createElement("h2");
    title.textContent = "Quizzes";

    const contentContainer = document.createElement("div");
    contentContainer.id = "quizzes-content-container";
    contentContainer.innerHTML = '<div class="loader">Ładowanie quizów...</div>';
    
    container.appendChild(title);
    container.appendChild(contentContainer);

    this._loadDataAndRender(contentContainer);

    return container;
  }

  static async _loadDataAndRender(container) {
      try {
          const quizzesGroup = await DataService.getQuizzesGroup();
          
          container.innerHTML = ""; // Clear loader

          const navbar = document.createElement("nav");
          navbar.id = "quizzes-navbar";
      
          const content = document.createElement("section");
          content.id = "quizzes-content";
      
          container.appendChild(navbar);
          container.appendChild(content);
      
          this.navGroupQuizzes(navbar, content, quizzesGroup);

      } catch (error) {
          console.error("Błąd ładowania quizów:", error);
          container.innerHTML = '<p class="error">Nie udało się pobrać grup quizów.</p>';
      }
  }

  static navGroupQuizzes(navContainer, contentContainer, data) {
    data.forEach((group) => {
      const navButton = UIFacade.createButton(group.text, "tertiary", "button", async () => {
       contentContainer.innerHTML = '<div class="loader">Ładowanie pytań...</div>';
       
       try {
           const quizData = await DataService.getQuizData(group.value);
           contentContainer.innerHTML = ""; // Clear loader
           contentContainer.appendChild(UIFacade.createQuiz(quizData));
       } catch (error) {
           console.error("Błąd ładowania pytań:", error);
           contentContainer.innerHTML = '<p class="error">Nie udało się pobrać pytań.</p>';
       }
      });
      navContainer.appendChild(navButton);
    });
  }
}