import { UIFacade } from "../UIFacade.js";
import { DataService } from "../Service/DataService.js";

export class StudentsTasks{
    static renderStudentsTasksPage() {
        const container = document.createElement("section");
        container.id = "students-tasks-page";
        const title = document.createElement("h2");
        title.textContent = "Zadania uczniów";
        container.appendChild(title);

        const contentContainer = document.createElement("div");
        contentContainer.id = "students-tasks-content-container";
        contentContainer.innerHTML = '<div class="loader">Ładowanie opcji...</div>';
        container.appendChild(contentContainer);

        this._loadDataAndRender(contentContainer);

        return container;
    }

    static async _loadDataAndRender(container) {
        try {
            const [classOptions, subjectOptions] = await Promise.all([
                DataService.getClassOptions(),
                DataService.getSubjectOptions()
            ]);
    
            container.innerHTML = ""; // Clear loader

            const formHeader = document.createElement("nav");
            formHeader.id = "student-tasks";
            container.appendChild(formHeader);
    
            const hr = document.createElement("hr");
            container.appendChild(hr);
    
            const studentTasksSection = document.createElement("section");
            studentTasksSection.id = "student-tasks-section";
            container.appendChild(studentTasksSection);
    
            const elements = [
                { selectInputOptions: true, label: "Wybierz klasę:", type: "select", id: "class-select", options: classOptions },
                { selectInputOptions: true, label: "Wybierz przedmiot:", type: "select", id: "subject-select", options: subjectOptions },
            ];
    
            const form = UIFacade.createForm(elements, "Załaduj dane", () => {
                this.loadStudentTasks(
                form.querySelector("#class-select").value,
                    form.querySelector("#subject-select").value,
                    studentTasksSection
                );
            });
            formHeader.appendChild(form);
            
            // Set default value if exists
            const subjectSelect = form.querySelector("#subject-select");
            if(subjectSelect && subjectSelect.options.length > 0) {
                // Try to select 'aso' if exists, otherwise first
                const asoOption = Array.from(subjectSelect.options).find(opt => opt.value === 'aso');
                if(asoOption) subjectSelect.value = 'aso';
            }

            // form.dispatchEvent(new Event('submit')); // automatyczne załadowanie danych przy wejściu na stronę
        } catch (error) {
            console.error("Błąd ładowania strony zadań uczniów:", error);
            container.innerHTML = '<p class="error">Nie udało się pobrać danych.</p>';
        }
    }

    static async loadStudentTasks(classId, subjectId, container) {
        container.innerHTML = '<div class="loader">Ładowanie zadań...</div>';
        
        const info = document.createElement("h2");
        const contentSection = document.createElement("section");
        contentSection.id = "student-tasks-content";

        try {
            let tasksData = [];
            if(subjectId === "aso"){
                tasksData = await DataService.getStudentTasksASO();
                info.textContent = `Wyświetlanie zadań dla klasy ${classId.toUpperCase()} i przedmiotu ASO.`;
            } else if(subjectId === "bd"){
                tasksData = await DataService.getStudentTasksBD();
                info.textContent = `Wyświetlanie zadań dla klasy ${classId.toUpperCase()} i przedmiotu BD.`;
            } else {
                container.innerHTML = "";
                info.textContent = `Brak dostępnych danych dla wybranego przedmiotu.`;
                container.appendChild(info);
                return;
            }

            container.innerHTML = ""; // Clear loader
            container.appendChild(info);
            container.appendChild(contentSection);

            const tasksList = this.renderSubjectList(tasksData);
            contentSection.appendChild(tasksList);

            const tableStatus = document.createElement("section");
            tableStatus.id = "student-tasks-status";
            tableStatus.appendChild(document.createTextNode("Wybierz zadanie, aby zobaczyć statusy uczniów."));
            contentSection.appendChild(tableStatus);
            container.appendChild(tableStatus);

        } catch (error) {
            console.error("Błąd pobierania zadań studentów:", error);
            container.innerHTML = '<p class="error">Błąd pobierania zadań.</p>';
        }

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