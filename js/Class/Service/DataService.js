import {
  TASKS_DATA,
  COURSES_DATA,
  USERS_DATA,
  TASKS_STUDENT_DATA_ASO,
  TASKS_STUDENT_DATA_BD,
  TASKS_STUDENT_DATA_ASO_0,
  TASKS_STUDENT_DATA_BD_0,
  TASKS_STUDENT_DATA_SO_0,
  TASKS_STUDENT_DATA_PAI_0,
  EXAM_STUDENT_DATA_0,
  QUIZ_DATA_JS,
  QUIZ_DATA_HTML,
  QUIZ_DATA_PHP,
  QUIZ_DATA_SO,
  QUIZ_DATA_UTK,
  QUIZ_DATA_CPP,
  LOGIN_STATISTICS_DATA_STUDENT_0,
  LOGIN_STATISTICS_DATA_ADMIN,
  QUIZ_COMPLETED_DATA_STUDENT_0,
  COURSES_COMPLETED_DATA_STUDENT_0,
  BRANCHES,
  SUBJECT_NAMES,
  STATUS_MAP,
  ROLE_OPTIONS,
  CLASS_OPTIONS,
  SUBJECT_OPTIONS,
  TASK_STATUS,
  DATA_QUIZZES_GROUP
} from "../Dashboard/constants.js";

/**
 * Serwis do obsługi danych.
 * Symuluje asynchroniczne pobieranie danych z backendu.
 * W przyszłości metody te będą wykonywać zapytania fetch() do API PHP.
 */
export class DataService {
  /**
   * Symuluje opóźnienie sieciowe.
   * @param {number} ms Czas opóźnienia w milisekundach.
   * @returns {Promise<void>}
   */
  static _delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Pobiera listę zadań.
   * @returns {Promise<Array>} Lista zadań.
   */
  static async getTasks() {
    await this._delay();
    return TASKS_DATA;
  }

  /**
   * Pobiera listę kursów.
   * @returns {Promise<Array>} Lista kursów.
   */
  static async getCourses() {
    await this._delay();
    return COURSES_DATA;
  }

  /**
   * Pobiera listę użytkowników.
   * @returns {Promise<Array>} Lista użytkowników.
   */
  static async getUsers() {
    await this._delay();
    return USERS_DATA;
  }

  /**
   * Pobiera wszystkie zadania studenta (Katarzyna Kowalczyk).
   * @returns {Promise<Array>}
   */
  static async getAllStudentTasks() {
    await this._delay();
    return [...TASKS_STUDENT_DATA_SO_0,...TASKS_STUDENT_DATA_ASO_0, ...TASKS_STUDENT_DATA_BD_0, ...TASKS_STUDENT_DATA_PAI_0];
  }


  /**
   * Pobiera zadania studenta dla przedmiotu ASO (Katarzyna Kowalczyk).
   * @returns {Promise<Array>}
   */
  static async getStudentTasksASO() {
    await this._delay();
    return TASKS_STUDENT_DATA_ASO_0;
  }

  /**
   * Pobiera zadania studenta dla przedmiotu BD (Katarzyna Kowalczyk).
   * @returns {Promise<Array>}
   */
  static async getStudentTasksBD() {
    await this._delay();
    return TASKS_STUDENT_DATA_BD_0;
  }

  /**
   * Pobiera wyniki egzaminów studenta.
   * @returns {Promise<Array>}
   */
  static async getStudentExams() {
    await this._delay();
    return EXAM_STUDENT_DATA_0;
  }

  /**
   * Pobiera dane quizu dla danego typu.
   * @param {string} type Typ quizu (np. 'js', 'html').
   * @returns {Promise<Array>} Pytania quizu.
   */
  static async getQuizData(type) {
    await this._delay();
    switch (type) {
      case 'js': return QUIZ_DATA_JS;
      case 'html': return QUIZ_DATA_HTML;
      case 'php': return QUIZ_DATA_PHP;
      case 'so': return QUIZ_DATA_SO;
      case 'utk': return QUIZ_DATA_UTK;
      case 'cpp': return QUIZ_DATA_CPP;
      default: return [];
    }
  }

  /**
   * Pobiera statystyki logowania.
   * @param {boolean} isAdmin Czy pobrać dane dla admina.
   * @returns {Promise<Array>}
   */
  static async getLoginStatistics(isAdmin = false) {
    await this._delay();
    return isAdmin ? LOGIN_STATISTICS_DATA_ADMIN : LOGIN_STATISTICS_DATA_STUDENT_0;
  }

  /**
   * Pobiera statystyki ukończonych quizów.
   * @returns {Promise<Array>}
   */
  static async getQuizCompletedStatistics() {
    await this._delay();
    return QUIZ_COMPLETED_DATA_STUDENT_0;
  }

  /**
   * Pobiera statystyki ukończonych kursów.
   * @returns {Promise<Array>}
   */
  static async getCoursesCompletedStatistics() {
    await this._delay();
    return COURSES_COMPLETED_DATA_STUDENT_0;
  }

  /**
   * Pobiera definicje branż.
   * @returns {Promise<Array>}
   */
  static async getBranches() {
    await this._delay();
    return BRANCHES;
  }
  
  /**
   * Pobiera mapę nazw przedmiotów.
   * @returns {Promise<Object>}
   */
  static async getSubjectNames() {
      await this._delay(100); // Krótsze opóźnienie dla słowników
      return SUBJECT_NAMES;
  }

  /**
   * Pobiera mapę statusów.
   * @returns {Promise<Object>}
   */
  static async getStatusMap() {
      await this._delay(100);
      return STATUS_MAP;
  }
  
  /**
   * Pobiera opcje ról.
   * @returns {Promise<Array>}
   */
  static async getRoleOptions() {
      await this._delay(100);
      return ROLE_OPTIONS;
  }

  /**
   * Pobiera opcje klas.
   * @returns {Promise<Array>}
   */
  static async getClassOptions() {
      await this._delay(100);
      return CLASS_OPTIONS;
  }

  /**
   * Pobiera opcje przedmiotów.
   * @returns {Promise<Array>}
   */
  static async getSubjectOptions() {
      await this._delay(100);
      return SUBJECT_OPTIONS;
  }

  /**
   * Pobiera statusy studentów dla danego zadania.
   * @param {string} taskName Nazwa zadania (opcjonalnie do filtrowania w przyszłości).
   * @returns {Promise<Array>}
   */
  static async getTaskStatus(taskName) {
      await this._delay(100);
      // W mocku zwracamy zawsze to samo, w przyszłości fetch z parametrem taskName
      return TASK_STATUS;
  }

  /**
   * Pobiera grupy quizów.
   * @returns {Promise<Array>}
   */
  static async getQuizzesGroup() {
      await this._delay(100);
      return DATA_QUIZZES_GROUP;
  }
}
