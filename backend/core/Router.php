<?php
namespace Core;

class Router {
    public function dispatch($uri) {
        $path = trim(parse_url($uri, PHP_URL_PATH), '/');

        // Usuń prefix 'backend/api' jeśli istnieje (zależy od konfiguracji serwera, zakładamy że request trafia tu przez api.php)
        // Jeśli skrypt jest w backend/core/api.php, to URI może być /backend/api/tasks
        // Przyjmijmy dynamiczne dopasowanie
        if (strpos($path, 'backend/api/') !== false) {
             $path = substr($path, strpos($path, 'backend/api/') + strlen('backend/api/'));
        }

        // Routing
        if ($path === 'tasks') {
            return ['controller' => 'Tasks', 'action' => 'getAll'];
        }
        if ($path === 'courses') {
            return ['controller' => 'Courses', 'action' => 'getAll'];
        }
        if ($path === 'users') {
            return ['controller' => 'Users', 'action' => 'getAll'];
        }
        if ($path === 'branches') {
            return ['controller' => 'Dictionaries', 'action' => 'getBranches'];
        }
        
        // Słowniki
        if ($path === 'dictionaries/subjects') return ['controller' => 'Dictionaries', 'action' => 'getSubjects'];
        if ($path === 'dictionaries/roles') return ['controller' => 'Dictionaries', 'action' => 'getRoles'];
        if ($path === 'dictionaries/classes') return ['controller' => 'Dictionaries', 'action' => 'getClasses']; // Mock, bo nie ma tabeli classes
        if ($path === 'dictionaries/quizzes-group') return ['controller' => 'Dictionaries', 'action' => 'getQuizzesGroup'];

        // Statystyki
        if ($path === 'stats/login') return ['controller' => 'Stats', 'action' => 'getLoginStats'];
        if ($path === 'stats/quiz') return ['controller' => 'Stats', 'action' => 'getQuizStats'];
        if ($path === 'stats/course') return ['controller' => 'Stats', 'action' => 'getCourseStats'];

        // Zadania Studenta (z parametrami query string obsługiwanymi w kontrolerze)
        if ($path === 'student-tasks') {
            return ['controller' => 'Tasks', 'action' => 'getStudentTasks'];
        }

        // Quizy (np. quiz/js)
        if (preg_match('#^quiz/([a-z0-9]+)$#', $path, $matches)) {
            return ['controller' => 'Quizzes', 'action' => 'getByType', 'params' => $matches[1]];
        }
        
        // Logowanie
        if ($path === 'login') {
            return ['controller' => 'Auth', 'action' => 'login'];
        }

        return ['controller' => 'Error', 'action' => 'notFound'];
    }
}
