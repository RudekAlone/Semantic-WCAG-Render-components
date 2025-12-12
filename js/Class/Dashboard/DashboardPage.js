import { UIFacade } from "../UIFacade.js";
import { DataService } from "../Service/DataService.js";

/**
 * Strona główna Dashboardu (Pulpit).
 * Wyświetla podsumowanie, szybkie akcje i widżety.
 * 
 */
export class DashboardPage {
  /**
   * Renderuje stronę główną.
   * @returns {HTMLElement}
   */
  static render() {
    const container = document.createElement("section");
    container.classList.add("dashboard-page");

    // Nagłówek strony
    const header = document.createElement("header");
    const title = document.createElement("h1");
    title.textContent = "Dashboard";
    header.appendChild(title);

    container.appendChild(header);

    // Kontener na widżety (początkowo loader)
    const widgetsContainer = document.createElement("div");
    widgetsContainer.classList.add("dashboard-widgets");
    widgetsContainer.innerHTML = '<div class="loader">Ładowanie danych...</div>'; // Prosty loader
    container.appendChild(widgetsContainer);

    // Asynchroniczne pobieranie danych i renderowanie widżetów
    this._loadDataAndRenderWidgets(widgetsContainer);

    return container;
  }

  /**
   * Pobiera dane i renderuje widżety.
   * @param {HTMLElement} container Kontener na widżety.
   */
  static async _loadDataAndRenderWidgets(container) {
    try {
      // Pobierz wszystkie zadania studenta (już pogrupowane po przedmiotach przez backend)
      const [allTasks, exams] = await Promise.all([
        DataService.getAllStudentTasks(),
        DataService.getStudentExams()
      ]);

      container.innerHTML = ""; // Wyczyść loader

      // allTasks to tablica zadań z polem 'subject' (nazwa przedmiotu)
      if (Array.isArray(allTasks) && allTasks.length) {
        const widgetsSubjectSummaryWrapper = this._createSubjectSummaryWidget(allTasks);
        container.appendChild(widgetsSubjectSummaryWrapper);
      } else {
        const empty = document.createElement("p");
        empty.classList.add("no-data");
        empty.textContent = "Brak danych zadań do wyświetlenia.";
        container.appendChild(empty);
      }

      container.appendChild(this.examSection(exams));

    } catch (error) {
      console.error("Błąd pobierania danych dashboardu:", error);
      container.innerHTML = '<p class="error">Wystąpił błąd podczas ładowania danych.</p>';
    }
  }

  /**
   * Tworzy widżet podsumowania przedmiotów.
   * @param {Array} tasksData Dane zadań.
   * @returns {HTMLElement}
   */
  static _createSubjectSummaryWidget(tasksData) {
      // Pomocnicze wykrywanie czy element to już podsumowanie przedmiotu
      const isSubjectSummary = (it) =>
        it &&
        typeof it === "object" &&
        Number.isFinite(Number(it.total)) &&
        (it.name || it.subject);

      // Pomocnicze wykrywanie czy konkretne zadanie jest zaliczone
      const isTaskCompleted = (task) => {
        if (!task || typeof task !== "object") return false;

        // boolean true
        if (task.completed === true) return true;

        // status może być "1"/"0" (string) lub liczbowo
        if (task.status !== undefined && task.status !== null) {
          const num = Number(task.status);
          if (!Number.isNaN(num)) {
            // w danych "1" oznacza zaliczone
            if (num === 1) return true;
            if (num === 100) return true; // defensywnie: czasem status może być procentem
          } else {
            const s = String(task.status).toLowerCase();
            if (
              s === "done" ||
              s === "completed" ||
              s === "zaliczone" ||
              s === "true"
            )
              return true;
          }
        }

        // postęp
        if (
          Number.isFinite(Number(task.progress)) &&
          Number(task.progress) === 100
        )
          return true;

        // jeśli zadanie ma wartości completed/total traktujemy je jako liczby
        if (
          Number.isFinite(Number(task.completed)) &&
          Number.isFinite(Number(task.total))
        ) {
          return (
            Number(task.total) > 0 &&
            Number(task.completed) >= Number(task.total)
          );
        }

        return false;
      };

      // Grupowanie: mapa name -> { name, total, completed }
      const groups = new Map();

      tasksData.forEach((item) => {
        if (isSubjectSummary(item)) {
          const name = item.name || item.subject || "Przedmiot";
          const total = Math.max(0, Number(item.total) || 0);
          const completed = Math.max(0, Number(item.completed) || 0);
          // Jeżeli już mieliśmy grupę, sumujemy
          const existing = groups.get(name);
          if (existing) {
            existing.total += total;
            existing.completed += completed;
          } else {
            groups.set(name, { name, total, completed });
          }
        } else {
          // traktujemy item jako pojedyncze zadanie -> musimy mieć klucz przedmiotu
          const subject = item.subject || item.name || "Inne";
          const existing = groups.get(subject) || {
            name: subject,
            total: 0,
            completed: 0,
          };
          existing.total += 1;
          if (isTaskCompleted(item)) existing.completed += 1;
          groups.set(subject, existing);
        }
      });

      const widgetsSubjectSummaryWrapper = document.createElement("section");
      widgetsSubjectSummaryWrapper.classList.add(
        "widget",
        "subject-summary-widget"
      );
      const widgetsSubjectSummaryTitle = document.createElement("h2");
      widgetsSubjectSummaryTitle.textContent = "Podsumowanie przedmiotów";
      widgetsSubjectSummaryWrapper.appendChild(widgetsSubjectSummaryTitle);

      const list = document.createElement("section");
      list.classList.add("subject-summary-list");

      widgetsSubjectSummaryWrapper.appendChild(list);
      // Dla każdej grupy renderujemy tylko nazwę przedmiotu i zliczenia
      Array.from(groups.values()).forEach((summary) => {
        list.appendChild(this.subjectTaskStatus(summary));
      });
      return widgetsSubjectSummaryWrapper;
  }

  // Metoda tworząca kartę podsumowania przedmiotu (tylko nazwa i zliczenia)
  /**
   * Tworzy kartę statusu zadań dla pojedynczego przedmiotu.
   * Przyjmuje obiekt { name?, completed?, total? } gdzie completed i total są liczbami.
   * @param {{ name?: string, completed?: number, total?: number }} summary
   * @returns {HTMLElement}
   */
  static subjectTaskStatus(summary = {}) {
    const name = summary.name || "Przedmiot";
    const completed = Number.isFinite(Number(summary.completed))
      ? Math.max(0, Number(summary.completed))
      : 0;
    const total = Number.isFinite(Number(summary.total))
      ? Math.max(0, Number(summary.total))
      : 0;

    let percent = 0;
    if (total > 0) {
      percent = Math.round((completed / total) * 100);
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;
    }

    // Wybór emoji i podpisu (na poziomie przedmiotu, według procentu zaliczeń)
    let emoji = "❌";
    let statusText = "Brak zadań";
    if (total > 0) {
      if (percent === 100) {
        emoji = "😎";
        statusText = "Wszystko zaliczone";
      } else if (percent > 75) {
        emoji = "😃";
        statusText = "Stabilna sytuacja";
      } else if (percent >= 50) {
        emoji = "🙂";
        statusText = "Jest dobrze";
      } else if (percent >= 25) {
        emoji = "😐";
        statusText = "Trzeba nadrobić";
      } else {
        emoji = "😱";
        statusText = "Czas się wziąć do pracy";
      }
    }

    const card = document.createElement("article");
    card.classList.add("subject-card");

    const hdr = document.createElement("header");
    hdr.classList.add("subject-card-header");
    const h3 = document.createElement("h3");
    h3.textContent = name;
    hdr.appendChild(h3);

    const body = document.createElement("div");
    body.classList.add("subject-card-body");

    const emojiEl = document.createElement("div");
    emojiEl.classList.add("subject-emoji");
    emojiEl.setAttribute("role", "img");
    emojiEl.setAttribute("aria-label", statusText);
    emojiEl.textContent = emoji;
    body.appendChild(emojiEl);

    // Pokazujemy tylko opis statusu w treści (bez duplikowania procentu)
    const textEl = document.createElement("p");
    textEl.classList.add("subject-status-text");
    textEl.textContent = statusText;
    body.appendChild(textEl);

    const footer = document.createElement("footer");
    footer.classList.add("subject-card-footer");
    const footerText = document.createElement("small");
    footerText.textContent =
      total > 0
        ? `Zadania: ${completed}/${total} — ${percent}%`
        : "Brak zadań do wykonania";
    footer.appendChild(footerText);

    card.appendChild(hdr);
    card.appendChild(body);
    card.appendChild(footer);

    return card;
  }

  static examSection(examData = []) {
    const section = document.createElement("section");
    section.classList.add("exam-section");
    const title = document.createElement("h2");
    title.textContent = "Sekcja egzaminów";
    section.appendChild(title);

    if (Array.isArray(examData) && examData.length) {
      const list = document.createElement("ul");
      list.classList.add("exam-list");
      examData.forEach((exam) => {
        const item = document.createElement("li");
        item.classList.add("exam-item");
        const examNameWrap = document.createElement("h4");
        const examName = document.createElement("span");
        examName.textContent = exam.name || "Egzamin";
        examNameWrap.appendChild(examName);

        if (exam.result) {
          const examResult = document.createElement("span");
          if (exam.result < 0) {
            examResult.textContent = `Nieobecny na egzaminie`;
            examResult.classList.add("exam-empty");
          } else if (exam.part === "teoretyczna") {
            if (exam.result > 50) {
              examResult.textContent = `Zdano, wynik: ${exam.result}%`;
              examResult.classList.add("exam-passed");
            } else {
              examResult.textContent = `Nie zdano, wynik: ${exam.result}%`;
              examResult.classList.add("exam-failed");
            }
          } else if (exam.part === "praktyczna") {
            if (exam.result > 75) {
              examResult.textContent = `Zdano, wynik: ${exam.result}%`;
              examResult.classList.add("exam-passed");
            } else {
              examResult.textContent = `Nie zdano, wynik: ${exam.result}%`;
              examResult.classList.add("exam-failed");
            }
          }

          examNameWrap.appendChild(examResult);

          examNameWrap.appendChild(examResult);
        }
        item.appendChild(examNameWrap);
        const examDetails = document.createElement("p");
        examDetails.textContent = `Część: ${
          exam.part || "Brak danych"
        }, Termin: ${exam.date || "Brak danych"}`;
        item.appendChild(examDetails);
        list.appendChild(item);
        item.addEventListener("click", () => {
          this.loadInNewTabExamPage(exam.name || "");
        });
      });
      section.appendChild(list);
    } else {
      const empty = document.createElement("p");
      empty.classList.add("no-data");
      empty.textContent = "Brak danych egzaminów do wyświetlenia.";
      section.appendChild(empty);
    }

    return section;
  }

  static loadInNewTabExamPage(examName) {
    const url = new URL(window.location.origin);
    url.pathname = `/exam/${examName}`;
    window.open(url.toString(), "_blank");
  }
}
