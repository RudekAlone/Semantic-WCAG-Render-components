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
        if ($path === 'users') {
            return ['controller' => 'Users', 'action' => 'getAll'];
        }
        if ($path === 'users/reset-password') {
            return ['controller' => 'Users', 'action' => 'resetPassword'];
        }
        if ($path === 'users/change-class') {
            return ['controller' => 'Users', 'action' => 'changeClass'];
        }

        if ($path === 'tasks') {
            return ['controller' => 'Tasks', 'action' => 'getAll'];
        }
        if ($path === 'student-tasks') {
            return ['controller' => 'Tasks', 'action' => 'getStudentTasks'];
        }
        if ($path === 'task-status') {
             return ['controller' => 'Tasks', 'action' => 'getTaskStatus'];
        }

        if ($path === 'courses') {
            return ['controller' => 'Courses', 'action' => 'getAll'];
        }
        if (preg_match('#^courses/([a-zA-Z0-9-]+)$#', $path, $matches)) {
            return ['controller' => 'Courses', 'action' => 'view', 'params' => $matches[1]];
        }

        if ($path === 'classes') {
            return ['controller' => 'Classes', 'action' => 'getAll'];
        }
        if ($path === 'subjects') {
            return ['controller' => 'Subjects', 'action' => 'getAll'];
        }
        
        if ($path === 'branches') {
            return ['controller' => 'Dictionaries', 'action' => 'getBranches'];
        }
        
        // Słowniki (Legacy or Group)
        if ($path === 'dictionaries/quizzes-group') return ['controller' => 'Dictionaries', 'action' => 'getQuizzesGroup'];

        // Statystyki
        if ($path === 'stats/login') return ['controller' => 'Stats', 'action' => 'getLoginStats'];
        if ($path === 'stats/quiz') return ['controller' => 'Stats', 'action' => 'getQuizStats'];
        if ($path === 'stats/course') return ['controller' => 'Stats', 'action' => 'getCourseStats'];

        // Quizy (np. quiz/js)
        if (preg_match('#^quiz/([a-z0-9]+)$#', $path, $matches)) {
            return ['controller' => 'Quizzes', 'action' => 'getByType', 'params' => $matches[1]];
        }
        
        // Logowanie i Autoryzacja
        if ($path === 'login' || $path === 'auth/login') {
            return ['controller' => 'Auth', 'action' => 'login'];
        }
        if ($path === 'auth/check') {
            return ['controller' => 'Auth', 'action' => 'check'];
        }
        if ($path === 'auth/logout') {
            return ['controller' => 'Auth', 'action' => 'logout'];
        }

        return ['controller' => 'Error', 'action' => 'notFound'];
    }
}
