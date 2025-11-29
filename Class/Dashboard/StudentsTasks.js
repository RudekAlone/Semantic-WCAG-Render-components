import { UIFacade } from "../UIFacade.js";

import { CLASS_OPTIONS, SUBJECT_OPTIONS,
    TASKS_STUDENT_DATA_BD, TASKS_STUDENT_DATA_ASO
} from "./constants.js"

export class StudentsTasks{
    static renderStudentsTasksPage() {
        const container = document.createElement("section");
        container.id = "students-tasks-page";
        const title = document.createElement("h2");
        title.textContent = "Zadania uczniów";
        container.appendChild(title);
        const formHeader = document.createElement("nav");
        formHeader.id = "student-tasks";
        container.appendChild(formHeader);

        const hr = document.createElement("hr");
        container.appendChild(hr);

        const studentTasksSection = document.createElement("section");
        studentTasksSection.id = "student-tasks-section";
        container.appendChild(studentTasksSection);

        const elements = [
            { selectInputOptions: true, label: "Wybierz klasę:", type: "select", id: "class-select", options: CLASS_OPTIONS },
            { selectInputOptions: true, label: "Wybierz przedmiot:", type: "select", id: "subject-select", options: SUBJECT_OPTIONS },
        ];

        const form = UIFacade.createForm(elements, "Załaduj dane", () => {
            this.loadStudentTasks(
            form.querySelector("#class-select").value,
                form.querySelector("#subject-select").value,
                studentTasksSection
            );
        });
        formHeader.appendChild(form);
        form.dispatchEvent(new Event('submit')); // automatyczne załadowanie danych przy wejściu na stronę

        return container;
    }

    static loadStudentTasks(classId, subjectId, container) {
        container.innerHTML = ""; // Clear previous content

       
        const info = document.createElement("h2");

        container.appendChild(info);
 const contentSection = document.createElement("section");
        contentSection.id = "student-tasks-content";
        container.appendChild(contentSection);

        let tasksData = [];
        if(subjectId === "aso"){
            tasksData = TASKS_STUDENT_DATA_ASO;
            info.textContent = `Wyświetlanie zadań dla klasy ${classId.toUpperCase()} i przedmiotu ASO.`;
        const tasksList = this.renderSubjectList(tasksData);
        contentSection.appendChild(tasksList);

        } else if(subjectId === "bd"){
            tasksData = TASKS_STUDENT_DATA_BD;
            info.textContent = `Wyświetlanie zadań dla klasy ${classId.toUpperCase()} i przedmiotu BD.`;
            const tasksList = this.renderSubjectList(tasksData);
            contentSection.appendChild(tasksList);
        } else {
            info.textContent = `Brak dostępnych danych dla wybranego przedmiotu.`;
            container.appendChild(info);
            return;
        }

        const tableStatus = document.createElement("section");
        tableStatus.id = "student-tasks-status";
        tableStatus.appendChild(document.createTextNode("Wybierz zadanie, aby zobaczyć statusy uczniów."));
         contentSection.appendChild(tableStatus);
        container.appendChild(tableStatus);

    }

    static renderSubjectList(tasksData) {

        const ul = document.createElement("ul");
        // Utworzenie elementów listy dla każdego zadania niepowtarzając nazwy
        const tasksName = [...new Set(tasksData.map((task) => task.name))];

        tasksName.forEach((name) => {
            const li = document.createElement("li");
            li.textContent = name;
            li.tabIndex = 0;
            ul.appendChild(li);
            li.addEventListener("click", () => {
                const completionPercentages = this.calculateCompletionPercentageTasksByStudent(tasksData);
                const tableStatus = document.getElementById("student-tasks-status");
                tableStatus.innerHTML = ""; // Clear previous content
                const filteredTasks = tasksData.filter((task) => task.name === name);
                const table = this.renderTableStatusByTask(filteredTasks, completionPercentages);
                tableStatus.appendChild(table);
            });
            li.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    li.click();
                }
            });
        });

        return ul;

    }

    static calculateCompletionPercentageTasksByStudent(taskData) {
        const studentTasksCount = {};
        const studentCompletedTasksCount = {};
        taskData.forEach((task) => {
            const studentKey = `${task.studentName} ${task.studentMiddleName} ${task.studentLastName}`;
            if (!studentTasksCount[studentKey]) {
                studentTasksCount[studentKey] = 0;
                studentCompletedTasksCount[studentKey] = 0;
            }
            studentTasksCount[studentKey]++;
            if (task.status === "1") {
                studentCompletedTasksCount[studentKey]++;
            }
        });

        const studentCompletionPercentage = {};
        for (const studentKey in studentTasksCount) {
            const totalTasks = studentTasksCount[studentKey];
            const completedTasks = studentCompletedTasksCount[studentKey];
            const percentage = ((completedTasks / totalTasks) * 100).toFixed(2);
            studentCompletionPercentage[studentKey] = percentage;
        }
        return studentCompletionPercentage;
    }

//     TASKS_STUDENT_DATA_BD = [
//   {
//     name: "Sortowanie i filtrowanie danych w SQL",
//     partName: "SQL",
//     subject: "bd",
//     status: "1",
//     deadline: "2024-06-15",
//     studentName: "Jan",
//     studentMiddleName: "Marek",
//     studentLastName: "Kowalski"
//   },
    static renderTableStatusByTask(taskData, completionPercentages) {



        const table = UIFacade.createTable(
            taskData.map((task) => [
                task.studentName,
                task.studentMiddleName,
                task.studentLastName,
                task.status === "1" ? "🟢 Zrobione" : task.status === "0" ? "🟡 W trakcie" : "🔴 Nie rozpoczęte",
                task.deadline,
                completionPercentages[`${task.studentName} ${task.studentMiddleName} ${task.studentLastName}`] + "%"
            ]),
            ["Imię", "Drugie imię", "Nazwisko", "Status", "Termin", "Procent ukończenia zadań z tego przedmiotu"]
        );
        return table;
    }
}