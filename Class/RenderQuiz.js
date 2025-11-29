import { RenderButton } from "./Render/RenderButton.js";
import { RenderInput } from "./Render/RenderInput.js";
import { RenderDetails } from "./Render/RenderDetails.js";

export class RenderQuiz {
  /**
   * Dostosowuje układ quizu do urządzeń mobilnych.
   * Zmienia klasy CSS w zależności od szerokości okna przeglądarki.
   *
   * @param {HTMLElement} quizContainer - Główny kontener quizu.
   * @param {HTMLElement} quizSectionsLeft - Lewa sekcja quizu (pytania).
   * @param {HTMLElement} quizSectionsRight - Prawa sekcja quizu (wyjaśnienia).
   */
  static responseQuizMobile(
    quizContainer,
    quizSectionsLeft,
    quizSectionsRight
  ) {
    if (window.innerWidth <= 768) {
      quizContainer.classList.remove("h-vh-full");
      quizSectionsLeft.classList.remove("w-60", "h-100");
      quizSectionsRight.classList.remove("w-40", "h-100");
      quizSectionsLeft.classList.add("w-full");
      quizSectionsRight.classList.add("w-full", "mt-20");
      quizSectionsLeft.parentElement.setAttribute("data-layout", "column");
    } else {
      quizContainer.classList.add("h-vh-full");
      quizSectionsLeft.classList.add("w-60", "h-100");
      quizSectionsRight.classList.add("w-40", "h-100");
      quizSectionsLeft.classList.remove("w-full");
      quizSectionsRight.classList.remove("w-full", "mt-20");
      quizSectionsLeft.parentElement.removeAttribute("data-layout");
    }
  }

  /**
   * Renderuje główny widok quizu.
   * Tworzy strukturę HTML dla quizu, w tym sekcje pytań i wyjaśnień.
   *
   * @param {Array<Object>} [questionData=null] - Tablica obiektów z pytaniami.
   * @returns {HTMLElement} Kontener z wyrenderowanym quizem.
   */
  static renderQuiz(questionData = null) {
    const quizContainer = document.createElement("section");
    quizContainer.classList.add(
      "quiz-container",
      "w-full",
      "h-vh-full",
      "bg-1",
      "pd-10"
    );

    // Nagłówek quizu
    const quizTitle = document.createElement("h2");
    quizTitle.classList.add("quiz-title");
    quizTitle.id = "quiz-title";
    quizTitle.textContent = "Quiz: Podstawy JavaScript";
    quizContainer.appendChild(quizTitle);

    // Landmark: region zamiast main
    quizContainer.setAttribute("role", "region");
    quizContainer.setAttribute("aria-labelledby", "quiz-title");

    // Lewa sekcja z pytaniami
    const quizSectionsLeft = document.createElement("div");
    quizSectionsLeft.classList.add(
      "quiz-sections",
      "flex",
      "w-60",
      "bg-2",
      "pd-10",
      "h-100"
    );
    quizSectionsLeft.setAttribute("data-layout", "column");

    // Prawa sekcja z wyjaśnieniami – jako aside
    const quizSectionsRight = document.createElement("aside");
    quizSectionsRight.classList.add(
      "quiz-sections",
      "flex",
      "w-40",
      "bg-2",
      "pd-10",
      "h-100"
    );
    quizSectionsRight.setAttribute("data-layout", "column");

    // Sekcja z nagłówkiem i wrapperem na komunikaty
    const exampleSection = document.createElement("section");
    exampleSection.setAttribute("aria-labelledby", "quiz-feedback-title");
    exampleSection.setAttribute("role", "region");

    const feedbackTitle = document.createElement("h3");
    feedbackTitle.id = "quiz-feedback-title";
    feedbackTitle.textContent = "Informacja zwrotna";
    exampleSection.appendChild(feedbackTitle);

    const exampleWrapper = document.createElement("div");
    exampleWrapper.classList.add("quiz-example-wrapper", "mb-20");
    exampleWrapper.setAttribute("role", "status");
    exampleWrapper.setAttribute("aria-live", "polite");

    const hiddenInit = document.createElement("span");
    hiddenInit.classList.add("visually-hidden");
    hiddenInit.textContent = "Brak komunikatów — odpowiedz na pytanie";
    exampleWrapper.appendChild(hiddenInit);

    exampleSection.appendChild(exampleWrapper);
    quizSectionsRight.appendChild(exampleSection);

    // Wrapper na obie sekcje
    const quizContentApplication = document.createElement("div");
    quizContentApplication.classList.add(
      "quiz-content-application",
      "flex",
      "gap-10",
      "w-full",
      "mt-20"
    );

    quizContentApplication.appendChild(quizSectionsLeft);
    quizContentApplication.appendChild(quizSectionsRight);
    quizContainer.appendChild(quizContentApplication);

    // Logika quizu
    this.quizManager(questionData, quizSectionsLeft, quizSectionsRight);

    // Responsywność
    window.addEventListener("resize", () => {
      this.responseQuizMobile(
        quizContainer,
        quizSectionsLeft,
        quizSectionsRight
      );
    });
    this.responseQuizMobile(quizContainer, quizSectionsLeft, quizSectionsRight);

    return quizContainer;
  }

  /**
   * Obsługuje logikę sprawdzania poprawnej odpowiedzi.
   * Wyświetla komunikat o sukcesie lub błędzie oraz blokuje możliwość zmiany odpowiedzi.
   *
   * @param {Object} questionData - Dane aktualnego pytania.
   * @returns {boolean} Zwraca true, jeśli odpowiedź jest poprawna, w przeciwnym razie false.
   */
  static handleCorrectAnswer(questionData) {
    const selectedOption = document.querySelector(
      '.quiz-sections input[type="radio"]:checked'
    );
    let isCorrect = false;

    const feedback = document.createElement("p");
    const feedbackTitle = document.getElementById("quiz-feedback-title");
    const wrapper = document.querySelector(".quiz-example-wrapper");
    wrapper.innerHTML = "";

    if (selectedOption.id.endsWith(`-${questionData.answer}`)) {
      selectedOption.parentElement.classList.add("correct");
      feedback.textContent = "✔ Brawo! Poprawna odpowiedź.";
      feedback.classList.add("correct-msg");
      if (feedbackTitle) feedbackTitle.textContent = "Gratulacje";
      isCorrect = true;
    } else {
      selectedOption.parentElement.classList.add("incorrect");
      feedback.textContent = "✘ Niepoprawna odpowiedź.";
      feedback.classList.add("incorrect-msg");
      if (feedbackTitle) feedbackTitle.textContent = "Wyjaśnienie";
    }
      feedback.setAttribute("role", "alert");

    wrapper.appendChild(feedback);

    document
      .querySelectorAll('.quiz-sections input[type="radio"]')
      .forEach((input) => {
        input.disabled = true;
      });

    // fokus na komunikat (dla klawiatury/AT)
    feedback.focus();

    return isCorrect;
  }

  /**
   * Zarządza przepływem quizu (nawigacja między pytaniami).
   * Obsługuje przycisk "Sprawdź odpowiedź" / "Następne pytanie".
   *
   * @param {Array<Object>} questions - Lista wszystkich pytań.
   * @param {HTMLElement} quizSectionsLeft - Kontener na pytania.
   * @param {HTMLElement} quizSectionsRight - Kontener na wyjaśnienia/przyciski.
   */
  static quizManager(questions, quizSectionsLeft, quizSectionsRight) {
    let incorrectAnswersIds = [];
    let currentQuestionIndex = 0;

    this.loadQuestion(
      quizSectionsLeft,
      questions[currentQuestionIndex],
      currentQuestionIndex
    );

    const nextButton = RenderButton.renderButton(
      "Sprawdź odpowiedź",
      "primary",
      "button",
      (e) => {
        const exampleWrapper = document.querySelector(".quiz-example-wrapper");
        if (e.target.textContent === "Sprawdź odpowiedź") {
          if (!this.validateCheckAnswer()) return;

          const isCorrect = this.handleCorrectAnswer(
            questions[currentQuestionIndex]
          );
          if (!isCorrect)
            incorrectAnswersIds.push(questions[currentQuestionIndex].id);

          if (!isCorrect && questions[currentQuestionIndex].explanationImg) {
            const img = document.createElement("img");
            img.src = questions[currentQuestionIndex].explanationImg;
            img.setAttribute("role", "img");
            img.setAttribute(
              "aria-label",
              questions[currentQuestionIndex].imgAlt ||
                "Ilustracja wyjaśniająca"
            );
            exampleWrapper.appendChild(img);
          }
          if (!isCorrect && questions[currentQuestionIndex].explanation) {
            const p = document.createElement("p");
            p.textContent = questions[currentQuestionIndex].explanation;
            exampleWrapper.appendChild(p);
          }

          if (currentQuestionIndex === questions.length - 1) {
            e.target.textContent = "Zakończ quiz";
          } else {
            e.target.textContent = "Następne pytanie";
          }
        } else if (e.target.textContent === "Następne pytanie") {
          currentQuestionIndex++;
          const feedbackTitle = document.getElementById("quiz-feedback-title");
          if (feedbackTitle) feedbackTitle.textContent = "Informacja zwrotna";

          this.loadQuestion(
            quizSectionsLeft,
            questions[currentQuestionIndex],
            currentQuestionIndex
          );
          e.target.textContent = "Sprawdź odpowiedź";
          exampleWrapper.innerHTML = "";
          setTimeout(() => {
            const legend = document.querySelector(".quiz-question-legend");
            if (legend) {
              legend.focus();
            }
          }, 10);
        } else if (e.target.textContent === "Zakończ quiz") {
          this.endQuizPage(incorrectAnswersIds, questions);
        }
      }
    );

    nextButton.classList.add("mr-10");
    quizSectionsRight.insertAdjacentElement("afterbegin", nextButton);
  }

  /**
   * Sprawdza, czy użytkownik zaznaczył jakąkolwiek odpowiedź.
   * Wyświetla alert, jeśli żadna opcja nie została wybrana.
   *
   * @returns {boolean} True jeśli odpowiedź została wybrana, false w przeciwnym razie.
   */
  static validateCheckAnswer() {
    const selectedOption = document.querySelector(
      '.quiz-sections input[type="radio"]:checked'
    );
    if (!selectedOption) {
      alert("Proszę wybrać odpowiedź przed przejściem dalej.");
      return false;
    }
    return true;
  }

  /**
   * Ładuje pojedyncze pytanie do kontenera.
   * Renderuje treść pytania, obrazek (jeśli istnieje) oraz opcje odpowiedzi.
   *
   * @param {HTMLElement} container - Kontener, do którego ma trafić pytanie.
   * @param {Object} questionData - Dane pytania.
   * @param {number} index - Indeks pytania.
   */
  static loadQuestion(container, questionData, index) {
    container.innerHTML = "";

    // Fieldset grupuje pytanie i odpowiedzi
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("quiz-question-fieldset", "mb-20");
    container.appendChild(fieldset);

    // Legend = treść pytania
    const legend = document.createElement("legend");
    legend.classList.add("quiz-question-legend", "mb-10");
    legend.textContent = questionData.question;
    fieldset.appendChild(legend);

    // Obrazek pytania (jeśli jest)
    if (questionData.img) {
      const imgElement = document.createElement("img");
      imgElement.src = questionData.img;
      imgElement.alt = questionData.imgAlt || "Ilustracja do pytania"; // opisowy alt
      imgElement.classList.add("quiz-question-image", "mb-10");
      fieldset.appendChild(imgElement);
    }

    // Ukryty hint dla grupy (dla AT)
    const groupHint = document.createElement("p");
    groupHint.id = `quiz-group-hint-${index}`;
    groupHint.classList.add("visually-hidden");
    groupHint.textContent = "Wybierz jedną odpowiedź";
    fieldset.appendChild(groupHint);

    // Opcje odpowiedzi
    questionData.options.forEach((option, i) => {
      const inputId = `quiz-option-${index}-${i}`;
      const name = `quiz-option-${index}`;

      // Twój RenderElements.renderInput zwraca wrapper z inputem
      const inputWrapper = RenderInput.renderInput(
        option,
        name,
        inputId,
        "radio",
        "radio",
        false,
        "row"
      );

      const input = inputWrapper.querySelector("input");
      input.setAttribute("aria-describedby", groupHint.id);

      // Label powiązany z inputem
      const label = document.createElement("label");
      label.classList.add("quiz-label-answer");
      label.setAttribute("for", inputId);

      label.appendChild(input);
      label.appendChild(document.createTextNode(option));

      fieldset.appendChild(label);
    });
  }

  /**
   * Wyświetla ekran końcowy quizu z podsumowaniem wyników.
   * Pokazuje listę błędnych odpowiedzi wraz z poprawnymi rozwiązaniami i wyjaśnieniami.
   *
   * @param {Array<string>} incorrectAnswersIds - Tablica ID pytań, na które udzielono błędnej odpowiedzi.
   * @param {Array<Object>} questions - Lista wszystkich pytań.
   */
  static endQuizPage(incorrectAnswersIds, questions) {
    const quizContainer = document.querySelector(".quiz-container");
    quizContainer.innerHTML = "";

    const h2 = document.createElement("h2");
    h2.textContent = "Koniec quizu";
    h2.setAttribute("role", "status");
    h2.setAttribute("aria-live", "polite");
    h2.setAttribute("tabindex", "-1");
    h2.focus();

    quizContainer.appendChild(h2);

    const exampleEndPageWrapper = document.createElement("div");
    exampleEndPageWrapper.classList.add(
      "quiz-end-example-wrapper",
      "bg-2",
      "pd-10",
      "h-100"
    );
    quizContainer.appendChild(exampleEndPageWrapper);

    if (incorrectAnswersIds.length === 0) {
      const successMessage = document.createElement("p");
      successMessage.textContent =
        "Gratulacje! Udzieliłeś poprawnych odpowiedzi na wszystkie pytania.";
      exampleEndPageWrapper.appendChild(successMessage);
    } else {
      const failureMessage = document.createElement("p");
      failureMessage.textContent = `Niestety, niektóre odpowiedzi były niepoprawne.`;
      exampleEndPageWrapper.appendChild(failureMessage);

      const incorrectList = document.createElement("div");

      incorrectList.classList.add("quiz-incorrect-list-example-answers");

      incorrectAnswersIds.forEach((id) => {
        const question = questions.find((q) => q.id === id);
        const listItem = document.createElement("div");
        listItem.classList.add("mr-10");
        const questionText = document.createElement("p");
        questionText.classList.add("pd-10");
        const b = document.createElement("b");
        b.classList.add("filtr-opa-60");
        b.textContent = "Pytanie: ";
        questionText.appendChild(b);
        questionText.appendChild(
          document.createTextNode(` ${question.question}`)
        );
        listItem.appendChild(questionText);

        const hr = document.createElement("hr");
        listItem.appendChild(hr);

        const correctAnswerText = document.createElement("p");
        correctAnswerText.classList.add("pd-10");
        const b2 = document.createElement("b");
        b2.classList.add("filtr-opa-60");
        b2.textContent = "Poprawna odpowiedź: ";
        correctAnswerText.appendChild(b2);
        correctAnswerText.appendChild(
          document.createTextNode(` ${question.options[question.answer]}`)
        );
        listItem.appendChild(correctAnswerText);

        const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("details-content");

        if (question.explanationImg) {
          const explanationImg = document.createElement("img");
          explanationImg.src = question.explanationImg;
          explanationImg.setAttribute("role", "img");
          explanationImg.setAttribute(
            "aria-label",
            question.explanationImgAlt || "Ilustracja wyjaśniająca"
          );
          detailsContainer.appendChild(explanationImg);
        }

        const explanationText = document.createElement("p");
        explanationText.textContent = question.explanation;
        detailsContainer.appendChild(explanationText);

        const details = RenderDetails.renderDetailsSummary(
          "Wyjaśnienie",
          detailsContainer
        );

        listItem.appendChild(details);

        const listItemWrapper = document.createElement("div");
        listItemWrapper.classList.add(
          "quiz-incorrect-list-item",
          "mb-20",
          "bg-1",
          "pd-10"
        );
        listItemWrapper.appendChild(listItem);

        incorrectList.appendChild(listItemWrapper);
      });

      exampleEndPageWrapper.appendChild(incorrectList);
    }
  }
}