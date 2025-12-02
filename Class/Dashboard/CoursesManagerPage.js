import { UIFacade } from "../UIFacade.js";
import { MarkdownEditorComponent } from "./Components/MarkdownEditorComponent.js";
import { COURSES_DATA} from "./constants.js"


export class CoursesManagerPage{
    static renderCoursesManagerPage() {
        const container = document.createElement("section");
        container.id = "courses-manager-page";
        const title = document.createElement("h2");
        title.textContent = "Zarządzaj kursami";
        container.appendChild(title);

        const coursesCardList = document.createElement("nav");
        coursesCardList.id = "courses";
        container.appendChild(coursesCardList);

        const containerCourseEditor = document.createElement("section");
        containerCourseEditor.id = "course-editor";

        coursesCardList.appendChild(this.navCourses(containerCourseEditor, COURSES_DATA));


        container.appendChild(containerCourseEditor);
        
        this.courseEditor(containerCourseEditor, COURSES_DATA);




        return container;
    }

    static navCourses(container, data) {
        const ul = document.createElement("ul");
        data.forEach((course) => {
            const li = document.createElement("li");

            const a = document.createElement("a");
            a.href = "#course-"+course.name.toLowerCase().replace(/\s+/g, '-');
            li.appendChild(a);

            const img = document.createElement("img");
            img.src = "/Resources/course/" + course.img;
            img.alt = course.name + " - grafika kursu";
            const footerCourse = document.createElement("div");
            footerCourse.id = "footer-course";
            const hr = document.createElement("hr");
            const spanDomainName = document.createElement("span");
            spanDomainName.textContent = "Koala-V";

            a.appendChild(img);
            a.appendChild(document.createTextNode(course.name));
            footerCourse.appendChild(hr);
            footerCourse.appendChild(spanDomainName);
            a.appendChild(footerCourse);
            li.appendChild(a);
            ul.appendChild(li);

            li.addEventListener("click", () => {
                setTimeout(() => {
                    this.courseEditor(container, data);
                }, 100);
            });
        });
        return ul;
    }

    static courseEditor(container, data) {
        console.log("courseEditor called");
        container.innerHTML = ""; // Clear previous content
        const sectionEditCard = document.createElement("section");
        sectionEditCard.id = "course-edit-card";


        const courseName = window.location.hash.split("course-")[1];
        const courseId = courseName ? courseName : "Wybierz kurs z listy po powyższej";


        const wrapPreview = document.createElement("div");
        wrapPreview.id = "wrapper-preview-course";
        sectionEditCard.appendChild(wrapPreview);

        const navPreviews = document.createElement("nav");
        navPreviews.id = "courses";
        const previewsCard = document.createElement("ul");
        previewsCard.id = "previews-card";
        const liPreview = document.createElement("li");
        // Do a nie dodałem hiperłącza href bo to placeholder i nie dałem też # bo ingerowało by to w hash strony
        const a = document.createElement("a");
        liPreview.appendChild(a);
        const imgPreview = document.createElement("img");

        a.appendChild(imgPreview);
        previewsCard.appendChild(liPreview);
        navPreviews.appendChild(previewsCard);
        wrapPreview.appendChild(navPreviews);

        navPreviews.classList.add("wrapper-300");

                // Wyszukanie odpowiedniego obiektu kursu względem hash strony
        const selectedCourse = data.find((course) => {
            return course.name.toLowerCase().replace(/\s+/g, '-') === courseId;
        });
        if(selectedCourse){
            imgPreview.src = "/Resources/course/" + selectedCourse.img;
            imgPreview.alt = "Podgląd kursu - grafika kursu";
            const spanCourseName = document.createElement("span");
            spanCourseName.textContent = selectedCourse.name;
            a.appendChild(spanCourseName);
        } else {
            imgPreview.src = "/Resources/course/placeholder.png";
            imgPreview.alt = "Podgląd kursu - grafika kursu";
            const spanCourseName = document.createElement("span");
            spanCourseName.textContent = "Podgląd kursu";
            a.appendChild(spanCourseName);
        }

        const footerCoursePreview = document.createElement("div");
        footerCoursePreview.id = "footer-course";
        a.appendChild(footerCoursePreview);

        const hrPreview = document.createElement("hr");
        footerCoursePreview.appendChild(hrPreview);
        const spanDomainNamePreview = document.createElement("span");
        spanDomainNamePreview.textContent = "Podgląd kursu --- Koala-V";
        footerCoursePreview.appendChild(spanDomainNamePreview);


        const inputsWrapCardEdit = document.createElement("section");
        inputsWrapCardEdit.id = "inputs-wrap-card-edit";

        // Input - Nazwa kursu
        const inputCourseName = UIFacade.createInput("Nazwa kursu:", "course-name", "course-name", "text", true, { value: selectedCourse ? selectedCourse.name : "" });
        inputsWrapCardEdit.appendChild(inputCourseName);
        wrapPreview.appendChild(inputsWrapCardEdit);
        // Input - grafika kursu
        const inputCourseImage = UIFacade.createFileInputWithPreview("Grafika kursu:", "course-image", "course-image", true);
        inputsWrapCardEdit.appendChild(inputCourseImage);
        wrapPreview.appendChild(inputsWrapCardEdit);

        inputsWrapCardEdit.classList.add("wrapper-300");

        inputCourseImage.querySelector("input").addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    imgPreview.src = evt.target.result;
                }
                reader.readAsDataURL(file);
            }
        });

        inputCourseName.addEventListener("input", (e) => {
            let value = e.target.value || "";

            // zachowaj informację o końcowej spacji dla podglądu
            const endsWithSpace = value.endsWith(" ");

            // podziel na tokeny: sekwencje spacji lub sekwencje nie-spacji (preserve spacing)
            const tokens = value.match(/\s+|\S+/g) || [];

            // przytnij wyłącznie tokeny będące słowami (nie spacje) do 15 znaków
            const processed = tokens.map(t => (/\S/.test(t) ? t.slice(0, 15) : t));

            // zbuduj maksymalnie 3 linii po max 15 znaków każda (licząc spacje)
            const lines = [];
            let current = "";

            for (let i = 0; i < processed.length; i++) {
            const tok = processed[i];
            // jeśli token mieści się w obecnej linii, dodaj go
            if ((current + tok).length <= 15) {
                current += tok;
            } else {
                // zapisz obecną linię i zacznij nową; przytnij leading spaces na początku nowej linii
                if (current.length) {
                lines.push(current);
                }
                // jeśli już mamy 3 linie, przerwij
                if (lines.length >= 3) {
                current = "";
                break;
                }
                current = tok.replace(/^\s+/, ""); // usuń początkowe spacje na początku linii
                // jeśli po usunięciu leading-spaces token nadal za długi, przytnij
                if (current.length > 15) current = current.slice(0, 15);
            }
            }
            if (current.length) lines.push(current);
            if (lines.length > 3) lines.length = 3;

            // jeśli kończyło spacją i ostatnia linia ma miejsce, dodaj jedną spację do podglądu
            if (endsWithSpace && lines.length && lines[lines.length - 1].length < 15) {
            lines[lines.length - 1] = lines[lines.length - 1] + " ";
            }

            // NIE nadpisujemy e.target.value — pozwalamy użytkownikowi pisać naturalnie
            // zaktualizujemy tylko podgląd (span wewnątrz <a>)
            const spanCourseName = a.querySelector("span");
            if (spanCourseName) {
            const escapeHtml = (s) => s.replace(/&/g, "&amp;")
                           .replace(/</g, "&lt;")
                           .replace(/>/g, "&gt;")
                           .replace(/"/g, "&quot;")
                           .replace(/'/g, "&#39;");
            const html = lines.length ? lines.map(l => escapeHtml(l)).join("<br>") : "Podgląd kursu";
            spanCourseName.innerHTML = html;
            }
        });

        // Moduły i lekcje 

        const modulesCourse = document.createElement("section");
        modulesCourse.id = "modules-course";

        // Custom renderer dla modułów
        const modulesPreviewRenderer = (previewElement, markdownText) => {
            previewElement.innerHTML = "";
            const previewListModules = document.createElement("ul");
            previewElement.appendChild(previewListModules);

            const lines = markdownText.split("\n");
            let currentDetails = null; // To hold the current <details> element for grouped lessons

            lines.forEach((line) => {
                let li;
                if (line.startsWith("# ")) {
                    li = document.createElement("li");
                    li.textContent = line.slice(2).trim();
                    li.classList.add("module-item");
                    previewListModules.appendChild(li);
                    currentDetails = null; // Reset current details on new module
                } else if (line.startsWith("## ")) {
                    li = document.createElement("li");
                    li.textContent = line.slice(3).trim();
                    li.classList.add("lesson"); 
                    li.tabIndex = 0;
                    previewListModules.appendChild(li);
                    currentDetails = null; // Reset current details on new lesson
                } else if (line.startsWith("#### ")) {
                    // grupowane lekcje
                    const details = document.createElement("details");
                    const summary = document.createElement("summary");
                    summary.textContent = line.slice(5).trim();
                    details.appendChild(summary);
                    const ulGrouped = document.createElement("ul");
                    details.appendChild(ulGrouped);
                    previewListModules.appendChild(details);
                    currentDetails = ulGrouped; // Set current details to this grouped ul
                } else if (line.startsWith("### ") && currentDetails) {
                    // Add grouped lessons to the current details if available
                    const liGrouped = document.createElement("li");
                    liGrouped.textContent = line.slice(4).trim();
                    liGrouped.classList.add("lesson");
                    liGrouped.tabIndex = 0;
                    currentDetails.appendChild(liGrouped);
                } else {
                    currentDetails = null; // Reset if line doesn't match any pattern
                }
            });
        };

        const initialModulesValue = selectedCourse ? selectedCourse.modulesMarkdown : "";
        const testingText = `
# Nazwa modułu
## Nazwa lekcji
#### Nazwa zgrupowanych lekcji
### Nazwa lekcji 1
### Nazwa lekcji 2
`;
        
        const modulesEditor = new MarkdownEditorComponent(
            "Moduły i lekcje (Markdown):", 
            "modules-lessons", 
            initialModulesValue || testingText, 
            modulesPreviewRenderer
        );
        
        modulesCourse.appendChild(modulesEditor.render());
        sectionEditCard.appendChild(modulesCourse);


        const elements = [
            {
                  label: "Status kursu:",
                  name: "course-status",
                  id: "course-status",
                  type: "checkbox",
                  role: "checkbox",
                  required: false   
            }
        ]

        const courseStatusForm = UIFacade.createForm(elements, "Zapisz zmiany", (e) => {
            e.preventDefault();
            alert("Funkcja zapisu zmian kursu nie jest jeszcze zaimplementowana.");
        });
        courseStatusForm.classList.add("wrapper-300");

        const courseStatusInput = courseStatusForm.querySelector("input[name='course-status']");
        const wrapCourseStatus = courseStatusForm.querySelector('[data-ui="input-wrapper"]');

         courseStatusInput.addEventListener("change", (e) => {
            const spanStatus = wrapCourseStatus.querySelector("span");
            if(courseStatusInput.checked){
                if(spanStatus){
                    spanStatus.textContent = "Publiczny";
                }else{
                    const newSpan = document.createElement("span");
                    newSpan.textContent = "Publiczny";
                    wrapCourseStatus.appendChild(newSpan);
                }
            }else{
                if(spanStatus){
                    spanStatus.textContent = "Prywatny";
                }else{
                    const newSpan = document.createElement("span");
                    newSpan.textContent = "Prywatny";
                    wrapCourseStatus.appendChild(newSpan);
                }
            }
        });

        courseStatusInput.dispatchEvent(new Event('change'));
        sectionEditCard.appendChild(courseStatusForm);

        container.appendChild(sectionEditCard);
        const hr = document.createElement("hr");
        container.appendChild(hr);
        container.appendChild(this.lessonEditor());
    }

    static lessonEditor() {

        const sectionLessonEditor = document.createElement("section");
        sectionLessonEditor.id = "lesson-editor";

        const editorComponent = new MarkdownEditorComponent("Edytor lekcji", "lesson-editor");
        sectionLessonEditor.appendChild(editorComponent.render());

        return sectionLessonEditor;
    }
}