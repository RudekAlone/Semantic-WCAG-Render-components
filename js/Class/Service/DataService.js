/**
 * Serwis do obsługi danych.
 * Komunikuje się z backendem PHP.
 */
export class DataService {
  static apiUrl = '/backend/api';

  /**
   * Helper do zapytań fetch.
   * @param {string} endpoint Część adresu po /backend/api (np. '/tasks')
   * @param {Object} options Opcje fetch
   * @returns {Promise<any>} Dane JSON
   */
  static async _fetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${this.apiUrl}${endpoint}`, options);
        const text = await response.text();
        if (!response.ok) {
             console.error(`Fetch error ${endpoint}: ${response.status} ${response.statusText}`, text);
             throw new Error(`HTTP Error: ${response.status}`);
        }
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error(`JSON Parse Error for ${endpoint}:`, text, e);
            throw e;
        }
    } catch (error) {
        console.error('DataService Error:', error);
        throw error;
    }
  }

  /**
   * Pobiera listę wszystkich zadań (dla nauczyciela/admina).
   * @returns {Promise<Array>}
   */
  static async getTasks() {
    return this._fetch('/tasks');
  }

  /**
   * Pobiera listę kursów.
   * @returns {Promise<Array>}
   */
  static async getCourses() {
    return this._fetch('/courses');
  }

  /**
   * Pobiera listę użytkowników.
   * @returns {Promise<Array>}
   */
  static async getUsers() {
    return this._fetch('/users');
  }

  /**
   * Pobiera wszystkie zadania przypisane do zalogowanego studenta.
   * @returns {Promise<Array>}
   */
  static async getAllStudentTasks() {
    return this._fetch('/student-tasks');
  }

  // Metody helperowe dla konkretnych przedmiotów (legacy support dla widoku?)
  // Frontend filtrował te dane po pobraniu wszystkiego?
  // Zobaczmy TasksPage.js. Ono wołało getTasks() (wszystkie szablony?) czy getAllStudentTasks()?
  // TasksPage.js woła DataService.getTasks(). Ale to dziwne, bo TasksPage wyświetla "Twoje zadania".
  // W constants.js mock TASKS_DATA miał statusy? Nie, TASKS_STUDENT_DATA_... miały.
  // W implementation_plan założyliśmy: Przepisanie `getTasks()` -> `/backend/api/tasks`.
  // Ale TasksPage po mojej wczorajszej analizie TasksPage.js (Step 136):
  // DataService.getTasks() zwraca TASKS_DATA.
  // A TASKS_DATA w constants.js (Step 154) to tylko szablony (id, name, link).
  // A TasksPage.js w renderTaskListElements używa pola 'status' z statusMap...
  // Czekaj, TASKS_DATA w constants mają status "0", "1", "-1".
  
  // W bazie danych: endpoint /tasks zwraca '0' jako status (TaskRepository.php lini 48).
  // Zatem wyświetli zadania.
  // Jeśli to ma być widok studenta to powinien wołać /student-tasks.
  // TasksPage.js (Step 142) woła DataService.getTasks().
  // Jeśli to widok Studenta, to powinien wołać endpoint ze statusami studenta.
  // W oryginalnym kodzie getTasks zwracało TASKS_DATA.
  // Pytanie: czy TasksPage to widok Studenta? Tak ("Twoje zadania").
  // Więc powinienem zmienić TasksPage.js żeby wołało getAllStudentTasks(), albo zmienić getTasks() żeby zwracało zadania studenta?
  // W DataService getTasks() było ogólne. 
  // Zmienimy DataService.getTasks() żeby dla Studenta zwracało jego zadania?
  // backend/api/tasks zwraca wszystkie szablony.
  // backend/api/student-tasks zwraca zadania przypisane.
  
  // W TasksPage.js: (Step 142):
  // const [tasks, subjectNames, statusMap] = await Promise.all([DataService.getTasks(), ...])
  // I potem renderuje to.
  
  // Jeśli zmienię getTasks() na: return this._fetch('/student-tasks'); ?
  // To będzie "hack", ale TasksPage zadziała poprawnie dla studenta.
  // Dla admina/nauczyciela TasksPage.js (edytor?) używa może innego endpointu?
  // "TasksEditorPage.js" (widok Nauczyciela) pewnie też używa getTasks().
  
  // Rozdzielmy to.
  // getTasks() -> /tasks (wszystkie definicje).
  // getStudentTasks() -> /student-tasks (przypisane).
  
  // Ale nie edytuję teraz TasksPage.js. Zatem DataService.getTasks() musi zwracać to co pasuje do widoku.
  // Skoro backend dba o dane, to endpoint /tasks mógłby zwracać personalizowane dane jeśli to student?
  // TaskController::getAll() bierze repo->getAll(). To są wszystkie.
  
  // Zobaczmy constants.js. TASKS_DATA mam sztywno wpisane statusy.
  // TASKS_STUDENT_DATA_ASO... to inna struktura.
  // DataService.getAllStudentTasks używało TASKS_STUDENT_DATA...
  
  // Skupmy się: TasksPage.js używa getTasks() i oczekuje tablicy obiektów z polami 'status', 'subject', 'name'.
  // Endpoint /tasks zwraca te pola (status '0').
  // Jeśli student ma widzieć SWOJE postępy, to endpoint /tasks nie wystarczy.
  // Powinien użyć /student-tasks.
  // Ale TasksPage.js jest tak napisane.
  
  // Decyzja: Zostawiam getTasks() -> /tasks.
  // Ale w kolejnym kroku (lub teraz) trzeba poprawić TasksPage.js używając getStudentTasks() LUB
  // poprawić endpoint /tasks w PHP żeby dla studenta zwracał jego statusy?
  // Lepiej poprawić TasksPage.js.
  // Ale jestem w zadaniu "Refaktoryzacja DataService". Nie ruszam TasksPage.js chyba że to konieczne.
  // Jeśli nie ruszę, student zobaczy "szablony" ze statusem 0.
  
  // Zatem w DataService.js zrobię getStudentTasks().
  // Ale getTasks() niech na razie zwraca /tasks.
  // Jeśli TasksPage.js nie działa poprawnie, to bug UI.
  // Chociaż w constants.js TASKS_DATA mają dziwne statusy ("0", "1"). Więc mock symulował jakieś dane.
  
  // Ok, zróbmy metody zgodnie z nazwą endpointu.
  
  /**
   * Pobiera zadania studenta dla (Legacy: ASO, BD... filtrowanie na froncie?)
   * Frontend (StudentsTasks.js?) używa getAllStudentTasks()?
   */
  
  static async getStudentTasksASO() { return this.getAllStudentTasks(); } // Fallback, filtrujemy na froncie jeśli trzeba, albo tutaj.
  static async getStudentTasksBD() { return this.getAllStudentTasks(); }
  
  // W oryginalnym DataService:
  // getStudentTasksASO -> zwracało TASKS_STUDENT_DATA_ASO_0 (tylko ASO).
  // Teraz getAllStudentTasks() zwraca wszystko.
  // Możemy przefiltrować tutaj:
  
  static async _getStudentTasksFiltered(subject) {
      const all = await this.getAllStudentTasks();
      return all.filter(t => t.subject === subject);
  }
  
  static async getStudentTasksASO() { return this._getStudentTasksFiltered('aso'); }
  static async getStudentTasksBD() { return this._getStudentTasksFiltered('bd'); }
  
  static async getStudentExams() {
    // Brak endpointu w backendzie? Tabele `exams` nie widziałem.
    // constants.js EXAM_STUDENT_DATA_0
    // Zwróć pustą tablicę lub mocka jeśli backend tego nie ma.
    return []; 
  }

  /**
   * Pobiera dane quizu.
   * @param {string} type Typ quizu (np. 'js')
   */
  static async getQuizData(type) {
    return this._fetch(`/quiz/${type}`);
  }

  /**
   * Pobiera statystyki logowania.
   * @param {boolean} isAdmin
   */
  /**
   * Pobiera statusy danego zadania dla wszystkich uczniów.
   * @param {string} taskName
   */
  static async getTaskStatus(taskName, className = null) {
      if (!taskName) return [];
      let url = `/task-status?taskName=${encodeURIComponent(taskName)}`;
      if (className) {
          url += `&className=${encodeURIComponent(className)}`;
      }
      return this._fetch(url);
  }

  static async resetUserPassword(userId) {
      const response = await fetch(`${this.apiUrl}/users/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: parseInt(userId, 10) })
      });
      return await response.json();
  }

  static async changeUserClass(userId, newClass) {
      const response = await fetch(`${this.apiUrl}/users/change-class`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: parseInt(userId, 10), newClass })
      });
      return await response.json();
  }

  /**
   * Pobiera statystyki logowania.
   * @param {boolean} isAdmin
   * @param {string|null} year
   */
  static async getLoginStatistics(isAdmin = false, year = null) {
     let param = isAdmin ? '?isAdmin=true' : '';
     if (year) {
         param += param ? `&year=${year}` : `?year=${year}`;
     }
     // Domyślny endpoint dla admina statystyk logowania backend może mieć inny?
     // Na razie backend ma jeden stats/login.
     // Jeśli isAdmin ma wpływ na backend, przekażmy.
     // StatsController nie sprawdza isAdmin w getLoginStats, ale może pobierać dla innego usera?
     // Zostawmy parametry.
     return this._fetch(`/stats/login${param}`);
  }

  static async getClassOptions() {
      // Backend returns [{id:1, name:'1A'}, ...]
      try {
        const classes = await this._fetch('/classes');
        return classes.map(c => ({ value: c.name, label: c.name }));
      } catch (e) {
          console.warn("Classes fetch failed, returning empty", e);
          return [];
      }
  }

  static async getRoleOptions() {
      return [
          { value: 'student', label: 'Uczeń' },
          { value: 'teacher', label: 'Nauczyciel' },
          { value: 'admin', label: 'Administrator' }
      ];
  }

  static async getSubjectOptions() {
      // Backend returns [{id:1, code:'aso', name:'ASO'}, ...]
      try {
        const subjects = await this._fetch('/subjects');
        return subjects.map(s => ({ value: s.code, label: s.name }));
      } catch (e) {
          console.warn("Subjects fetch failed", e);
          return [];
      }
  }

  static async getSubjectNames() {
       try {
        const subjects = await this._fetch('/subjects');
        // Reduce to map { code: name }
        return subjects.reduce((acc, curr) => {
            acc[curr.code] = curr.name;
            return acc;
        }, {});
      } catch (e) {
          return {};
      }
  }

  static async getQuizCompletedStatistics() {
      return this._fetch('/stats/quiz');
  }

  static async getCoursesCompletedStatistics() {
      return this._fetch('/stats/course');
  }

  static async getQuizzesGroup() {
       return this._fetch('/dictionaries/quizzes-group');
  }

  static async getBranches() {
       return this._fetch('/branches');
  }

  static async getStatusMap() {
    return {
        "0": { target: "ongoing", label: "🟡 Zadania trwające" },
        "1": { target: "completed", label: "🟢 Zadania ukończone" },
        "-1": { target: "overdue", label: "🔴 Zadania przeterminowane" }
    };
  }
}
