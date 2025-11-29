import { UIFacade } from "../UIFacade.js";

import {
  DATA_QUIZZES_GROUP, 
  QUIZ_DATA_JS,
  QUIZ_DATA_CPP,
  QUIZ_DATA_UTK,
  QUIZ_DATA_SO,
QUIZ_DATA_PHP,
QUIZ_DATA_HTML,
 } from "./constants.js";

export class QuizzesPage {
  static renderQuizzesPage() {
    const container = document.createElement("section");
    container.id = "quizzes-page";

    const title = document.createElement("h2");
    title.textContent = "Quizzes";

    const navbar = document.createElement("nav");
    navbar.id = "quizzes-navbar";



    const content = document.createElement("section");
    content.id = "quizzes-content";


    container.appendChild(title);
    container.appendChild(navbar);
    container.appendChild(content);

    this.navGroupQuizzes(navbar, content, DATA_QUIZZES_GROUP);

    // content.appendChild(UIFacade.createQuiz(QUIZ_DATA));
    return container;
  }

  static navGroupQuizzes(navContainer, contentContainer, data) {


    data.forEach((group) => {
      const navButton = UIFacade.createButton(group.text, "tertiary", "button", () => {
       contentContainer.innerHTML = ""; // Clear previous content
        let quizData = [];
        switch (group.value) {
          case "js":
            quizData = QUIZ_DATA_JS;
            break;
          case "cpp":
            quizData = QUIZ_DATA_CPP;
          break;
          case "utk":
            quizData = QUIZ_DATA_UTK;
          break;
          case "so":
            quizData = QUIZ_DATA_SO;
          break;
          case "php":
            quizData = QUIZ_DATA_PHP;
          break;
          case "html":
            quizData = QUIZ_DATA_HTML;
          break;
          default:
            quizData = [];
        }
       contentContainer.appendChild(UIFacade.createQuiz(quizData));
      });
      navContainer.appendChild(navButton);
    });
  }
}