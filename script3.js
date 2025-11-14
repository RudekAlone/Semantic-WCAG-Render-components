import {DashboardRender} from './DashboardRender.js';

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
        name: 'Zalicz zadanie',
        id: 'task-complete',
        icon: '✅'
    },
    {
        name: 'Zadania ucznia',
        id: 'student-tasks',
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
        name: 'Ustawienia',
        id: 'settings',
        icon: '⚙️'
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