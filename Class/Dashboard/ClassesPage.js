import { RenderForm } from "../Render/RenderForm.js";
import { RenderTable } from "../Render/RenderTable.js";



export class ClassesPage {

     static renderClassesPage() {
    const classesPage = document.createElement("section");
    classesPage.id = "classes-page";

    const title = document.createElement("h2");
    title.textContent = "Zarządzanie klasami";
    classesPage.appendChild(title);

    const content = document.createElement("section");

    const classElements = [
      {
        label: "Nazwa klasy",
        name: "className",
        id: "class-name-input",
        type: "text",
        role: "textbox",
        required: true,
      },
      {
        label: "Rok szkolny",
        name: "schoolYear",
        id: "school-year-input",
        type: "number",
        role: "textbox",
        required: true,
      },
    ];

    const addNewClassForm = RenderForm.renderForm(
      classElements,
      "Dodaj nową klasę",
      (e) => {
        console.log("Dodano klasę:", e);
      },
      "row"
    );

    content.appendChild(addNewClassForm);
    classesPage.appendChild(content);

    addNewClassForm.querySelector("#school-year-input").value =
      new Date().getFullYear();

    const tableClassesData = [
      [1, "1A", 2024, 25],
      [2, "2B", 2024, 22],
      [3, "3C", 2024, 20],
    ];

    tableClassesData.forEach((row) => {
      row[1] = {
        type: "text",
        value: row[1],
      };
      row[2] = {
        type: "number",
        value: row[2],
      };
      row.push({
        type: "button",
        label: "Zastosuj zmiany",
        buttonStyle: "tertiary",
      });
      row.push({
        type: "button",
        label: "Usuń klasę",
        buttonStyle: "quaternary",
      });
    });

    const classesTable = RenderTable.renderResponsiveTable(
      tableClassesData,
      ["ID", "Nazwa klasy", "Rok szkolny", "Liczba uczniów", "Zarządzaj"],
      false,
      this.rebrandTableClasses.bind(this)
    );

    content.appendChild(classesTable);

    return classesPage;
  }

  static rebrandTableClasses(classesTable) {
    const headers = classesTable.querySelectorAll("th");
    headers[headers.length - 1].colSpan = 2;

    classesTable.querySelectorAll("tr").forEach((tr) => {
      const applyButton = tr.querySelector("button.bg-tertiary");
      if (!applyButton) return;

      applyButton.disabled = true;
      tr.children[1].addEventListener("input", (e) => {
        applyButton.disabled = false;
      });

      tr.children[2].addEventListener("input", (e) => {
        applyButton.disabled = false;
      });
      const deleteButton = tr.querySelector("button.bg-quaternary");
      if (!deleteButton) return;

      deleteButton.disabled = false;
      deleteButton.addEventListener("click", (e) => {
        console.log("Usuń klasę:", tr.children[1].textContent);
      });
    });
  }
}