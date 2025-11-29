import {DashboardRender} from '../Class/DashboardRender.js';

const main = document.querySelector('main');

const pages = [

    {
        name: 'Dashboard',
        id: 'dashboard',
        icon: '🏠'
    },
    {
        name: 'Zadania',
        id: 'tasks',
        icon: '🗂️'
    },
    {
        name: 'Statystyki',
        id: 'statistics',
        icon: '📊'
    },
    {
        name: 'Kursy',
        id: 'courses',
        icon: '🎓'
    },
    {
        name: "Quizzes",
        id: 'quizzes',
        icon: '❔'
    },
    {
        name: 'Zalicz zadanie',
        id: 'tasks-status',
        icon: '✅'
    },
    {
        name: 'Zadania uczniów',
        id: 'students-tasks',
        icon: '📂'
    },
    {
        name: 'Uczniowie',
        id: 'students',
        icon: '🧑‍🎓'
    },
    {
        name: 'Klasy',
        id: 'classes',
        icon: '🏫'
    },
    {
        name: 'Użytkownicy',
        id: 'users',
        icon: '👥'
    },
    {
        name: 'Zarządzaj zadaniami',
        id: 'manage-tasks',
        icon: '📝'
    },
    {
        name: 'Zarządzaj kursami',
        id: 'manage-courses',
        icon: '📚'
    }
    
    
];

main.appendChild(DashboardRender.render(pages));

