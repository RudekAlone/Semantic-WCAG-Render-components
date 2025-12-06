import { CourseRender } from "./Class/CourseRender.js";

window.addEventListener("DOMContentLoaded", () => {
    CourseRender.render(document.querySelector("#course-slug").textContent);
});