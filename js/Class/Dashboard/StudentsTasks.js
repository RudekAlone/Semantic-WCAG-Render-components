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
            const allTasks = await DataService.getTasks();
            let tasksData = [];
            
            if(subjectId === "all") {
                 tasksData = allTasks;
                 info.textContent = `Wyświetlanie zadań dla klasy ${classId.toUpperCase()} (Wszystkie przedmioty).`;
            } else {
                 tasksData = allTasks.filter(t => t.subject === subjectId);
                 info.textContent = `Wyświetlanie zadań dla klasy ${classId.toUpperCase()} i przedmiotu ${subjectId.toUpperCase()}.`;
            }

            if (tasksData.length === 0) {
                container.innerHTML = "";
                info.textContent = `Brak dostępnych zadań dla wybranego przedmiotu.`;
                container.appendChild(info);
                return;
            }

            container.innerHTML = ""; // Clear loader
            container.appendChild(info);
            container.appendChild(contentSection);

            const tasksList = this.renderSubjectList(tasksData, classId);
            contentSection.appendChild(tasksList);

            const tableStatus = document.createElement("section");
            tableStatus.id = "student-tasks-status";
            tableStatus.innerHTML = "<p>Wybierz zadanie, aby zobaczyć statusy uczniów.</p>";
            contentSection.appendChild(tableStatus);
            container.appendChild(tableStatus);

        } catch (error) {
            console.error("Błąd pobierania zadań studentów:", error);
            container.innerHTML = '<p class="error">Błąd pobierania zadań.</p>';
        }

    }

    static renderSubjectList(tasksData, classId) {
        const ul = document.createElement("ul");
        // Unique names
        const tasksName = [...new Set(tasksData.map((task) => task.name))];

        tasksName.forEach((name) => {
            const li = document.createElement("li");
            li.textContent = name;
            li.tabIndex = 0;
            ul.appendChild(li);
            
            li.addEventListener("click", async () => {
                const tableStatus = document.getElementById("student-tasks-status");
                tableStatus.innerHTML = '<div class="loader">Ładowanie statusów...</div>';
                
                try {
                    const statusData = await DataService.getTaskStatus(name, classId);
                    tableStatus.innerHTML = ""; 
                    const table = this.renderTableStatusByTask(statusData, name);
                    tableStatus.appendChild(table);
                } catch(e) {
                    console.error(e);
                    tableStatus.innerHTML = '<p class="error">Błąd pobierania statusów.</p>';
                }
            });
            
            li.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    li.click();
                }
            });
        });

        return ul;
    }

    // Removed calculateCompletionPercentageTasksByStudent as we cannot compute it efficiently without all data

    static renderTableStatusByTask(taskData, taskName) {
        // taskData is array of { id, first_name, last_name, status, class_name }
        
        const headers = ["Nr", "Imię", "Nazwisko", "Klasa", "Status", "Termin"];
        const rows = taskData.map((s, index) => [
            s.id || index + 1,
            s.first_name,
            s.last_name,
            s.class_name || "-",
            s.status === "1" ? "🟢 Zrobione" : (s.status === "0" ? "🟡 W trakcie" : "🔴 Przeterminowane"),
            "-" // Termin not in getTaskStatus result, only in getStudentTasks. Can be fetched or ignored.
        ]);

        const table = UIFacade.createTable(rows, headers);
        return table;
    }
}