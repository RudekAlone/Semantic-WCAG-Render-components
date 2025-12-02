/**
 * Klasa do renderowania komponentów typu karta (card) w interfejsie użytkownika.
 *
 * @export
 * @class RenderCard
 * @typedef {RenderCard}
 */
export class RenderCard{

      /**
   * Tworzy kartę kursu
   * @param {string} title - Tytuł karty.
   * @param {string} image - URL obrazka.
   * @param {string} hash - Hash do nawigacji.
   * @return {HTMLDivElement} Kontener z kartą kursu.
   */
    static createCourseCard(title, image, hash, isLink = true) {
        const card = document.createElement("li");
        card.className = "course-card";
        const a = document.createElement("a");
        a.href = `#${hash}`;
        card.appendChild(a);

        const img = document.createElement("img");
        img.src = "../Resources/course/"+image;
        img.alt = `Obrazek kursu: ${title}`;
        a.appendChild(img);

        const p = document.createElement("p");
        p.textContent = title;
        a.appendChild(p);

        const footer = document.createElement("div");
        footer.id = "footer-course";
        const hr = document.createElement("hr");
        footer.appendChild(hr);
        const span = document.createElement("span");
        span.textContent = "Koala-V";
        footer.appendChild(span);
        a.appendChild(footer);

        if (isLink) {
            a.href = `../${hash}`;
        }

        return card;
    }
}