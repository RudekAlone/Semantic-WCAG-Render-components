import { RenderElements } from "./RenderElements.js";
export class RenderMarkdown {
  static renderMarkdownPreview(container, markdownContent) {
    this.convertMarkdownToHTML(container, markdownContent);
    this.renderTabs(container);
    this.renderQuiz(container);
  }

static convertMarkdownToHTML(container, markdownContent) {
  const htmlContent = marked.parse(markdownContent);
  container.innerHTML = htmlContent;

  container.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });

  renderMathInElement(container, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
  });

  // Szukamy elementów z klasą .mord
  container.querySelectorAll('.mord').forEach((el) => {
    if (el.getAttribute('style') === 'color: transparent;') {
      el.textContent = " "; // zamiana na spację
    }
  });
}


  static renderTabs(containerHTML) {
    const dataTabs = containerHTML.querySelectorAll("data-tabs");

    dataTabs.forEach((tabContainer) => {
      const newTabContainer = document.createElement("section");
      newTabContainer.classList.add("data-tabs");
      newTabContainer.setAttribute("role", "region");

      const tabContents = tabContainer.querySelectorAll("div");

      // Tworzymy <nav> dla przycisków
      const nav = document.createElement("nav");
      nav.classList.add("tab-buttons");
      nav.setAttribute("role", "tablist");

      tabContents.forEach((content, index) => {
        const label =
          content.querySelector("h2")?.textContent || `Tab ${index + 1}`;
        const newButton = RenderElements.renderButton(
          label,
          "tabButton",
          "button",
          () => {
            console.log("Tab button clicked:", index);
            // aktywacja przycisków i paneli
            nav.querySelectorAll("button").forEach((btn, i) => {
              if (i === index) {
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");
                tabContents[i].classList.add("active");
              } else {
                btn.classList.remove("active");
                btn.setAttribute("aria-selected", "false");
                tabContents[i].classList.remove("active");
              }
            });
          }
        );
        newButton.setAttribute("role", "tab");
        newButton.setAttribute("aria-controls", `tab-panel-${index}`);
        if (index === 0) {
          newButton.classList.add("active");
          newButton.setAttribute("aria-selected", "true");
        } else {
          newButton.setAttribute("aria-selected", "false");
        }
        nav.appendChild(newButton);

        // ustawiamy role i id dla panelu
        content.classList = "tab-content";
        content.setAttribute("role", "tabpanel");
        content.id = `tab-panel-${index}`;
        if (index === 0) {
          content.classList.add("active");
        }
        this.convertMarkdownToHTML(content, content.innerHTML);
      });

      newTabContainer.appendChild(nav);
      tabContents.forEach((c) => newTabContainer.appendChild(c));
      tabContainer.replaceWith(newTabContainer);
    });
  }

  static renderQuiz(containerHTML) {
    const dataQuizzes = containerHTML.querySelectorAll("data-quiz");

    dataQuizzes.forEach((quizElement) => {
      const questionText =
        quizElement.querySelector("question")?.textContent || "Pytanie";
      const optionsElements = quizElement.querySelectorAll("options option");

      // Tworzymy semantyczny kontener quizu
      const quizContainer = document.createElement("section");
      quizContainer.classList.add("data-quiz");
      quizContainer.setAttribute("role", "group");

      // Pytanie
      const questionEl = document.createElement("h3");
      questionEl.classList.add("quiz-question");
      this.convertMarkdownToHTML(questionEl, questionText);
      quizContainer.appendChild(questionEl);

      // Lista opcji
      const ul = document.createElement("ul");
      ul.classList.add("quiz-options");

      optionsElements.forEach((option, index) => {
        const li = document.createElement("li");

        const button = document.createElement("button");
        button.classList.add("quiz-option");
        button.type = "button";
        this.convertMarkdownToHTML(button, option.textContent);
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", "false");

        // Obsługa kliknięcia
        button.addEventListener("click", () => {
          // reset
          ul.querySelectorAll("button").forEach((btn) => {
            btn.classList.remove("correct", "wrong", "selected");
            btn.setAttribute("aria-checked", "false");
          });

          button.classList.add("selected");
          button.setAttribute("aria-checked", "true");
          if (option.hasAttribute("correct")) {
            button.classList.add("correct");
          } else {
            button.classList.add("wrong");
          }
        });

        li.appendChild(button);
        ul.appendChild(li);
      });

      quizContainer.appendChild(ul);
      quizElement.replaceWith(quizContainer);
    });
  }
}
