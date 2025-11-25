// constants.js
export const ROLE_OPTIONS = [
  { value: "student", text: "Uczeń" },
  { value: "teacher", text: "Nauczyciel" },
  { value: "admin", text: "Administrator" },
];

export const CLASS_OPTIONS = [
  { value: "1A", text: "1A" },
  { value: "2B", text: "2B" },
  { value: "3C", text: "3C" },
];

export const SUBJECT_OPTIONS = [
  { value: "", text: "Wybierz przedmiot" },
  { value: "all", text: "Wszystkie przedmioty" },
  { value: "aso", text: "Administracja Systemami Operacyjnymi" },
  { value: "so", text: "Systemy Operacyjne" },
  { value: "bd", text: "Bazy Danych" },
  { value: "pai", text: "Programowanie Aplikacji Internetowych" },
];

export const LOAD_USER_OPTIONS_ADMIN = [
  { value: "admins", text: "Załaduj administratorów" },
  { value: "teachers", text: "Załaduj nauczycieli" },
  { value: "1A", text: "Załaduj klasę 1A" },
  { value: "2B", text: "Załaduj klasę 2B" },
  { value: "3C", text: "Załaduj klasę 3C" },
];

export const LOAD_USER_OPTIONS_NON_ADMIN = [
  { value: "1A", text: "Załaduj klasę 1A" },
  { value: "2B", text: "Załaduj klasę 2B" },
  { value: "3C", text: "Załaduj klasę 3C" },
];

export const USERS_DATA = [
  [1, "Jan", "Kowalski", "Nowak", "jkowalski001", "🧑🏻‍🎓 Uczeń"],
  [2, "Anna", "Maria", "Wiśniewska", "awisniewska002", "🧑🏻‍🏫 Nauczyciel"],
  [3, "Piotr", "-", "Zieliński", "pzielinski003", "🤖 Administrator"],
  [4, "Katarzyna", "Ewa", "Kowalczyk", "kkowalczyk004", "🧑🏻‍🎓 Uczeń"],
  [5, "Michał", "-", "Kamiński", "mkaminski005", "🧑🏻‍🏫 Nauczyciel"],
  [
    6,
    "Agnieszka",
    "Joanna",
    "Lewandowska",
    "alewandowska006",
    "🤖 Administrator",
  ],
  [7, "Tomasz", "-", "Dąbrowski", "tdabrowski007", "🧑🏻‍🎓 Uczeń"],
];

export const SUBJECT_NAMES = {
  aso: "Administracja Systemami Operacyjnymi",
  so: "Systemy Operacyjne",
  bd: "Bazy Danych",
  pai: "Programowanie Aplikacji Internetowych",
};

export const STATUS_MAP = {
  0: { label: "🟡 Zadania trwające", target: "ongoing" },
  1: { label: "🟢 Zadania ukończone", target: "completed" },
  "-1": { label: "🔴 Zadania przeterminowane", target: "overdue" },
};

export const TASKS_DATA = [
  {
    id: 1,
    name: "Konfiguracja Domeny Active Directory",
    subject: "aso",
    status: "1",
    link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task10.md",
    deadline: "2024-05-20",
  },
  {
    id: 2,
    name: "Sortowanie i filtrowanie danych w SQL",
    subject: "bd",
    status: "1",
    link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task7.md",
    deadline: "2024-06-15",
  },
  {
    id: 3,
    name: "Aliasy nazw domenowych DNS",
    subject: "aso",
    status: "-1",
    link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task8.md",
    deadline: "2026-05-10",
  },
  {
    id: 4,
    name: "Zarządzanie Użytkownikami w Domenie",
    subject: "aso",
    status: "0",
    link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task9.md",
    deadline: "2026-05-25",
  },
  {
    id: 5,
    name: "Tworzenie bazy danych MySQL",
    subject: "bd",
    status: "0",
    link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task4.md",
    deadline: "2026-06-15",
  },
];

export const TASK_STATUS = [
  {
    userNumber: 1,
    userName: "Jan",
    userLastName: "Kowalski",
    status: true
  },
  {
    userNumber: 2,
    userName: "Katarzyna",
    userLastName: "Kowalczyk",
    status: false
  },
  {
    userNumber: 3,
    userName: "Tomasz",
    userLastName: "Dąbrowski",
    status: true
  },
];