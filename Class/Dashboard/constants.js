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
  [1, "Jan", "Marek", "Nowak", "jnowak001", "🧑🏻‍🎓 Uczeń"],
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
    partName: "AD",
    subject: "aso",
    status: "0",
    link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task10.md",
    deadline: "2024-05-20",
  },
  {
    id: 2,
    name: "Sortowanie i filtrowanie danych w SQL",
    partName: "SQL",
    subject: "bd",
    status: "1",
    link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task7.md",
    deadline: "2024-06-15",
  },
  {
    id: 3,
    name: "Aliasy nazw domenowych DNS",
    partName: "DNS",
    subject: "aso",
    status: "-1",
    link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task8.md",
    deadline: "2026-05-10",
  },
  {
    id: 4,
    name: "Zarządzanie Użytkownikami w Domenie",
    partName: "AD",
    subject: "aso",
    status: "0",
    link: "https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task9.md",
    deadline: "2026-05-25",
  },
  {
    id: 5,
    name: "Tworzenie bazy danych MySQL",
    partName: "MySQL",
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
    status: 1
  },
  {
    userNumber: 2,
    userName: "Katarzyna",
    userLastName: "Kowalczyk",
    status: -1
  },
  {
    userNumber: 3,
    userName: "Tomasz",
    userLastName: "Dąbrowski",
    status: true
  },
];



  export const DATA_QUIZZES_GROUP = [
    { value: "inf02", text: "INF.02" },
    { value: "inf03", text: "INF.03" },
    { value: "so", text: "Systemy operacyjne" },
    { value: "utk", text: "Urządzenia Techniki Komputerowej" },
    
    { value: "sk", text: "Sieci komputerowe" },
    { value: "bd", text: "Bazy danych" },
    { value: "js", text: "JavaScript" },
    { value: "html", text: "HTML" },
    { value: "css", text: "CSS" },
    { value: "php", text: "PHP" },
    { value: "cpp", text: "C++" }
  ]

  export const QUIZ_DATA_JS =[
      {
        id: 1,
        question: "Co to jest zmienna w JavaScript? Co to jest zmienna w JavaScript? Co to jest zmienna w JavaScript? Co to jest zmienna w JavaScript? Co to jest zmienna w JavaScript?",
        options: [
          "Miejsce do przechowywania danych",
          "Funkcja do wykonywania zadań",
          "Typ danych",
          "Operator matematyczny",
        ],
        answer: 0,
        img: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
        imgAlt: "Logo JavaScript",
        explanation: "Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.Zmienna to nazwana przestrzeń w pamięci, która przechowuje dane, które mogą być używane i modyfikowane w trakcie działania programu.",
        explanationImg: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
        explanationImgAlt: "Logo JavaScript"
      },
      {
        id: 2,
        question: "Jak zadeklarować funkcję w JavaScript? Jak zadeklarować funkcję w JavaScript? Jak zadeklarować funkcję w JavaScript? Jak zadeklarować funkcję w JavaScript?Jak zadeklarować funkcję w JavaScript?",
        options: [
          "function myFunction() {}",
          "var myFunction = []",
          "let myFunction = {}",
          "const myFunction = () => {}",
        ],
        answer: 0,
        img: null,
        imgAlt: null,
        explanation: "Funkcję w JavaScript można zadeklarować za pomocą słowa kluczowego 'function', po którym następuje nazwa funkcji i nawiasy okrągłe.",
        explanationImg: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      explanationImgAlt: "Logo JavaScript"
      },
    ];
  export const QUIZ_DATA_HTML =[
      {
        id: 1,
        question: "Co oznacza skrót HTML?",
        options: [
          "HyperText Markup Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language",
          "Hyperlinking Text Markup Language",
        ],
        answer: 0,
        img: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
        imgAlt: "Logo HTML5",
        explanation: "HTML to skrót od HyperText Markup Language, czyli języka znaczników hipertekstowych, używanego do tworzenia stron internetowych.",
        explanationImg: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
        explanationImgAlt: "Logo HTML5"
      },
    ];
  export const QUIZ_DATA_PHP =[
      {
        id: 1,
        question: "Co to jest PHP?",
        options: [
          "Język skryptowy po stronie serwera",
          "Język znaczników",
          "System zarządzania bazą danych",
          "Framework do tworzenia aplikacji webowych",
        ],
        answer: 0,
        img: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
        imgAlt: "Logo PHP",
        explanation: "PHP to język skryptowy po stronie serwera, używany głównie do tworzenia dynamicznych stron internetowych i aplikacji webowych.",
        explanationImg: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
        explanationImgAlt: "Logo PHP"
      },
    ];
  export const QUIZ_DATA_SO =[
      {
        id: 1,
        question: "Co to jest system operacyjny?",
        options: [
          "Oprogramowanie zarządzające zasobami komputera",
          "Program do edycji tekstu",
          "Aplikacja do przeglądania internetu",
          "Narzędzie do tworzenia grafiki",
        ],
        answer: 0,
        img: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Windows_logo_-_2021.svg",
        imgAlt: "Logo systemu operacyjnego",
        explanation: "System operacyjny to oprogramowanie zarządzające zasobami komputera, umożliwiające uruchamianie aplikacji i kontrolujące sprzęt komputerowy.",
        explanationImg: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Windows_logo_-_2021.svg",
        explanationImgAlt: "Logo systemu operacyjnego"
      },
    ];
  export const QUIZ_DATA_UTK =[
      {
        id: 1,
        question: "Co to jest CPU?",
        options: [
          "Central Processing Unit",
          "Computer Power Unit",
          "Central Performance Unit",
          "Computer Processing Unit",
        ],
        answer: 0,
        img: "https://upload.wikimedia.org/wikipedia/commons/1/10/Intel_CPU_Logo.svg",
        imgAlt: "Logo CPU",
        explanation: "CPU (Central Processing Unit) to centralna jednostka przetwarzająca, która wykonuje instrukcje programów i zarządza operacjami komputera.",
        explanationImg: "https://upload.wikimedia.org/wikipedia/commons/1/10/Intel_CPU_Logo.svg",
        explanationImgAlt: "Logo CPU"
      },
    ];
  export const QUIZ_DATA_CPP =[
      {
        id: 1,
        question: "Kto jest twórcą języka C++?",
        options: [
          "Bjarne Stroustrup",
          "Dennis Ritchie",
          "James Gosling",
          "Guido van Rossum",
        ],
        answer: 0,
        img: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
        imgAlt: "Logo C++",
        explanation: "Język C++ został stworzony przez Bjarne Stroustrupa w 1983 roku jako rozszerzenie języka C, dodając do niego obiektowe podejście do programowania.",
        explanationImg: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
        explanationImgAlt: "Logo C++"
      },
    ];

export const COURSES_DATA = [
  {
    id: 1,
    name: "Windows 11",
    hash: "windows-11",
    img: "windows11.webp"
  },
  {
    id: 2,
    name: "Ubuntu 24.04 Desktop",
    hash: "ubuntu-24.04-desktop",
    img: "ubuntuDesktop.webp"
  },
  {
    id: 3,
    name: "Windows Server 2025",
    hash: "windows-server-2025",
    img: "windowsServer2025.webp"
  },
  {
    id: 4,
    name: "VirtualBox",
    hash: "virtualbox",
    img: "VirtualBox.webp"
  },
  {
    id: 5,
    name: "JavaScript",
    hash: "javascript",
    img: "javascript.webp"
  },
  
];

export const TASKS_STUDENT_DATA_ASO = [
  {
    name: "Konfiguracja Domeny Active Directory",
    subject: "aso",
    status: "1",
    deadline: "2024-05-20",
    studentName: "Jan",
    studentMiddleName: "Marek",
    studentLastName: "Kowalski"
  },
    {
    name: "Konfiguracja Domeny Active Directory",
    subject: "aso",
    status: "0",
    deadline: "2024-05-20",
    studentName: "Anna",
    studentMiddleName: "Maria",
    studentLastName: "Wiśniewska"
  },
      {
    name: "Konfiguracja Domeny Active Directory",
    subject: "aso",
    status: "0",
    deadline: "2024-05-20",
    studentName: "Piotr",
    studentMiddleName: "-",
    studentLastName: "Zieliński"
  },
        {
    name: "Konfiguracja Domeny Active Directory",
    subject: "aso",
    status: "1",
    deadline: "2024-05-20",
    studentName: "Katarzyna",
    studentMiddleName: "Ewa",
    studentLastName: "Kowalczyk"
  },

  
  {
    name: "Aliasy nazw domenowych DNS",
    partName: "DNS",
    subject: "aso",
    status: "-1",
    deadline: "2026-05-10",
    studentName: "Jan",
    studentMiddleName: "Marek",
    studentLastName: "Kowalski"
  },
  {
    name: "Aliasy nazw domenowych DNS",
    partName: "DNS",
    subject: "aso",
    status: "0",
    deadline: "2026-05-10",
    studentName: "Anna",
    studentMiddleName: "Maria",
    studentLastName: "Wiśniewska"
  },
  {
    name: "Aliasy nazw domenowych DNS",
    partName: "DNS",
    subject: "aso",
    status: "0",
    deadline: "2026-05-10",
    studentName: "Piotr",
    studentMiddleName: "-",
    studentLastName: "Zieliński"
  },
  {    name: "Aliasy nazw domenowych DNS",
    partName: "DNS",
    subject: "aso",
    status: "1",
    deadline: "2026-05-10",
    studentName: "Katarzyna",
    studentMiddleName: "Ewa",
    studentLastName: "Kowalczyk"
  },
  {    name: "Zarządzanie Użytkownikami w Domenie",
    partName: "AD",
    subject: "aso",
    status: "0",
    deadline: "2026-05-25",
    studentName: "Jan",
    studentMiddleName: "Marek",
    studentLastName: "Kowalski"
  },
  {
    name: "Zarządzanie Użytkownikami w Domenie",
    partName: "AD",
    subject: "aso",
    status: "0",
    deadline: "2026-05-25",
    studentName: "Anna",
    studentMiddleName: "Maria",
    studentLastName: "Wiśniewska"
  },
  {    name: "Zarządzanie Użytkownikami w Domenie",
    partName: "AD",
    subject: "aso",
    status: "0",
    deadline: "2026-05-25",
    studentName: "Piotr",
    studentMiddleName: "-",
    studentLastName: "Zieliński"
  },
  {
    name: "Zarządzanie Użytkownikami w Domenie",
    partName: "AD",
    subject: "aso",
    status: "1",
    deadline: "2026-05-25",
    studentName: "Katarzyna",
    studentMiddleName: "Ewa",
    studentLastName: "Kowalczyk"
  },
  
];
export const TASKS_STUDENT_DATA_BD = [
  {
    name: "Sortowanie i filtrowanie danych w SQL",
    partName: "SQL",
    subject: "bd",
    status: "1",
    deadline: "2024-06-15",
    studentName: "Jan",
    studentMiddleName: "Marek",
    studentLastName: "Kowalski"
  },
  {
    name: "Sortowanie i filtrowanie danych w SQL",
    partName: "SQL",
    subject: "bd",
    status: "0",
    deadline: "2024-06-15",
    studentName: "Anna",
    studentMiddleName: "Maria",
    studentLastName: "Wiśniewska"
  },
  {
    name: "Sortowanie i filtrowanie danych w SQL",
    partName: "SQL",
    subject: "bd",
    status: "1",
    deadline: "2024-06-15",
    studentName: "Piotr",
    studentMiddleName: "-",
    studentLastName: "Zieliński"
  },
  {    name: "Sortowanie i filtrowanie danych w SQL",
    partName: "SQL",
    subject: "bd",
    status: "1",
    deadline: "2024-06-15",
    studentName: "Katarzyna",
    studentMiddleName: "Ewa",
    studentLastName: "Kowalczyk"
  },
  {
    name: "Tworzenie bazy danych MySQL",
    partName: "MySQL",
    subject: "bd",
    status: "0",
    deadline: "2026-06-15",
    studentName: "Jan",
    studentMiddleName: "Marek",
    studentLastName: "Kowalski"
  },
  {    name: "Tworzenie bazy danych MySQL",
    partName: "MySQL",
    subject: "bd",
    status: "0",
    deadline: "2026-06-15",
    studentName: "Anna",
    studentMiddleName: "Maria",
    studentLastName: "Wiśniewska"
  },
  {
    name: "Tworzenie bazy danych MySQL",
    partName: "MySQL",
    subject: "bd",
    status: "0",
    deadline: "2026-06-15",
    studentName: "Piotr",
    studentMiddleName: "-",
    studentLastName: "Zieliński"
  },
  {    name: "Tworzenie bazy danych MySQL",
    partName: "MySQL",
    subject: "bd",
    status: "0",
    deadline: "2026-06-15",
    studentName: "Katarzyna",
    studentMiddleName: "Ewa",
    studentLastName: "Kowalczyk"
  },
]

export const TASKS_STUDENT_DATA_SO = [
  {
    name: "Konfiguracja Domeny Active Directory",
    subject: "so",
    status: "1",
    deadline: "2024-05-20",
    studentName: "Jan",
    studentMiddleName: "Marek",
    studentLastName: "Kowalski"
  },
    {
    name: "Konfiguracja Domeny Active Directory",
    subject: "so",
    status: "0",
    deadline: "2024-05-20",
    studentName: "Anna",
    studentMiddleName: "Maria",
    studentLastName: "Wiśniewska"
  },
      {
    name: "Konfiguracja Domeny Active Directory",
    subject: "so",
    status: "0",
    deadline: "2024-05-20",
    studentName: "Piotr",
    studentMiddleName: "-",
    studentLastName: "Zieliński"
  },
        {
    name: "Konfiguracja Domeny Active Directory",
    subject: "so",
    status: "1",
    deadline: "2024-05-20",
    studentName: "Katarzyna",
    studentMiddleName: "Ewa",
    studentLastName: "Kowalczyk"
  },

  
  {
    name: "Aliasy nazw domenowych DNS",
    partName: "DNS",
    subject: "so",
    status: "-1",
    deadline: "2026-05-10",
    studentName: "Jan",
    studentMiddleName: "Marek",
    studentLastName: "Kowalski"
  },
  {
    name: "Aliasy nazw domenowych DNS",
    partName: "DNS",
    subject: "so",
    status: "0",
    deadline: "2026-05-10",
    studentName: "Anna",
    studentMiddleName: "Maria",
    studentLastName: "Wiśniewska"
  },
  {
    name: "Aliasy nazw domenowych DNS",
    partName: "DNS",
    subject: "so",
    status: "0",
    deadline: "2026-05-10",
    studentName: "Piotr",
    studentMiddleName: "-",
    studentLastName: "Zieliński"
  },
  {    name: "Aliasy nazw domenowych DNS",
    partName: "DNS",
    subject: "so",
    status: "1",
    deadline: "2026-05-10",
    studentName: "Katarzyna",
    studentMiddleName: "Ewa",
    studentLastName: "Kowalczyk"
  },
  {    name: "Zarządzanie Użytkownikami w Domenie",
    partName: "AD",
    subject: "so",
    status: "0",
    deadline: "2026-05-25",
    studentName: "Jan",
    studentMiddleName: "Marek",
    studentLastName: "Kowalski"
  },
  {
    name: "Zarządzanie Użytkownikami w Domenie",
    partName: "AD",
    subject: "so",
    status: "0",
    deadline: "2026-05-25",
    studentName: "Anna",
    studentMiddleName: "Maria",
    studentLastName: "Wiśniewska"
  },
  {    name: "Zarządzanie Użytkownikami w Domenie",
    partName: "AD",
    subject: "so",
    status: "0",
    deadline: "2026-05-25",
    studentName: "Piotr",
    studentMiddleName: "-",
    studentLastName: "Zieliński"
  },
  {
    name: "Zarządzanie Użytkownikami w Domenie",
    partName: "AD",
    subject: "so",
    status: "1",
    deadline: "2026-05-25",
    studentName: "Katarzyna",
    studentMiddleName: "Ewa",
    studentLastName: "Kowalczyk"
  },
  
];

export const TASKS_STUDENT_DATA_PAI =[
  {
    name: "Tworzenie stron internetowych",
    subject: "pai",
    status: "1",
    deadline: "2024-07-10",
    studentName: "Jan",
    studentMiddleName: "Marek",
    studentLastName: "Kowalski"
  },
    {
    name: "Tworzenie stron internetowych",
    subject: "pai",
    status: "0",
    deadline: "2024-07-10",
    studentName: "Anna",
    studentMiddleName: "Maria",
    studentLastName: "Wiśniewska"
  },
      {
    name: "Tworzenie stron internetowych",
    subject: "pai",
    status: "0",
    deadline: "2024-07-10",
    studentName: "Piotr",
    studentMiddleName: "-",
    studentLastName: "Zieliński"
  },
        {
    name: "Tworzenie stron internetowych",
    subject: "pai",
    status: "1",
    deadline: "2024-07-10",
    studentName: "Katarzyna",
    studentMiddleName: "Ewa",
    studentLastName: "Kowalczyk"
  },


]


export const TASKS_STUDENT_DATA_ASO_0 = TASKS_STUDENT_DATA_ASO.filter(student => student.studentName === "Katarzyna" && student.studentLastName === "Kowalczyk");
export const TASKS_STUDENT_DATA_BD_0 = TASKS_STUDENT_DATA_BD.filter(student => student.studentName === "Katarzyna" && student.studentLastName === "Kowalczyk");
export const TASKS_STUDENT_DATA_SO_0 = TASKS_STUDENT_DATA_SO.filter(student => student.studentName === "Katarzyna" && student.studentLastName === "Kowalczyk");
export const TASKS_STUDENT_DATA_PAI_0 = TASKS_STUDENT_DATA_PAI.filter(student => student.studentName === "Katarzyna" && student.studentLastName === "Kowalczyk");

export const MONTH_NAMES_PL = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień"
];
export const DAY_NAMES_PL = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota"
];
export const LOGIN_STATISTICS_DATA_STUDENT_0 = [
  { date: "2024-01", logins: 15 },
  { date: "2024-02", logins: 22 },
  { date: "2024-03", logins: 18 },
  { date: "2024-04", logins: 30 },
  { date: "2024-05", logins: 25 },
  { date: "2024-06", logins: 28 },
  { date: "2024-07", logins: 35 },
];
export const LOGIN_STATISTICS_DATA_ADMIN = [
  { date: "2024-01", logins: 5 },
  { date: "2024-02", logins: 8 },
  { date: "2024-03", logins: 6 },
  { date: "2024-04", logins: 10 },
  { date: "2024-05", logins: 7 },
  { date: "2024-06", logins: 9 },
  { date: "2024-07", logins: 12 },
];

export const QUIZ_COMPLETED_DATA_STUDENT_0 = [
  { quizName: "javascript", completed: 27 , count: 132},
  { quizName: "html", completed: 15 , count: 98},
  { quizName: "css", completed: 10 , count: 76},
  { quizName: "php", completed: 8 , count: 54},
  { quizName: "cpp", completed: 5 , count: 32},
  { quizName: "so", completed: 89 , count: 272},
  { quizName: "utk", completed: 34 , count: 145},
  { quizName: "bd", completed: 22 , count: 118},
  { quizName: "inf02", completed: 12 , count: 67},
  { quizName: "inf03", completed: 9 , count: 45},
  { quizName: "sk", completed: 14 , count: 78},
];

export const COURSES_COMPLETED_DATA_STUDENT_0 = [
  { courseName: "windows-11", completed: 45, count: 150 },
  { courseName: "ubuntu-24.04-desktop", completed: 30, count: 120 },
  { courseName: "windows-server-2025", completed: 25, count: 100 },
  { courseName: "virtualbox", completed: 20, count: 80 },
  { courseName: "javascript", completed: 50, count: 200 },

];

/**
 * BRANCHES
 * Lista branż (kategorii) używana do dopasowywania kursów i quizów.
 * Każdy obiekt ma pola:
 * - `key` (string)   : nazwa branży wyświetlana na wykresie
 * - `quizNames` (array): (opcjonalne) canonicalne identyfikatory quizów (`quizName` z danych)
 * - `courseNames` (array): (opcjonalne) canonicalne identyfikatory kursów (`courseName` z danych)
 *
 * Zasada działania przy dopasowywaniu:
 * 1) Jeśli `names` istnieje i zawiera elementy -> najpierw porównujemy nazwę kursu/quizu do `names` (exact/token match).
 * 2) Jeśli `quizNames`/`courseNames` nie istnieją lub brak dopasowań -> brak dopasowań (preferujemy stałe nazwy zamiast fuzzy matching).
 *
 * W `names` podajemy przykładowe slug'i kursów (`courseName` z danych) oraz identyfikatory quizów (`quizName`).
 * To pozwoli uniknąć fałszywych trafień (np. 'ip' w 'javascript').
 */
export const BRANCHES = [
  {
    key: "Frontend",
    quizNames: ["javascript", "html", "css"],
    courseNames: ["javascript"]
  },
  {
    key: "Backend",
    quizNames: ["php", "bd"],
    courseNames: ["mysql"]
  },
  {
    key: "Fullstack",
    quizNames: [],
    courseNames: []
  },
  {
    key: "Mobile",
    quizNames: [],
    courseNames: []
  },
  {
    key: "DevOps/Cloud",
    quizNames: [],
    courseNames: ["virtualbox", "docker", "kubernetes", "aws", "azure"]
  },
  {
    key: "Cyberbezpieczeństwo",
    quizNames: [],
    courseNames: []
  },
  {
    key: "Data Science",
    quizNames: [],
    courseNames: []
  },
  {
    key: "Grafika 2D",
    quizNames: [],
    courseNames: []
  },
  {
    key: "Game Dev",
    quizNames: [],
    courseNames: []
  },
  {
    key: "Grafika 3D",
    quizNames: [],
    courseNames: []
  },
  {
    key: "Sieci",
    quizNames: ["sk"],
    courseNames: []
  },
  {
    key: "Sprzęt",
    quizNames: [],
    courseNames: ["hardware", "bios", "pc"]
  },
  {
    key: "Systemy",
    quizNames: [],
    courseNames: ["windows-11", "windows-server-2025", "ubuntu-24.04-desktop", "virtualbox"]
  }
];

export const EXAM_STUDENT_DATA_0 = [
    {
    name: "INF.02",
    part: "teoretyczna",
    date: "2024-06-22",
    result: 90
  },
  {
    name: "INF.02",
    part: "praktyczna",
    date: "2024-06-20",
    result: -1
  },
  {
    name: "INF.03",
    part: "teoretyczna",
    date: "2026-07-17",
  },
  {
    name: "INF.03",
    part: "praktyczna",
    date: "2026-07-23",
  },

];