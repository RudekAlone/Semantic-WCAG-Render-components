import { COURSES_DATA} from "./constants.js"


export class CoursesPage{
    static renderCoursesPage() {
        const container = document.createElement("section");
        container.id = "courses-page";
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
        




        return container;
    }

    static navCourses(container, data) {
        const ul = document.createElement("ul");
        data.forEach((course) => {
            const li = document.createElement("li");

            const a = document.createElement("a");
            a.href = "../course/"+course.name.toLowerCase().replace(/\s+/g, '-');
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
}