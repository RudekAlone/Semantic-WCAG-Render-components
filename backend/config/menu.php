<?php

return [
    [
        'name' => 'Dashboard',
        'id' => 'dashboard',
        'icon' => '🏠',
        'funkcja' => "Strona główna",
        'roles' => ['student', 'teacher', 'admin']
    ],
    [
        'name' => 'Zadania',
        'id' => 'tasks',
        'icon' => '🗂️',
        'funkcja' => "Lista zadań do zrealizowania",
        'roles' => ['student']
    ],
    [
        'name' => 'Statystyki',
        'id' => 'statistics',
        'icon' => '📊',
        'funkcja' => "Statystyki postępów ucznia",
        'roles' => ['student', 'teacher', 'admin']
    ],
    [
        'name' => 'Kursy',
        'id' => 'courses',
        'icon' => '🎓',
        'funkcja' => "Lista dostępnych kursów",
        'roles' => ['student', 'teacher', 'admin']
    ],
    [
        'name' => 'Quizzes',
        'id' => 'quizzes',
        'icon' => '❔',
        'funkcja' => "Rozwiązywanie quizów",
        'roles' => ['student', 'teacher', 'admin']
    ],
    [
        'name' => 'Zalicz zadanie',
        'id' => 'status-tasks',
        'icon' => '✅',
        'funkcja' => "Zarządzanie zaliczeniami dla klasy",
        'roles' => ['teacher', 'admin']
    ],
    [
        'name' => 'Zadania uczniów',
        'id' => 'students-tasks',
        'icon' => '📂',
        'funkcja' => "Podgląd postępów uczniów",
        'roles' => ['teacher', 'admin']
    ],
    [
        'name' => 'Uczniowie',
        'id' => 'students',
        'icon' => '🧑‍🎓',
        'funkcja' => "Lista uczniów i reset haseł",
        'roles' => ['teacher', 'admin']
    ],
    [
        'name' => 'Klasy',
        'id' => 'classes',
        'icon' => '🏫',
        'funkcja' => "Zarządzanie klasami",
        'roles' => ['teacher', 'admin']
    ],
        [
        'name' => 'Użytkownicy',
        'id' => 'users',
        'icon' => '👥',
        'funkcja' => "Administracja użytkownikami",
        'roles' => ['admin']
    ],
    [
        'name' => 'Zarządzaj zadaniami',
        'id' => 'manage-tasks',
        'icon' => '📝',
        'funkcja' => "Edytor zadań",
        'roles' => ['teacher', 'admin']
    ],
    [
        'name' => 'Zarządzaj quizami',
        'id' => 'manage-quizzes',
        'icon' => '🗂️',
        'funkcja' => "Edytor quizów",
        'roles' => ['teacher', 'admin']
    ],

    [
        'name' => 'Zarządzaj kursami',
        'id' => 'manage-courses',
        'icon' => '📚',
        'funkcja' => "Edytor kursów",
        'roles' => ['admin']
    ]
];
