import {DashboardRender} from '/js/Class/DashboardRender.js';
import { RenderButton } from '/js/Class/Render/RenderButton.js';

document.querySelector("header").appendChild(
    RenderButton.renderButton("Wyloguj się", "secondary", "button", () => {
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        window.location.href = "/";
    })
);
const main = document.querySelector('main');

const pages = [

    {
        name: 'Dashboard',
        id: 'dashboard',
        icon: '🏠',
        funkcja: "Nie mam pojęcia"
    },
    {
        name: 'Zadania',
        id: 'tasks',
        icon: '🗂️',
        funkcja: "Wyświetla zadania uczniowi które musi zrealizować i ich status 🟡 Zadania trwające,🟢 Zadania ukończone,🔴 Zadania przeterminowane"
    },
    {
        name: 'Statystyki',
        id: 'statistics',
        icon: '📊',
        funkcja: "Wyświetla statystyki: liczba logowań, stopnie zaliczeń zadań względem przedmiotu, stopień ukończenia kursów, stopień ukończenia quizów i na podstawie stopnia ukończenia kursów i quizów powstał wykres typu radar dopasowujący ucznia do danej branży IT"
    },
    {
        name: 'Kursy',
        id: 'courses',
        icon: '🎓',
        funkcja: "Wyświetla listę opublikowanych na stronie kursów w formie kart z obrazkami i nazwami kursów"
    },
    {
        name: "Quizzes",
        id: 'quizzes',
        icon: '❔',
        funkcja: "Wyświetla listę quizów. Wtedy ładuje mi się komponent quizu który działa tak: uczeń gdy źle odpowie to wyświetlam mu wyjaśnienie pytania, jak dobrze odpowie to mu tylko gratuluję na koniec guizu czyli 5 wylowosanych pytań z danej katrgori jest strona końcowa z wszystkimi wyjaśnieniami do pytań które były źle odpowiedziane. Jak uczeń 3 razy pod rząd dobrze odpowie to uznaję że już umie i pytanie wypada z puli losowań - to bedzie jeszcze do zaimplementowania na backendzie."
    },
    {
        name: 'Zalicz zadanie',
        id: 'status-tasks',
        icon: '✅',
        funkcja: "Strona typowa tylko dla mnie. Wybieram klasę i przedmiot. Ładuję wszystkie zadania. Mogę dne zadanie aktywoać dla wszystkich uczniów w klasie lub gdy jest aktywne to mam tabelę z uczniami i ich statusami do danego zadania. Wtedy przy pomocy checkboxów mogę masowo zmieniać statusy zadań uczniów na ukończone lub nieukończone."
    },
    {
        name: 'Zadania uczniów',
        id: 'students-tasks',
        icon: '📂',
        funkcja: "Strona gdzie nauczyciel może przeglądać sttusy zadań uczniów danej klasy i przedmiotu. Dodatkowo niezależnie od wybranego zadanie w ostatniej kolumnie są procentowe dane ukończenia wszystkich zadań ucznia w danym przedmiocie."
    },
    {
        name: 'Uczniowie',
        id: 'students',
        icon: '🧑‍🎓',
        funkcja: "Strona gdzie nauczyciel może przeglądać listę uczniów w danej klasie. Ładuje się tabela gdzie uczeń może zobaczyć jaki ma login i w razie problemów może zresetować hasło uczniowi."
    },
    {
        name: 'Klasy',
        id: 'classes',
        icon: '🏫',
        funkcja: "Strona która głównie służy do dodawania/usuwania oraz zmiany nazwy i roku szkolnego klas."
    },
    {
        name: 'Użytkownicy',
        id: 'users',
        icon: '👥',
        funkcja: "Strona gdzie admin może dodawać nowych użytkowników Względem roli (Uczeń, Nauczyciel, Admin) oraz usuwać użytkowników. W przypadku uczniów wymagane jest przypisanie ich do klasy. //TODO Dodanie opcji zmiany klasy ucznia."
    },
    {
        name: 'Zarządzaj zadaniami',
        id: 'manage-tasks',
        icon: '📝',
        funkcja: "Strona gdzie nauczyciel może dodawać/edytować zadania. Zadania są pisane w markdownie więc jest tam edytor markdown z podglądem na żywo. Dodatkowo przy dodawaniu zadania wybiera się przedmiot. //TODO dodanie sekcji na token repozytorium github z którego można by zapisać zadania."
    },
    {
        name: 'Zarządzaj kursami',
        id: 'manage-courses',
        icon: '📚',
        funkcja: "Strona gdzie admin może dodawać/edytować kursy. Kursy są podzielone na moduły a moduły na lekcje. Lekcje są pisane w markdownie więc jest tam edytor markdown z podglądem na żywo. Dodatkowo przy dodawaniu kursu wybiera się obrazek reprezentujący kurs. //TODO dodanie sekcji na token repozytorium github z którego można by zapisać kursy."
    }
];

const role = localStorage.getItem('user_role') || 'student';
let filteredPages = [];

if (role === 'admin') {
    filteredPages = pages;
} else if (role === 'teacher') {
    filteredPages = pages.filter(p => p.id !== 'users');
} else {
    // Default to student
    filteredPages = pages.slice(0, 5);
}

main.appendChild(DashboardRender.render(filteredPages));

