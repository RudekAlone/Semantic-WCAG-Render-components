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
  "0": { label: "🟡 Zadania trwające", target: "ongoing" },
  "1": { label: "🟢 Zadania ukończone", target: "completed" },
  "-1": { label: "🔴 Zadania przeterminowane", target: "overdue" },
};
